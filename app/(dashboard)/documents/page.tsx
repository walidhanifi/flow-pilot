import { FileText } from "lucide-react";
import { FeatureShell } from "@/components/dashboard/feature-shell";

export default function DocumentsPage() {
  return (
    <FeatureShell
      icon={FileText}
      title="Documents that already feel organized"
      description="This page now opens into a refined document-management preview so resumes, cover letters, and supporting files feel planned instead of absent."
      badge="Document vault"
      accentClassName="from-cyan-500/18 via-sky-500/10 to-transparent"
      highlights={[
        "The shell establishes a strong visual system for file groups, versions, and linked assets.",
        "Users can click into Documents without feeling like the route was forgotten.",
        "The styling stays restrained and readable across light and dark themes.",
      ]}
      metrics={[
        {
          label: "Preview zones",
          value: "03",
          hint: "Storage summary, document groups, and roadmap notes",
        },
        {
          label: "Primary use",
          value: "Resume",
          hint: "Optimized for job-search document workflows",
        },
        {
          label: "Future link",
          value: "Boards",
          hint: "Ready to connect files to specific opportunities",
        },
      ]}
      previews={[
        {
          title: "Versioned resumes",
          description: "Clear space for tailored CV variants and quick role matching.",
        },
        {
          title: "Cover letter kits",
          description: "A home for reusable intros, examples, and role-specific drafts.",
        },
        {
          title: "Shared assets",
          description: "Reserved for references, portfolios, and externally shareable materials.",
        },
      ]}
    />
  );
}
