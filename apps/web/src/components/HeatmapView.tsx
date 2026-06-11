import ActivityCalendar from "react-activity-calendar";
import type { DayData } from "@gitblamed/types";

interface HeatmapViewProps {
  days: DayData[];
}

export function HeatmapView({ days }: HeatmapViewProps) {
  const data = days.map((day) => ({
    date: day.date,
    count: day.count,
    level: getLevel(day.count),
  }));

  return (
    <div className="overflow-x-auto rounded-md border border-white/10 bg-[#0d1117] p-4">
      <ActivityCalendar
        data={data}
        blockMargin={4}
        blockRadius={3}
        blockSize={13}
        colorScheme="dark"
        fontSize={12}
        hideColorLegend
        hideMonthLabels={false}
        theme={{
          dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
          light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        }}
      />
    </div>
  );
}

function getLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}
