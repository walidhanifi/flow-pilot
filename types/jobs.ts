import { z } from "zod";

export const JOB_STATUSES = [
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export interface Job {
  readonly id: string;
  readonly user_id: string;
  readonly company: string;
  readonly role: string;
  readonly url: string;
  readonly status: JobStatus;
  readonly position: number;
  readonly created_at: string;
}

export const createJobSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  url: z
    .string()
    .url("Please enter a valid URL")
    .refine((u) => /^https?:\/\//i.test(u), "URL must start with http:// or https://")
    .or(z.literal("")),
});

export const updateJobSchema = z
  .object({
    status: z.enum(JOB_STATUSES).optional(),
    position: z.number().int().min(0).optional(),
  })
  .refine((d) => d.status !== undefined || d.position !== undefined, {
    message: "At least one of status or position must be provided",
  });

export type CreateJobPayload = z.infer<typeof createJobSchema>;
export type UpdateJobPayload = z.infer<typeof updateJobSchema>;

export const COLUMN_CONFIG: Record<
  JobStatus,
  { readonly label: string; readonly color: string }
> = {
  applied: { label: "Applied", color: "bg-[oklch(0.75_0.15_70)]" },
  interview: { label: "Interview", color: "bg-primary" },
  offer: { label: "Offer", color: "bg-[oklch(0.65_0.18_145)]" },
  rejected: { label: "Rejected", color: "bg-muted-foreground" },
};
