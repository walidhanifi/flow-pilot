"use client";

import { useState } from "react";
import { createJobSchema } from "@/types/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Job, CreateJobPayload } from "@/types/jobs";

interface AddJobModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly addJob: UseMutationResult<Job, Error, CreateJobPayload>;
}

export function AddJobModal({
  open,
  onOpenChange,
  addJob,
}: AddJobModalProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function resetForm() {
    setCompany("");
    setRole("");
    setUrl("");
    setError("");
    setFieldErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = createJobSchema.safeParse({ company, role, url });
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
      await addJob.mutateAsync(result.data);
      resetForm();
      onOpenChange(false);
    } catch {
      setError("Failed to add job. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add a job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company" className="text-sm font-semibold">
              Company
            </Label>
            <Input
              id="company"
              placeholder="Acme Corp"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.company && (
              <p className="text-sm font-medium text-destructive">
                {fieldErrors.company}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role" className="text-sm font-semibold">
              Role
            </Label>
            <Input
              id="role"
              placeholder="Frontend Engineer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.role && (
              <p className="text-sm font-medium text-destructive">
                {fieldErrors.role}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url" className="text-sm font-semibold">
              URL{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="url"
              placeholder="https://example.com/jobs/123"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.url && (
              <p className="text-sm font-medium text-destructive">
                {fieldErrors.url}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={addJob.isPending}
            className="mt-1 h-11 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {addJob.isPending ? "Adding..." : "Add job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
