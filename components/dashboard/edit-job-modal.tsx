"use client";

import { useState, useEffect } from "react";
import { updateJobSchema, JOB_STATUSES, COLUMN_CONFIG } from "@/types/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Job, UpdateJobPayload } from "@/types/jobs";

interface EditJobModalProps {
  readonly job: Job | null;
  readonly onOpenChange: (open: boolean) => void;
  readonly updateJob: UseMutationResult<Job, Error, UpdateJobPayload & { id: string }>;
}

export function EditJobModal({ job, onOpenChange, updateJob }: EditJobModalProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState(job?.status ?? "applied");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (job) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- pre-fill form when job prop changes
      setCompany(job.company);
      setRole(job.role);
      setUrl(job.url);
      setNotes(job.notes);
      setStatus(job.status);
      setError("");
      setFieldErrors({});
    }
  }, [job]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;

    setError("");
    setFieldErrors({});

    const result = updateJobSchema.safeParse({ company, role, url, notes, status });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await updateJob.mutateAsync({ id: job.id, ...result.data });
      onOpenChange(false);
    } catch {
      setError("Failed to save changes. Please try again.");
    }
  }

  return (
    <Dialog open={!!job} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-company" className="text-sm font-semibold">
              Company
            </Label>
            <Input
              id="edit-company"
              placeholder="Acme Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.company && (
              <p className="text-sm font-medium text-destructive">{fieldErrors.company}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-role" className="text-sm font-semibold">
              Role
            </Label>
            <Input
              id="edit-role"
              placeholder="Frontend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.role && (
              <p className="text-sm font-medium text-destructive">{fieldErrors.role}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-url" className="text-sm font-semibold">
              URL <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="edit-url"
              placeholder="https://example.com/item"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.url && (
              <p className="text-sm font-medium text-destructive">{fieldErrors.url}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-notes" className="text-sm font-semibold">
              Notes <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <textarea
              id="edit-notes"
              placeholder="Add any notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-sm transition-colors focus-visible:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-semibold">Status</Label>
            <div className="flex flex-wrap gap-2">
              {JOB_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={[
                    "rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                    status === s
                      ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  ].join(" ")}
                >
                  {COLUMN_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={updateJob.isPending}
            className="mt-1 h-11 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {updateJob.isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
