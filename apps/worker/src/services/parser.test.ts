import { describe, expect, it } from "vitest";
import { parseCalendar } from "./parser";
import type { RawCalendar } from "./github";

describe("parseCalendar", () => {
  it("handles a zero-contribution account", () => {
    const calendar = makeCalendar(Array.from({ length: 365 }, () => 0));
    const { stats } = parseCalendar(calendar);

    expect(stats.totalContributions).toBe(0);
    expect(stats.longestStreak).toBe(0);
    expect(stats.zeroDays).toBe(365);
    expect(stats.avgPerActiveDay).toBe(0);
  });

  it("handles a 365-day streak", () => {
    const calendar = makeCalendar(Array.from({ length: 365 }, () => 1));
    const { stats } = parseCalendar(calendar);

    expect(stats.totalContributions).toBe(365);
    expect(stats.longestStreak).toBe(365);
    expect(stats.zeroDays).toBe(0);
    expect(stats.avgPerActiveDay).toBe(1);
  });

  it("computes stats for a brand new sparse account", () => {
    const calendar = makeCalendar([0, 0, 3, 4, 0, 2, 0]);
    const { days, stats } = parseCalendar(calendar);

    expect(days).toHaveLength(7);
    expect(stats.totalContributions).toBe(9);
    expect(stats.longestStreak).toBe(2);
    expect(stats.zeroDays).toBe(4);
    expect(stats.avgPerActiveDay).toBe(3);
  });
});

function makeCalendar(counts: number[]): RawCalendar {
  const start = new Date("2025-01-05T00:00:00Z");
  const days = counts.map((count, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);

    return {
      contributionCount: count,
      date: date.toISOString().slice(0, 10),
      weekday: date.getUTCDay(),
    };
  });

  return {
    totalContributions: counts.reduce((sum, count) => sum + count, 0),
    weeks: Array.from({ length: Math.ceil(days.length / 7) }, (_, index) => ({
      contributionDays: days.slice(index * 7, index * 7 + 7),
    })),
  };
}
