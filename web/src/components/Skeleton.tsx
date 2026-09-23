export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800 ${className}`} />;
}

// Deliberately loose rather than a pixel-match of PlaceDetailPanel: a
// skeleton that's slightly simpler than the real content settles into it
// smoothly, where an over-specific one (exact button count/widths) would
// visibly jump the moment the panel's own layout changes.
export function PlaceDetailSkeleton() {
  return (
    <div>
      <div className="h-40 w-full animate-pulse bg-neutral-200 dark:bg-neutral-800 sm:rounded-t-3xl" />
      <div className="space-y-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-10 shrink-0" />
          ))}
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-full rounded-full" />
          <Skeleton className="h-3.5 w-4/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
