export function SkeletonLoader() {
  return (
    <div className="space-y-5" aria-label="Loading contribution report">
      <div className="flex gap-1 overflow-hidden rounded-md border border-white/8 bg-white/[0.03] p-4">
        {Array.from({ length: 52 }).map((_, week) => (
          <div className="flex flex-col gap-1" key={week}>
            {Array.from({ length: 7 }).map((__, day) => (
              <div
                className="h-3 w-3 animate-pulse rounded-[3px] bg-white/10"
                key={`${week}-${day}`}
                style={{ animationDelay: `${(week + day) * 18}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-5 w-11/12 animate-pulse rounded bg-white/10" />
        <div className="h-5 w-9/12 animate-pulse rounded bg-white/10" />
        <div className="h-5 w-7/12 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}
