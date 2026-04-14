"use client";

import { useState } from "react";
import { BellRing, Crown, Lock, Mail, ShieldCheck, Sparkles, UserPlus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MEMBERS = [
  {
    name: "You",
    role: "Owner",
    detail: "Personal workspace lead",
    accent: "bg-primary/10 text-primary",
  },
  {
    name: "Maya Patel",
    role: "Advisor",
    detail: "Review access planned",
    accent: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  {
    name: "Open seat",
    role: "Invite slot",
    detail: "Reserved for a hiring collaborator",
    accent: "bg-muted text-muted-foreground",
  },
];

export function TeamView() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!inviteEmail.trim()) return;
    setSubmitted(true);
    setInviteEmail("");
    window.setTimeout(() => setSubmitted(false), 3200);
  }

  return (
    <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-amber-500/16 via-primary/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(1_0_0_/_0.42),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,oklch(1_0_0_/_0.05),transparent_26%)]"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 pb-12 lg:px-8">
        <Card className="rounded-[30px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
          <CardContent className="grid gap-8 px-6 py-6 sm:px-8 sm:py-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                <Sparkles className="size-3.5 text-primary" />
                Team workspace
              </div>
              <div className="space-y-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-background/80 shadow-sm">
                  <Users className="size-7 text-primary" strokeWidth={1.8} />
                </div>
                <div className="space-y-2">
                  <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                    Clean collaboration surface, ready for multi-user features
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    The team route now feels like a premium workspace instead of a blocked screen,
                    while still being honest about what is shipping later.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="Current seats" value="1" hint="Single-user workspace today" />
                <Metric label="Planned roles" value="4" hint="Owner, editor, reviewer, guest" />
                <Metric label="Live blockers" value="0" hint="No more dead-end navigation" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TeamMiniCard
                icon={ShieldCheck}
                title="Permissions"
                description="Role-aware access patterns are scoped into the surface already."
              />
              <TeamMiniCard
                icon={BellRing}
                title="Review loops"
                description="Invite reviewers later without redesigning the whole route."
              />
              <TeamMiniCard
                icon={Lock}
                title="Safe rollout"
                description="Current UI makes roadmap state explicit without disabling discovery."
              />
              <TeamMiniCard
                icon={UserPlus}
                title="Invite intent"
                description="A polished interest-capture flow replaces the old thin overlay."
              />
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
              <CardTitle>Invite collaborators</CardTitle>
              <CardDescription>
                A richer holding state that still gives users something meaningful to do.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6 sm:px-7 sm:pb-7">
              <form
                onSubmit={handleInvite}
                className="rounded-[26px] border border-border/70 bg-background/75 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={inviteEmail}
                      onChange={(event) => setInviteEmail(event.target.value)}
                      placeholder="colleague@example.com"
                      className="h-11 rounded-2xl border-border/70 bg-card/80 pl-9"
                    />
                  </div>
                  <Button size="lg" className="rounded-2xl px-5">
                    <UserPlus className="size-4" />
                    Notify me first
                  </Button>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  We are not sending live invites yet. This captures interest so the route feels
                  intentional instead of unfinished.
                </p>
                {submitted ? (
                  <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                    Invite interest noted. This workspace will surface multi-user access here when
                    it is ready.
                  </div>
                ) : null}
              </form>

              <div className="grid gap-3">
                {[
                  "Shared board ownership",
                  "Reviewer-only comments",
                  "Workspace presence and activity feed",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/75 px-4 py-3 text-sm"
                  >
                    <span className="size-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-border/70 bg-card/85 py-0 shadow-xl shadow-black/5 backdrop-blur-sm">
            <CardHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
              <CardTitle>Workspace roster</CardTitle>
              <CardDescription>
                The roster is styled like a real product surface, even before backend support lands.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6 sm:px-7 sm:pb-7">
              {MEMBERS.map((member) => (
                <article
                  key={member.name}
                  className="rounded-[24px] border border-border/70 bg-background/75 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary">
                      {member.name === "Open seat"
                        ? "+"
                        : member.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold tracking-tight">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.detail}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${member.accent}`}
                    >
                      {member.role === "Owner" ? <Crown className="mr-1 inline size-3" /> : null}
                      {member.role}
                    </span>
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/75 p-4">
      <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
  );
}

function TeamMiniCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/75 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-[18px]" />
      </div>
      <h2 className="mt-4 text-base font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
