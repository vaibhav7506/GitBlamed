import { create } from "zustand";
import type { RoastResponse } from "@gitblamed/types";
import { fetchRoast } from "../lib/api";

type Status = "idle" | "loading" | "success" | "error";
function extractUsername(input: string): string {
  const trimmed = input.trim().replace(/^@/, "");
  // Handles: https://github.com/torvalds, github.com/torvalds, torvalds
  const match = trimmed.match(/(?:github\.com\/)([a-zA-Z0-9][a-zA-Z0-9-]{0,38})\/?$/);
  if (match?.[1]) return match[1];
  return trimmed;
}
interface RoastState {
  username: string;
  status: Status;
  result: RoastResponse | null;
  error: string | null;
  setUsername: (username: string) => void;
  submit: () => Promise<void>;
}

export const useRoastStore = create<RoastState>((set, get) => ({
  username: "",
  status: "idle",
  result: null,
  error: null,
  setUsername: (username) => set({ username, error: null }),
 submit: async () => {
  const raw = get().username.trim();
  // Extract username from full URL or plain handle
  const username = extractUsername(raw);

  if (!username) {
    set({ status: "error", error: "Enter a GitHub handle first." });
    return;
  }

  set({ status: "loading", error: null, username });

  try {
    const result = await fetchRoast(username);
    set({ result, status: "success" });
  } catch (error) {
    set({
      status: "error",
      error: error instanceof Error ? error.message : "Something broke while roasting.",
    });
  }
},
}));
