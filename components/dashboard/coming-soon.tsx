import type { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly features: readonly string[];
  readonly accentFrom?: string;
  readonly accentTo?: string;
}

export function ComingSoon({
  icon: Icon,
  title,
  description,
  features,
  accentFrom = "from-primary/20",
  accentTo = "to-primary/5",
}: ComingSoonProps) {
  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-6 py-20">
      {/* Animated gradient blobs */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accentFrom} ${accentTo} animate-gradient opacity-60`}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/6 blur-3xl"
      />

      {/* Content card */}
      <div className="relative z-10 w-full max-w-sm text-center">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 to-primary/5 shadow-xl shadow-primary/10">
          <Icon size={36} className="text-primary" strokeWidth={1.5} />
        </div>

        {/* Coming soon badge */}
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold text-primary">Coming soon</span>
        </div>

        <h1 className="mb-3 text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="mb-8 leading-relaxed text-muted-foreground">{description}</p>

        {/* Feature list */}
        <ul className="space-y-2.5 text-left">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
