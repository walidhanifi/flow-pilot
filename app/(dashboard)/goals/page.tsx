import { Target } from "lucide-react";
import { FeatureShell } from "@/components/dashboard/feature-shell";

export default function GoalsPage() {
  return (
    <FeatureShell
      icon={Target}
      title="Goals preview built like a live workspace"
      description="The goals route now has a strong placeholder experience with tangible metrics, framed outcomes, and a visual style that matches the rest of the dashboard."
      badge="Momentum system"
      accentClassName="from-rose-500/18 via-orange-500/10 to-transparent"
      highlights={[
        "Goal-setting now has a designed home instead of a generic coming-soon card.",
        "The layout already supports weekly targets, progress summaries, and habit signals.",
        "Theme-aware cards keep the page clean and legible in dark mode.",
      ]}
      metrics={[
        {
          label: "Weekly focus",
          value: "05",
          hint: "Applications, follow-ups, interviews, networking, and prep",
        },
        {
          label: "Streak logic",
          value: "Ready",
          hint: "Planned to fit into the current dashboard rhythm",
        },
        {
          label: "Preview depth",
          value: "2-tier",
          hint: "Hero summary plus roadmap and design context",
        },
      ]}
      previews={[
        {
          title: "Weekly targets",
          description: "A clear home for committed output goals instead of vague intentions.",
        },
        {
          title: "Progress pace",
          description: "Space for streaks, completion rates, and momentum snapshots.",
        },
        {
          title: "Adaptive goals",
          description: "Reserved for suggestions shaped by board volume and response signals.",
        },
      ]}
    />
  );
}
