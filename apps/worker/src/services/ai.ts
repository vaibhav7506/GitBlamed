import type { ContribStats } from "@gitblamed/types";
import type { Env } from "../types";

export async function generateRoast(
  stats: ContribStats,
  env: Env,
): Promise<string> {
  if (stats.totalContributions === 0) {
    return "Zero contributions across 365 days is less a heatmap and more a digital ghost town. Your longest streak is 0 days, which is impressively consistent in the way an unplugged monitor is consistent. Still, maintaining that level of emptiness takes a kind of minimalist discipline.";
  }

  const prompt = buildPrompt(stats);

  try {
    if (env.GROQ_API_KEY) {
      return await generateWithGroq(prompt, env.GROQ_API_KEY);
    }
  } catch {
    // Groq failed — fall through to next provider
  }

  try {
    if (env.GEMINI_API_KEY) {
      return await generateWithGemini(prompt, env.GEMINI_API_KEY);
    }
  } catch {
    // Gemini failed — fall through to next provider
  }

  try {
    if (env.ANTHROPIC_API_KEY) {
      return await generateWithClaude(prompt, env.ANTHROPIC_API_KEY);
    }
  } catch {
    // Claude failed — fall through to deterministic local roast
  }

  return localRoast(stats);
}

export function buildPrompt(stats: ContribStats): string {
  return `You are a brutally honest but secretly fond senior engineer at a code review for a developer's annual GitHub activity report.

Their stats:
- Total contributions this year: ${stats.totalContributions}
- Longest streak: ${stats.longestStreak} days
- Days with zero commits: ${stats.zeroDays} out of 365
- Most active day of the week: ${stats.mostActiveDay}
- Pattern: ${stats.weekendVsWeekday} coder
- Peak month: ${stats.peakMonth}
- Average commits per active day: ${stats.avgPerActiveDay}

Your rules (non-negotiable):
1. Write exactly 3 sentences. No more. No less.
2. Mention at least 2 specific numbers from the stats above.
3. End with a backhanded compliment.
4. Sarcastic and witty, never cruel.
5. Give zero advice. Zero encouragement. Only the roast.

Output plain text only. No markdown. No bullet points. No quotes.`;
}

async function generateWithGroq(
  prompt: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 180,
        temperature: 0.85,
        messages: [{ role: "user", content: prompt }],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Groq failed with ${response.status}.`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned no text.");
  return text;
}

async function generateWithGemini(
  prompt: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 180 },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini failed with ${response.status}.`);
  }

  const json = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Gemini returned no text.");
  return text;
}

async function generateWithClaude(
  prompt: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 180,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude failed with ${response.status}.`);
  }

  const json = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };

  const text = json.content?.find((part) => part.type === "text")?.text?.trim();
  if (!text) throw new Error("Claude returned no text.");
  return text;
}

function localRoast(stats: ContribStats): string {
  return `You produced ${stats.totalContributions} contributions with a ${stats.longestStreak}-day streak, which is less "relentless shipping" and more "calendar-based suspense." With ${stats.zeroDays} quiet days and ${stats.mostActiveDay} somehow carrying the emotional burden, the heatmap has range in the way a smoke alarm has range. Still, averaging ${stats.avgPerActiveDay} commits per active day is almost professional if you squint kindly enough.`;
}
