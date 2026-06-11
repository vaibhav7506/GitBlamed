import { Hono } from "hono";
import { cors } from "hono/cors";
import { roastRoute } from "./routes/roast";
import type { Env } from "./types";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowed = c.env.APP_ORIGIN ?? "http://127.0.0.1:5174";
      return origin === allowed ? origin : allowed;
    },
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));
app.route("/api", roastRoute);

export default app;
