"use client";

import { useMemo, useState } from "react";
import {
  BellRing,
  Building2,
  Contact2,
  Filter,
  Mail,
  MessageSquare,
  PhoneCall,
  Search,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ContactStatus = "Warm" | "Follow up" | "Champion";

interface ContactRecord {
  readonly name: string;
  readonly role: string;
  readonly company: string;
  readonly channel: string;
  readonly note: string;
  readonly lastTouchpoint: string;
  readonly status: ContactStatus;
}

const CONTACTS: readonly ContactRecord[] = [
  {
    name: "Avery Chen",
    role: "Senior Recruiter",
    company: "Northstar Labs",
    channel: "Email thread",
    note: "Asked for updated portfolio and wants a follow-up after the hiring sync.",
    lastTouchpoint: "2 days ago",
    status: "Follow up",
  },
  {
    name: "Maya Patel",
    role: "Design Director",
    company: "Helio Health",
    channel: "Coffee chat",
    note: "Strong supporter. Suggested looping in the VP after the next milestone ships.",
    lastTouchpoint: "Yesterday",
    status: "Champion",
  },
  {
    name: "Jordan Kim",
    role: "Talent Partner",
    company: "Arc Systems",
    channel: "LinkedIn intro",
    note: "Open to sharing upcoming roles once the new planning cycle closes.",
    lastTouchpoint: "5 days ago",
    status: "Warm",
  },
  {
    name: "Sofia Ramirez",
    role: "Hiring Manager",
    company: "Pioneer AI",
    channel: "Phone screen",
    note: "Interested in systems thinking examples and cross-functional delivery details.",
    lastTouchpoint: "Today",
    status: "Follow up",
  },
];

const STATUS_STYLES: Record<ContactStatus, string> = {
  Warm: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "Follow up": "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Champion: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
};

export function ContactsView() {
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState<"All" | ContactStatus>("All");

  const filtered = useMemo(() => {
    return CONTACTS.filter((contact) => {
      const matchesStatus = activeStatus === "All" || contact.status === activeStatus;
      const haystack = `${contact.name} ${contact.role} ${contact.company} ${contact.note}`;
      const matchesQuery = haystack.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [activeStatus, query]);

  return (
    <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-teal-500/18 via-cyan-500/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(1_0_0_/_0.45),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,oklch(1_0_0_/_0.05),transparent_26%)]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 pb-12 lg:px-8">
        <section className="grid gap-8 border-b border-border/60 pb-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase backdrop-blur">
              <Sparkles className="size-3.5 text-primary" />
              Relationship hub
            </div>
            <div className="space-y-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur">
                <Contact2 className="size-7 text-primary" strokeWidth={1.8} />
              </div>
              <div className="space-y-2">
                <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                  Contacts that feel like part of the workflow
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Keep every recruiter, champion, and hiring manager in one clean surface with
                  context, touchpoints, and follow-up momentum.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard
                label="Active contacts"
                value="24"
                hint="Across warm intros and live loops"
              />
              <StatCard label="Need follow-up" value="6" hint="Nudges due in the next 3 days" />
              <StatCard label="Champions" value="4" hint="People actively opening doors" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MiniPanel
              icon={BellRing}
              title="Follow-up queue"
              description="Prioritized nudges based on last touchpoint and pipeline stage."
            />
            <MiniPanel
              icon={Building2}
              title="Company context"
              description="Contacts stay tied to companies, boards, and decision timelines."
            />
            <MiniPanel
              icon={MessageSquare}
              title="Conversation notes"
              description="Capture the real signal, not just names and email addresses."
            />
            <MiniPanel
              icon={PhoneCall}
              title="Channel memory"
              description="See whether someone prefers email, phone, or quick LinkedIn follow-ups."
            />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle>People tracker</CardTitle>
                  <CardDescription>
                    A polished placeholder that already behaves like a useful contacts surface.
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["All", "Warm", "Follow up", "Champion"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setActiveStatus(status)}
                      className={cn(
                        "cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:-translate-y-px",
                        activeStatus === status
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border/70 bg-background/70 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 sm:px-7 sm:pb-7">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search people, companies, or notes"
                    className="h-11 rounded-2xl border-border/70 bg-background/75 pl-9"
                  />
                </div>
                <Button variant="outline" size="lg" className="rounded-2xl">
                  <Filter className="size-4" />
                  Filter set
                </Button>
              </div>

              <div className="space-y-3">
                {filtered.map((contact) => (
                  <article
                    key={contact.name}
                    className="rounded-[24px] border border-border/70 bg-background/75 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background hover:shadow-md hover:shadow-primary/5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                            {contact.name
                              .split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-base font-semibold tracking-tight">
                              {contact.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {contact.role} at {contact.company}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                              STATUS_STYLES[contact.status]
                            )}
                          >
                            {contact.status}
                          </span>
                        </div>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                          {contact.note}
                        </p>
                      </div>

                      <div className="grid gap-2 text-sm sm:min-w-56">
                        <MetaRow icon={Mail} label="Channel" value={contact.channel} />
                        <MetaRow
                          icon={BellRing}
                          label="Last touchpoint"
                          value={contact.lastTouchpoint}
                        />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
              <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
                <CardTitle>Next nudges</CardTitle>
                <CardDescription>
                  Simple, elegant reminders for momentum-heavy outreach.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 sm:px-7 sm:pb-7">
                {[
                  "Send Avery the revised portfolio case study tomorrow morning.",
                  "Thank Maya for the coffee chat and attach the systems-thinking writeup.",
                  "Check whether Sofia has feedback from the panel before Friday.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm leading-6 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background"
                  >
                    {item}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
              <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
                <CardTitle>Roadmap fit</CardTitle>
                <CardDescription>
                  The page looks finished now, and still leaves room for future CRM-style depth.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 px-6 pb-6 sm:px-7 sm:pb-7">
                {[
                  "Board-linked contact timelines",
                  "Reminder automation from calendar events",
                  "Company-level relationship maps",
                  "Imported LinkedIn and email metadata",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background"
                  >
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/75 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background hover:shadow-md hover:shadow-primary/5">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
  );
}

function MiniPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/75 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-background hover:shadow-md hover:shadow-primary/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-[18px]" />
      </div>
      <h2 className="mt-4 text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 py-2 transition-colors hover:border-primary/20 hover:bg-card">
      <Icon className="size-3.5 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="ml-auto text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}
