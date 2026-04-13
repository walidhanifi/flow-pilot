import { Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function AiInsightsPage() {
  return (
    <ComingSoon
      icon={Sparkles}
      title="AI Insights"
      description="Let AI analyse your job search and surface actionable improvements."
      features={[
        "Resume gap analysis against job descriptions",
        "Salary benchmarking by role, seniority, and location",
        "Skill demand matching — what to learn next",
        "Personalised application strategy suggestions",
      ]}
      accentFrom="from-violet-500/15"
      accentTo="to-violet-500/5"
    />
  );
}
