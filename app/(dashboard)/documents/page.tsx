import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export default function DocumentsPage() {
  return (
    <ComingSoon
      icon={FileText}
      title="Documents"
      description="Keep your CVs, cover letters, and reference docs organised in one place."
      features={[
        "Upload and version your resume and cover letters",
        "Link documents directly to board items",
        "AI-powered cover letter drafting from job descriptions",
        "One-click sharing with recruiters",
      ]}
      accentFrom="from-sky-500/15"
      accentTo="to-sky-500/5"
    />
  );
}
