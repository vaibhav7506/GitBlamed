import type { ContribStats, DayData } from "@gitblamed/types";
import type { RawCalendar } from "./github";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parseCalendar(calendar: RawCalendar): {
  days: DayData[];
  stats: ContribStats;
} {
  const days: DayData[] = calendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      weekday: day.weekday,
    })),
  );

  let longestStreak = 0;
  let currentStreak = 0;
  let zeroDays = 0;
  let totalActive = 0;
  let weekendTotal = 0;
  let weekdayTotal = 0;
  const byDay = new Array<number>(7).fill(0);
  const byMonth = new Array<number>(12).fill(0);

  for (const day of days) {
    const month = Number.parseInt(day.date.slice(5, 7), 10) - 1;

    if (day.count > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
      totalActive++;
    } else {
      zeroDays++;
      currentStreak = 0;
    }

    byDay[day.weekday] += day.count;
    byMonth[month] += day.count;

    if (day.weekday === 0 || day.weekday === 6) {
      weekendTotal += day.count;
    } else {
      weekdayTotal += day.count;
    }
  }

  const peakDayIndex = byDay.indexOf(Math.max(...byDay));
  const peakMonthIndex = byMonth.indexOf(Math.max(...byMonth));
  const avgPerActiveDay =
    totalActive > 0 ? Math.round(calendar.totalContributions / totalActive) : 0;

  return {
    days,
    stats: {
      totalContributions: calendar.totalContributions,
      longestStreak,
      zeroDays,
      mostActiveDay: DAY_NAMES[peakDayIndex],
      peakMonth: MONTH_NAMES[peakMonthIndex],
      avgPerActiveDay,
      weekendVsWeekday:
        weekendTotal === weekdayTotal ? "balanced" : weekendTotal > weekdayTotal ? "weekend" : "weekday",
    },
  };
}
