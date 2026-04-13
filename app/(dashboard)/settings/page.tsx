import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Settings"
      description="Customise Flow Pilot to match the way you work."
      features={[
        "Profile and account management",
        "Notification preferences and digest emails",
        "Theme customisation — light, dark, and system",
        "Data export and account deletion",
      ]}
    />
  );
}
