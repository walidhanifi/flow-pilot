import { cn } from "@/lib/utils";

interface SkeletonProps extends React.ComponentProps<"div"> {
  readonly shimmerClassName?: string;
}

function Skeleton({ className, shimmerClassName, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md border border-white/5 bg-muted/80",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_ease-in-out_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/35 before:to-transparent",
        shimmerClassName,
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
