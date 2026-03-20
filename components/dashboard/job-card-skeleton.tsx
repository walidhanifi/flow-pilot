import { Skeleton } from "@/components/ui/skeleton";

interface JobCardSkeletonProps {
  readonly count?: number;
}

export function JobCardSkeleton({ count = 3 }: JobCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border/60 bg-card p-4"
        >
          <Skeleton className="mb-2 h-4 w-3/4" />
          <Skeleton className="mb-3 h-3 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </>
  );
}
