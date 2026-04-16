import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLoadingScreenProps {
  readonly title?: string;
  readonly subtitle?: string;
}

export function DashboardLoadingScreen({
  title = "Loading",
  subtitle = "Preparing your workspace and streaming the next view in place.",
}: DashboardLoadingScreenProps) {
  return (
    <div className="relative min-h-full overflow-hidden px-6 py-8 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.74_0.17_55_/_.12),transparent_26%),radial-gradient(circle_at_bottom_right,oklch(0.73_0.15_220_/_.14),transparent_24%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6">
        <div className="space-y-3 border-b border-border/60 pb-5">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-10 w-full max-w-2xl" />
          <Skeleton className="h-4 w-full max-w-3xl" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">
            {title}
          </p>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-3 rounded-[1.5rem] border border-border/60 bg-card/80 p-4 shadow-lg shadow-black/5 backdrop-blur">
            <Skeleton className="h-4 w-24 rounded-full" />
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/50 bg-background/60 p-3 transition-colors"
              >
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="mt-3 h-3 w-1/2" />
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="rounded-[1.5rem] border border-border/60 bg-card/80 p-4 shadow-lg shadow-black/5 backdrop-blur"
              >
                <Skeleton className="mb-4 h-1.5 w-full rounded-full" />
                <div className="mb-4 flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-8 rounded-full" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, cardIndex) => (
                    <div
                      key={cardIndex}
                      className="rounded-2xl border border-border/50 bg-background/70 p-4 transition-colors"
                    >
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="mt-2 h-3 w-1/2" />
                      <div className="mt-4 flex justify-between gap-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
