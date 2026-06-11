import interRegular from "@fontsource/inter/files/inter-latin-400-normal.woff";
import satori from "satori";
import type { RoastResponse } from "@gitblamed/types";
import { buildShareCard } from "../components/ShareCard";

export async function renderShareImage(data: RoastResponse): Promise<Response> {
  const svg = await satori(
    buildShareCard(data.username, data.roastText, data.heatmapData, data.stats),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}