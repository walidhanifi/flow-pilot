import { BarChart2 } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function AnalyticsPage() {
  return (
    <ComingSoon
      icon={BarChart2}
      title="Analytics"
      description="Get a clear picture of your job search performance with data-driven insights."
      features={[
        "Application funnel — applied to offer conversion rate",
        "Response rate and ghosting analysis by company type",
        "Interview success breakdown by stage",
        "Time-to-offer trends over your search timeline",
      ]}
      accentFrom="from-blue-500/15"
      accentTo="to-blue-500/5"
    />
  );
}
