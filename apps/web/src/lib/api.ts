import type { ApiError, RoastResponse } from "@gitblamed/types";

export async function fetchRoast(username: string): Promise<RoastResponse> {
  const response = await fetch(`/api/roast/${encodeURIComponent(username)}`);
  const json = (await response.json()) as RoastResponse | ApiError;

  if (!response.ok || "error" in json) {
    throw new Error("error" in json ? json.error : "Unable to roast this profile.");
  }

  return json;
}

export function shareImageUrl(username: string): string {
  return `/api/share/${encodeURIComponent(username)}.svg`;
}