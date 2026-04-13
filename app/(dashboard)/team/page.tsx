"use client";

import { useState } from "react";
import { Users, UserPlus, Mail, Crown, Lock } from "lucide-react";

export default function TeamPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setInviteEmail("");
  }

  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden px-6 py-12">
      {/* Background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-amber-500/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/6 blur-3xl"
      />

      <div className="relative z-10 mx-auto w-full max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Collaborate on boards and share progress with your team.
          </p>
        </div>

        {/* Invite card */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          {/* Coming soon overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-card/85 backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
              <Lock size={22} className="text-amber-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">Team invites coming soon</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Multi-user collaboration is on the roadmap
              </p>
            </div>
            {submitted && (
              <p className="text-xs font-medium text-primary">
                Interest noted — you&apos;ll be first to know!
              </p>
            )}
          </div>

          <h2 className="mb-4 text-base font-bold">Invite a team member</h2>
          <form onSubmit={handleInvite} className="flex gap-2">
            <div className="relative flex-1">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="h-10 w-full rounded-xl border border-border/80 bg-muted/40 pl-9 pr-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <button
              type="submit"
              className="flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30"
            >
              <UserPlus size={15} />
              Invite
            </button>
          </form>
        </div>

        {/* Members list */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-base font-bold">Members</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                Y
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">You</p>
                <p className="text-xs text-muted-foreground">Personal workspace</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1">
                <Crown size={11} className="text-amber-500" />
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  Owner
                </span>
              </div>
            </div>

            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-dashed border-border/40 px-4 py-3 opacity-40"
              >
                <div className="h-9 w-9 rounded-full bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-28 rounded-full bg-muted" />
                  <div className="h-2.5 w-20 rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-4 py-3">
            <Users size={15} className="shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Shared boards, real-time collaboration, and role-based permissions are on the roadmap.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
