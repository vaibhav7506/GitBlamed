import type { RoastResponse } from "@gitblamed/types";

const ONE_DAY_SECONDS = 60 * 60 * 24;

export async function getCachedRoast(
  kv: KVNamespace,
  username: string,
): Promise<RoastResponse | null> {
  try {
    const cached = await kv.get<RoastResponse>(cacheKey(username), "json");
    if (!cached) return null;

    const age = Date.now() - Date.parse(cached.generatedAt);
    if (Number.isNaN(age) || age > ONE_DAY_SECONDS * 1000) return null;

    return cached;
  } catch {
    // KV read failed — treat as cache miss, app continues normally
    return null;
  }
}

export async function setCachedRoast(
  kv: KVNamespace,
  username: string,
  response: RoastResponse,
): Promise<void> {
  try {
    await kv.put(cacheKey(username), JSON.stringify(response), {
      expirationTtl: ONE_DAY_SECONDS,
    });
  } catch {
    // KV write failed — silent. User already has their result.
    // The next request for this username just won't be cached. That is fine.
  }
}

function cacheKey(username: string): string {
  return `roast:${username.toLowerCase()}`;
}