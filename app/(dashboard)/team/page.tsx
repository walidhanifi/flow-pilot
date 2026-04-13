import { Users } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function TeamPage() {
  return (
    <ComingSoon
      icon={Users}
      title="Team"
      description="Job search better together — share boards, notes, and leads with people you trust."
      features={[
        "Shared kanban boards with fine-grained permissions",
        "Team notes and comments on applications",
        "Referral tracking and warm intro requests",
        "Collaborative interview prep and mock Q&A",
      ]}
      accentFrom="from-amber-500/15"
      accentTo="to-amber-500/5"
    />
  );
}
