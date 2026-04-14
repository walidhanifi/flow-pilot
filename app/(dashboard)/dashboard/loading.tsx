import { DashboardLoadingScreen } from "@/components/dashboard/dashboard-loading-screen";

export default function Loading() {
  return (
    <div className="bg-dot-grid min-h-full">
      <DashboardLoadingScreen
        title="Loading your workspace"
        subtitle="Pulling in your boards, recent activity, and saved workflows so the dashboard lands fully composed."
      />
    </div>
  );
}
