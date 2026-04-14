"use client";

import { useTheme } from "@/hooks/use-theme";
import { useColumnSettings } from "@/hooks/use-column-settings";
import { Sun, Moon, Monitor, Eye, EyeOff, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Theme } from "@/hooks/use-theme";

interface SettingsViewProps {
  readonly email: string;
}

const THEMES: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function SettingsView({ email }: SettingsViewProps) {
  const { theme, setTheme } = useTheme();
  const { settings, toggleColumn, resetToDefaults } = useColumnSettings("job");

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your preferences and board configuration.
        </p>
      </div>

      {/* Appearance */}
      <SectionCard title="Appearance" description="Choose how Flow Pilot looks on your screen.">
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all duration-150",
                theme === value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Board columns */}
      <SectionCard
        title="Board columns"
        description="Show or hide columns on your board. Changes save automatically."
      >
        <div className="space-y-2">
          {settings.map((col) => (
            <div
              key={col.status}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className={cn("h-2.5 w-2.5 rounded-full", col.color)} />
                <span className="text-sm font-medium">{col.label}</span>
                <span className="text-xs text-muted-foreground/60">({col.status})</span>
              </div>
              <button
                onClick={() => toggleColumn(col.status)}
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  col.visible
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-muted"
                )}
                title={col.visible ? "Hide column" : "Show column"}
              >
                {col.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={resetToDefaults}
          className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw size={13} />
          Reset to defaults
        </button>
      </SectionCard>

      {/* Account */}
      <SectionCard title="Account" description="Your account details.">
        <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
            Email
          </p>
          <p className="mt-0.5 text-sm font-medium">{email}</p>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Account management, password change, and data export are coming soon.
        </p>
      </SectionCard>
    </div>
  );
}
