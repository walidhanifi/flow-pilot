"use client";

import { useState } from "react";
import { Eye, EyeOff, Monitor, Moon, RotateCcw, Sparkles, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/hooks/use-theme";
import { useColumnSettings } from "@/hooks/use-column-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingsViewProps {
  readonly email: string;
}

const THEMES: { value: Theme; label: string; icon: React.ElementType; description: string }[] = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    description: "Warm, crisp surfaces for daytime work.",
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    description: "Low-glare contrast tuned for the dashboard palette.",
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    description: "Follow the device theme automatically.",
  },
];

export function SettingsView({ email }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const { settings, hiddenCount, toggleColumn, resetToDefaults } = useColumnSettings("job");
  const [preferences, setPreferences] = useState({
    compactMode: false,
    ambientHighlights: true,
    focusSummary: true,
  });

  function togglePreference(key: keyof typeof preferences) {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-primary/16 via-amber-500/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(1_0_0_/_0.42),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,oklch(1_0_0_/_0.05),transparent_26%)]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 pb-12 lg:px-8">
        <Card className="rounded-[30px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
          <CardContent className="grid gap-8 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                <Sparkles className="size-3.5 text-primary" />
                Workspace polish
              </div>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                  Settings that feel deliberate, not tucked away
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Appearance, board visibility, and a few workflow defaults now live in a cleaner
                  theme-aware surface with more depth than the original utility page.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <TopMetric label="Theme modes" value="3" hint="Light, dark, and system aware" />
                <TopMetric
                  label="Hidden columns"
                  value={String(hiddenCount)}
                  hint="Saved with your board prefs"
                />
                <TopMetric
                  label="Account email"
                  value="1"
                  hint="Visible without burying profile info"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <MiniSetting
                title="Adaptive theme"
                description="Theme cards and page chrome are tuned to the app's warm visual language."
              />
              <MiniSetting
                title="Board visibility"
                description="Column preferences stay accessible without feeling like an admin screen."
              />
              <MiniSetting
                title="Quiet defaults"
                description="Small workflow toggles preview how richer workspace preferences can land."
              />
              <MiniSetting
                title="Dark mode"
                description="All new surfaces use semantic colors and translucent layers, not hard-coded whites."
              />
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="grid gap-6">
            <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
              <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Choose how Flow Pilot renders across the entire dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 px-6 pb-6 sm:grid-cols-3 sm:px-7 sm:pb-7">
                {THEMES.map(({ value, label, icon: Icon, description }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={cn(
                      "rounded-[24px] border p-4 text-left transition-all",
                      theme === value
                        ? "border-primary/30 bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-border/70 bg-background/75 hover:border-primary/20 hover:bg-background"
                    )}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">
                      <Icon className="size-5" />
                    </div>
                    <p className="mt-4 text-base font-semibold tracking-tight">{label}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
              <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Board columns</CardTitle>
                    <CardDescription>
                      Show or hide workflow stages. Changes continue to save locally.
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={resetToDefaults} className="rounded-2xl">
                    <RotateCcw className="size-4" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 sm:px-7 sm:pb-7">
                {settings.map((column) => (
                  <div
                    key={column.status}
                    className="flex items-center gap-3 rounded-[22px] border border-border/70 bg-background/75 px-4 py-3"
                  >
                    <div className={cn("size-2.5 rounded-full", column.color)} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{column.label}</p>
                      <p className="text-xs text-muted-foreground">{column.status}</p>
                    </div>
                    <Button
                      variant={column.visible ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => toggleColumn(column.status)}
                      className="rounded-xl"
                    >
                      {column.visible ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      {column.visible ? "Visible" : "Hidden"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6">
            <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
              <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
                <CardTitle>Workspace defaults</CardTitle>
                <CardDescription>
                  Lightweight toggles to make the page feel more complete now.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 sm:px-7 sm:pb-7">
                <PreferenceRow
                  title="Compact board spacing"
                  description="Tighter cards for denser board reviews."
                  enabled={preferences.compactMode}
                  onToggle={() => togglePreference("compactMode")}
                />
                <PreferenceRow
                  title="Ambient highlights"
                  description="Keep the soft gradient and glow accents across premium surfaces."
                  enabled={preferences.ambientHighlights}
                  onToggle={() => togglePreference("ambientHighlights")}
                />
                <PreferenceRow
                  title="Focus summary"
                  description="Keep short status summaries visible in dense workflow views."
                  enabled={preferences.focusSummary}
                  onToggle={() => togglePreference("focusSummary")}
                />
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
              <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Core account details with room for richer controls later.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6 sm:px-7 sm:pb-7">
                <div className="rounded-[24px] border border-border/70 bg-background/75 p-4">
                  <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                    Signed in as
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-tight">{email}</p>
                </div>
                <div className="rounded-[24px] border border-dashed border-border/80 bg-background/60 p-4">
                  <p className="text-sm leading-6 text-muted-foreground">
                    Password management, exports, and workspace billing can land here later without
                    changing the page structure again.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function TopMetric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
  );
}

function MiniSetting({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/75 p-4">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[22px] border border-border/70 bg-background/75 px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <Button
        variant={enabled ? "default" : "outline"}
        size="sm"
        onClick={onToggle}
        className="rounded-xl"
      >
        {enabled ? "On" : "Off"}
      </Button>
    </div>
  );
}
