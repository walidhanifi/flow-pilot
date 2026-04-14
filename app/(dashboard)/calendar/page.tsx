import { Calendar } from "lucide-react";
import { FeatureShell } from "@/components/dashboard/feature-shell";

export default function CalendarPage() {
  return (
    <FeatureShell
      icon={Calendar}
      title="Calendar preview with a polished scheduling surface"
      description="The calendar route now behaves like a thoughtful feature preview with enough context to communicate interviews, reminders, and follow-up timing."
      badge="Schedule layer"
      accentClassName="from-emerald-500/18 via-teal-500/10 to-transparent"
      highlights={[
        "Interview scheduling and reminder behavior are represented as concrete UI blocks.",
        "The page no longer feels like a dead end when users navigate from the sidebar.",
        "Surface treatments stay crisp in both themes because they inherit the dashboard palette.",
      ]}
      metrics={[
        {
          label: "Core blocks",
          value: "03",
          hint: "Hero summary, preview panels, and roadmap cards",
        },
        { label: "Reminder lanes", value: "2x", hint: "Interview timing plus follow-up prompts" },
        {
          label: "Future sync",
          value: "Ready",
          hint: "Designed to hold external calendar connections",
        },
      ]}
      previews={[
        {
          title: "Interview agenda",
          description: "A dedicated place for loops, panels, prep windows, and deadlines.",
        },
        {
          title: "Follow-up timing",
          description: "Structured reminder surfaces for thank-yous and recruiter nudges.",
        },
        {
          title: "Calendar sync",
          description: "Reserved space for Google and Outlook integration states later.",
        },
      ]}
    />
  );
}
