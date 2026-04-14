import { DashboardLoadingScreen } from "@/components/dashboard/dashboard-loading-screen";

export default function Loading() {
  return (
    <div className="bg-dot-grid min-h-full">
      <DashboardLoadingScreen
        title="Loading board"
        subtitle="Rebuilding columns, ordering items, and preloading controls so nothing snaps into place abruptly."
      />
    </div>
  );
}
