import { Skeleton } from "@/components/ui/skeleton";

interface JobCardSkeletonProps {
  readonly count?: number;
}

export function JobCardSkeleton({ count = 3 }: JobCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border/60 bg-card p-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </>
  );
}
