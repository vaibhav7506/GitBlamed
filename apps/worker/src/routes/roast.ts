import { Hono } from "hono";
import type { RoastResponse } from "@gitblamed/types";
import { getCachedRoast, setCachedRoast } from "../services/cache";
import { generateRoast } from "../services/ai";
import { fetchContributionCalendar } from "../services/github";
import { parseCalendar } from "../services/parser";
import { renderShareImage } from "../services/shareImage";
import type { Env } from "../types";

const USERNAME_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export const roastRoute = new Hono<{ Bindings: Env }>();

roastRoute.get("/roast/:username", async (c) => {
  const username = c.req.param("username")?.trim() ?? "";

  if (!USERNAME_RE.test(username)) {
    return c.json({ error: "Invalid GitHub username." }, 400);
  }

  try {
    const cached = await getCachedRoast(c.env.ROAST_CACHE, username);
    if (cached) return c.json({ ...cached, cached: true });

    const response = await generateResponse(username, c.env);
    await setCachedRoast(c.env.ROAST_CACHE, username, response);
    return c.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate roast.";
    const status = message.toLowerCase().includes("not found") ? 404 : 500;
    return c.json({ error: message }, status);
  }
});

roastRoute.get("/share/:file", async (c) => 
  {
  const username = (c.req.param("file")?.trim() ?? "")
    .replace(/\.png$/, "")
    .replace(/\.svg$/, "");

  if (!USERNAME_RE.test(username)) {
    return c.json({ error: "Invalid GitHub username." }, 400);
  }

  try {
    const cached = await getCachedRoast(c.env.ROAST_CACHE, username);
    const data = cached ?? (await generateResponse(username, c.env));
    if (!cached) await setCachedRoast(c.env.ROAST_CACHE, username, data);
    return renderShareImage(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate share image.";
    return c.json({ error: message }, 500);
  }
});

roastRoute.get("/u/:username", async (c) => {
  const username = c.req.param("username")?.trim() ?? "";
  if (!USERNAME_RE.test(username)) return c.redirect("/");

  const origin = c.env.APP_ORIGIN ?? "https://gitblamed.dev";
  const imageUrl = `${origin}/api/share/${username}.svg`;
  const title = `${username} just got GitBlamed`;
  const description = "One handle. One heatmap. Three sentences of judgment.";

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta http-equiv="refresh" content="0;url=/?u=${username}" />
</head>
<body>Redirecting...</body>
</html>`);
});

async function generateResponse(username: string, env: Env): Promise<RoastResponse> {
  const calendar = await fetchContributionCalendar(username, env.GITHUB_TOKEN);
  const { days, stats } = parseCalendar(calendar);
  const roastText = await generateRoast(stats, env);

  return {
    username,
    heatmapData: days,
    roastText,
    stats,
    cached: false,
    generatedAt: new Date().toISOString(),
  };
}