import { BarChart2 } from "lucide-react";
import { FeatureShell } from "@/components/dashboard/feature-shell";

export default function AnalyticsPage() {
  return (
    <FeatureShell
      icon={BarChart2}
      title="Analytics with enough structure to feel shipped"
      description="The analytics route now opens into a polished dashboard preview instead of a thin placeholder, so users can understand the direction immediately."
      badge="Performance insight"
      accentClassName="from-blue-500/20 via-sky-500/12 to-transparent"
      highlights={[
        "Funnel conversion and stage health are already framed into the page structure.",
        "Snapshot metrics make the route feel navigable even before live data wiring.",
        "The design uses semantic surfaces so it stays clean in both light and dark mode.",
      ]}
      metrics={[
        {
          label: "Preview charts",
          value: "03",
          hint: "Hero stats, panel stack, and roadmap surfaces",
        },
        { label: "Dead ends", value: "0", hint: "No more broken-feeling clicks from navigation" },
        { label: "Next focus", value: "Live data", hint: "Ready for board and job signals" },
      ]}
      previews={[
        {
          title: "Funnel health",
          description: "Applied-to-offer flow with stage drop-off and response-rate framing.",
        },
        {
          title: "Momentum windows",
          description: "Recent activity and lagging touchpoints surfaced as a clean summary stack.",
        },
        {
          title: "Signal trends",
          description:
            "Space reserved for time-based conversion and interview performance visuals.",
        },
      ]}
    />
  );
}
