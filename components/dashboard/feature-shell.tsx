import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeatureMetric {
  readonly label: string;
  readonly value: string;
  readonly hint: string;
}

interface FeaturePreview {
  readonly title: string;
  readonly description: string;
}

interface FeatureShellProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly badge: string;
  readonly accentClassName: string;
  readonly highlights: readonly string[];
  readonly metrics: readonly FeatureMetric[];
  readonly previews: readonly FeaturePreview[];
}

export function FeatureShell({
  icon: Icon,
  title,
  description,
  badge,
  accentClassName,
  highlights,
  metrics,
  previews,
}: FeatureShellProps) {
  return (
    <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-br opacity-70 blur-3xl",
          accentClassName
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(1_0_0_/_0.5),transparent_32%),linear-gradient(to_bottom,transparent,oklch(0.5_0.01_260_/_0.05))] dark:bg-[radial-gradient(circle_at_top_left,oklch(1_0_0_/_0.06),transparent_28%),linear-gradient(to_bottom,transparent,oklch(1_0_0_/_0.03))]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 pb-12 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardContent className="relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
              <div
                aria-hidden
                className={cn(
                  "absolute right-0 top-0 h-40 w-40 rounded-full blur-3xl",
                  accentClassName
                )}
              />
              <div className="relative flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    <Sparkles className="size-3.5 text-primary" />
                    {badge}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
                    <Clock3 className="size-3.5" />
                    Planned next
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-background/80 shadow-sm">
                    <Icon className="size-7 text-primary" strokeWidth={1.8} />
                  </div>
                  <div className="space-y-2">
                    <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                      {title}
                    </h1>
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-border/70 bg-background/70 p-4"
                    >
                      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                        {metric.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{metric.hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
              <CardTitle>Preview stack</CardTitle>
              <CardDescription>
                Enough structure to make the route feel real while the full feature set lands.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6 sm:px-7 sm:pb-7">
              {previews.map((preview, index) => (
                <div
                  key={preview.title}
                  className="rounded-2xl border border-border/70 bg-background/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{preview.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {preview.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl border border-dashed border-border/80 bg-background/60 p-4">
                <Button variant="outline" size="lg" className="w-full justify-between" disabled>
                  Open preview workspace
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
              <CardTitle>What’s already designed</CardTitle>
              <CardDescription>
                The core flow is scoped and framed so this page never drops users into a 404.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-7 sm:pb-7">
              <ul className="space-y-3">
                {highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                  >
                    <span className="mt-1 size-2 rounded-full bg-primary" />
                    <span className="text-sm leading-6 text-muted-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
              <CardTitle>Design note</CardTitle>
              <CardDescription>
                This route is intentionally styled like an active product surface rather than a dead
                placeholder.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 sm:px-7 sm:pb-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/70 bg-background/75 p-5">
                  <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    Surface
                  </p>
                  <p className="mt-3 text-base font-semibold tracking-tight">
                    Layered glass cards, soft gradients, and clean spacing
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    The visuals stay readable in both themes because they rely on shared semantic
                    colors instead of hard-coded light backgrounds.
                  </p>
                </div>
                <div className="rounded-3xl border border-border/70 bg-background/75 p-5">
                  <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    Behavior
                  </p>
                  <p className="mt-3 text-base font-semibold tracking-tight">
                    Clear roadmap messaging without blocking navigation
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Users can click around, understand what is coming, and keep moving through the
                    dashboard without feeling like they hit an unfinished edge case.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
