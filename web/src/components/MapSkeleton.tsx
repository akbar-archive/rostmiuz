import { Skeleton } from "./Skeleton";

export default function MapSkeleton() {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      <div className="absolute left-3 right-3 top-3 flex items-center gap-2">
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
      </div>
    </div>
  );
}
