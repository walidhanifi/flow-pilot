import { z } from "zod";
import type { BoardType } from "@/types/boards";

export const BOARD_ITEM_STATUSES = [
  "applied",
  "interview",
  "offer",
  "rejected",
  "backlog",
  "active",
  "review",
  "shipped",
  "lead",
  "qualified",
  "proposal",
  "won",
] as const;

export type BoardItemStatus = (typeof BOARD_ITEM_STATUSES)[number];

export interface BoardItem {
  readonly id: string;
  readonly user_id: string;
  readonly board_id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly link: string;
  readonly status: BoardItemStatus;
  readonly position: number;
  readonly notes: string;
  readonly created_at: string;
  readonly isPending?: boolean;
}

export interface BoardTypeConfig {
  readonly label: string;
  readonly description: string;
  readonly shortDescription: string;
  readonly statuses: readonly BoardItemStatus[];
  readonly columns: ReadonlyArray<{
    readonly status: BoardItemStatus;
    readonly label: string;
    readonly color: string;
  }>;
  readonly fields: {
    readonly title: { readonly label: string; readonly placeholder: string };
    readonly subtitle: { readonly label: string; readonly placeholder: string };
    readonly link: { readonly label: string; readonly placeholder: string };
  };
  readonly emptyState: string;
}

export const BOARD_TYPE_CONFIG: Record<BoardType, BoardTypeConfig> = {
  job: {
    label: "Job board",
    description: "Track applications, interviews, offers, and follow-ups in one hiring pipeline.",
    shortDescription: "Hiring pipeline",
    statuses: ["applied", "interview", "offer", "rejected"],
    columns: [
      { status: "applied", label: "Applied", color: "bg-[oklch(0.75_0.15_70)]" },
      { status: "interview", label: "Interview", color: "bg-primary" },
      { status: "offer", label: "Offer", color: "bg-[oklch(0.65_0.18_145)]" },
      { status: "rejected", label: "Closed", color: "bg-muted-foreground" },
    ],
    fields: {
      title: { label: "Company", placeholder: "Acme Corp" },
      subtitle: { label: "Role", placeholder: "Senior Product Designer" },
      link: { label: "Job URL", placeholder: "https://company.com/jobs/123" },
    },
    emptyState: "No applications here yet",
  },
  project: {
    label: "Project board",
    description:
      "Organize delivery work from backlog to review, with clear ownership and references.",
    shortDescription: "Project delivery",
    statuses: ["backlog", "active", "review", "shipped"],
    columns: [
      { status: "backlog", label: "Backlog", color: "bg-[oklch(0.72_0.12_250)]" },
      { status: "active", label: "In Progress", color: "bg-primary" },
      { status: "review", label: "Review", color: "bg-[oklch(0.74_0.15_85)]" },
      { status: "shipped", label: "Done", color: "bg-[oklch(0.65_0.18_145)]" },
    ],
    fields: {
      title: { label: "Task", placeholder: "Launch onboarding revamp" },
      subtitle: { label: "Owner", placeholder: "Design + Frontend" },
      link: { label: "Spec URL", placeholder: "https://docs.company.com/spec" },
    },
    emptyState: "No tasks in this column yet",
  },
  sales: {
    label: "Sales board",
    description: "Run a lightweight deal pipeline for prospects, proposals, and closed revenue.",
    shortDescription: "Deal pipeline",
    statuses: ["lead", "qualified", "proposal", "won"],
    columns: [
      { status: "lead", label: "Lead", color: "bg-[oklch(0.69_0.16_225)]" },
      { status: "qualified", label: "Qualified", color: "bg-primary" },
      { status: "proposal", label: "Proposal", color: "bg-[oklch(0.74_0.15_85)]" },
      { status: "won", label: "Won", color: "bg-[oklch(0.65_0.18_145)]" },
    ],
    fields: {
      title: { label: "Company", placeholder: "Northstar Labs" },
      subtitle: { label: "Contact", placeholder: "Avery Chen" },
      link: { label: "Website", placeholder: "https://northstarlabs.com" },
    },
    emptyState: "No deals here yet",
  },
};

export const createBoardItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Title must be 120 characters or less"),
  subtitle: z
    .string()
    .min(1, "Secondary field is required")
    .max(120, "Secondary field must be 120 characters or less"),
  link: z
    .string()
    .url("Please enter a valid URL")
    .refine((u) => /^https?:\/\//i.test(u), "URL must start with http:// or https://")
    .or(z.literal("")),
});

export const updateBoardItemSchema = z
  .object({
    status: z.enum(BOARD_ITEM_STATUSES).optional(),
    position: z.number().int().min(0).optional(),
    title: z.string().min(1, "Title is required").max(120).optional(),
    subtitle: z.string().min(1, "Secondary field is required").max(120).optional(),
    link: z
      .string()
      .url("Please enter a valid URL")
      .refine((u) => /^https?:\/\//i.test(u), "URL must start with http:// or https://")
      .or(z.literal(""))
      .optional(),
    notes: z.string().optional(),
  })
  .refine(
    (d) =>
      d.status !== undefined ||
      d.position !== undefined ||
      d.title !== undefined ||
      d.subtitle !== undefined ||
      d.link !== undefined ||
      d.notes !== undefined,
    { message: "At least one field must be provided" }
  );

export type CreateBoardItemPayload = z.infer<typeof createBoardItemSchema>;
export type UpdateBoardItemPayload = z.infer<typeof updateBoardItemSchema>;
