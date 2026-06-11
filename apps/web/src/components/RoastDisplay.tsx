import type { ContribStats } from "@gitblamed/types";
import { useTypewriter } from "../hooks/useTypewriter";

interface RoastDisplayProps {
  roastText: string;
  stats: ContribStats;
}

export function RoastDisplay({ roastText, stats }: RoastDisplayProps) {
  const typed = useTypewriter(roastText);

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div className="rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] p-5">
        <p className="min-h-36 text-pretty text-xl font-semibold leading-8 text-[#e6edf3] md:text-2xl md:leading-9">
          {typed}
          <span className="ml-1 inline-block h-6 w-2 translate-y-1 animate-pulse bg-emerald-300" />
        </p>
      </div>
      <dl className="grid grid-cols-2 gap-3 rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm">
        <Stat label="Total" value={stats.totalContributions.toLocaleString()} />
        <Stat label="Streak" value={`${stats.longestStreak}d`} />
        <Stat label="Zero days" value={stats.zeroDays.toString()} />
        <Stat label="Peak" value={stats.peakMonth} />
        <Stat
            label="Pattern"
            value={
            stats.weekendVsWeekday.charAt(0).toUpperCase() +
            stats.weekendVsWeekday.slice(1)
          }
        />
        <Stat label="Avg active" value={stats.avgPerActiveDay.toString()} />
      </dl>
    </section>
  );
  
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.14em] text-[#8b949e]">{label}</dt>
      <dd className="mt-1 truncate text-lg font-bold text-white">{value}</dd>
    </div>
  );
}
