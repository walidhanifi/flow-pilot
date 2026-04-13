import { Contact2 } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function ContactsPage() {
  return (
    <ComingSoon
      icon={Contact2}
      title="Contacts"
      description="Track every recruiter, hiring manager, and connection you meet along the way."
      features={[
        "Store contacts with company and role context",
        "Link contacts to board items and notes",
        "Follow-up reminders tied to your calendar",
        "LinkedIn profile sync",
      ]}
      accentFrom="from-teal-500/15"
      accentTo="to-teal-500/5"
    />
  );
}
