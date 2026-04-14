import { Sparkles } from "lucide-react";
import { FeatureShell } from "@/components/dashboard/feature-shell";

export default function AiInsightsPage() {
  return (
    <FeatureShell
      icon={Sparkles}
      title="AI insights framed like a real product surface"
      description="This preview page makes the AI area feel intentional now, with room for later ranking, recommendations, and resume feedback flows."
      badge="Guided intelligence"
      accentClassName="from-fuchsia-500/18 via-violet-500/12 to-transparent"
      highlights={[
        "Recommendation slots are mapped into a clean two-column layout instead of a blank stub.",
        "The page communicates what AI will do without pretending unfinished features exist today.",
        "Dark mode remains balanced because all effects sit on semantic cards and overlays.",
      ]}
      metrics={[
        {
          label: "Insight types",
          value: "04",
          hint: "Coaching, matching, prioritization, and trend signals",
        },
        {
          label: "UI polish",
          value: "High",
          hint: "Gradient hero, preview stack, and roadmap surfaces",
        },
        {
          label: "Ready for",
          value: "Actions",
          hint: "Can later host prompts, suggestions, and generated text",
        },
      ]}
      previews={[
        {
          title: "Priority suggestions",
          description: "Highlight which roles or companies deserve attention first.",
        },
        {
          title: "Application coaching",
          description: "Surface sharper next steps from your current board state and notes.",
        },
        {
          title: "Skill gaps",
          description: "Reserve space for targeted recommendations tied to real opportunities.",
        },
      ]}
    />
  );
}
