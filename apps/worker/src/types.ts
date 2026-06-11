export type { ApiError, ContribStats, DayData, RoastResponse } from "@gitblamed/types";

export interface Env {
  ROAST_CACHE: KVNamespace;
  GITHUB_TOKEN?: string;
  GEMINI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GROQ_API_KEY?: string;
  APP_ORIGIN?: string;
}