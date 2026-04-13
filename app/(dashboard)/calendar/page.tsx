import { Calendar } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function CalendarPage() {
  return (
    <ComingSoon
      icon={Calendar}
      title="Calendar"
      description="Keep every interview, deadline, and follow-up in one place."
      features={[
        "Interview scheduling with conflict detection",
        "Automated follow-up reminders",
        "Application deadline tracking",
        "Google Calendar and Outlook sync",
      ]}
      accentFrom="from-emerald-500/15"
      accentTo="to-emerald-500/5"
    />
  );
}
