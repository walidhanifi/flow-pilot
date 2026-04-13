import { Target } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function GoalsPage() {
  return (
    <ComingSoon
      icon={Target}
      title="Goals"
      description="Set targets for your workflow and let Flow Pilot help you hit them."
      features={[
        "Weekly application and outreach targets",
        "Progress tracking with visual milestones",
        "AI-suggested goals based on your pace",
        "Streak tracking to build consistent habits",
      ]}
      accentFrom="from-rose-500/15"
      accentTo="to-rose-500/5"
    />
  );
}
