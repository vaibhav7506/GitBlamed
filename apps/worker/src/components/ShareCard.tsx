import type { ContribStats, DayData } from "@gitblamed/types";

const COLORS = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

function getColor(count: number): string {
  if (count === 0) return COLORS[0];
  if (count <= 3) return COLORS[1];
  if (count <= 6) return COLORS[2];
  if (count <= 9) return COLORS[3];
  return COLORS[4];
}

function chunkIntoWeeks(days: DayData[]): DayData[][] {
  const weeks: DayData[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function buildShareCard(
  username: string,
  roastText: string,
  days: DayData[],
  stats: ContribStats,
) {
  const weeks = chunkIntoWeeks(days);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 1200,
        height: 630,
        backgroundColor: "#0d1117",
        padding: 60,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", rowGap: 8 }}>
        <div style={{ fontSize: 28, color: "#8b949e", fontWeight: 400 }}>
          {`github.com/${username}`}
        </div>
        <div style={{ fontSize: 20, color: "#30a14e" }}>
          {`${stats.totalContributions} contributions · ${stats.longestStreak} day longest streak`}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", columnGap: 3 }}>
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            style={{ display: "flex", flexDirection: "column", rowGap: 3 }}
          >
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 2,
                  backgroundColor: getColor(day.count),
                }}
              />
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 32,
          color: "#e6edf3",
          fontWeight: 700,
          lineHeight: 1.35,
          maxWidth: 1000,
        }}
      >
        {`"${roastText}"`}
      </div>

      <div style={{ fontSize: 20, color: "#484f58" }}>
        {"gitblamed.dev · roast your friends"}
      </div>
    </div>
  );
}
