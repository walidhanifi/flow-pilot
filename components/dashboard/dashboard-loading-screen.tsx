import { Skeleton } from "@/components/ui/skeleton";

interface DashboardLoadingScreenProps {
  readonly title?: string;
  readonly subtitle?: string;
}

export function DashboardLoadingScreen({
  title = "Loading",
  subtitle = "Preparing your board, syncing the latest items, and easing the transition so the UI feels intentional.",
}: DashboardLoadingScreenProps) {
  return (
    <div className="relative min-h-full overflow-hidden px-6 py-10 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.74_0.17_55_/_.14),transparent_30%),radial-gradient(circle_at_bottom_right,oklch(0.73_0.15_220_/_.16),transparent_28%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-[1.6rem] border border-primary/20 bg-card/80 shadow-lg shadow-primary/10 backdrop-blur">
            <div className="absolute h-10 w-10 rounded-full border border-primary/20" />
            <div className="absolute h-7 w-7 rounded-full bg-primary/12 animate-float-slow" />
            <div className="relative z-10 text-lg font-black tracking-[0.24em] text-primary">
              FP
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/80">
              Flow Pilot
            </p>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-[1.8rem] border border-border/60 bg-card/80 p-5 shadow-xl shadow-primary/5 backdrop-blur">
            <div className="space-y-4">
              <Skeleton className="h-5 w-28 rounded-full" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-border/50 bg-background/60 p-3"
                  >
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="mt-3 h-3 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="rounded-[1.8rem] border border-border/60 bg-card/80 p-4 shadow-xl shadow-primary/5 backdrop-blur"
              >
                <Skeleton className="mb-4 h-1.5 w-full rounded-full" />
                <div className="mb-4 flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-8 rounded-full" />
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, cardIndex) => (
                    <div
                      key={cardIndex}
                      className="rounded-2xl border border-border/50 bg-background/70 p-4"
                    >
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="mt-2 h-3 w-1/2" />
                      <div className="mt-4 flex justify-between">
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
