export type CodingPattern = "weekend" | "weekday" | "balanced";

export interface DayData {
  date: string;
  count: number;
  weekday: number;
}

export interface ContribStats {
  totalContributions: number;
  longestStreak: number;
  zeroDays: number;
  mostActiveDay: string;
  weekendVsWeekday: CodingPattern;
  peakMonth: string;
  avgPerActiveDay: number;
}

export interface RoastResponse {
  username: string;
  heatmapData: DayData[];
  roastText: string;
  stats: ContribStats;
  cached: boolean;
  generatedAt: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
