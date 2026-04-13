"use client";

import { useState, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { EyeOff, Pencil, Check, X } from "lucide-react";
import type { Job, JobStatus } from "@/types/jobs";
import { JobCard } from "@/components/dashboard/job-card";
import { JobCardSkeleton } from "@/components/dashboard/job-card-skeleton";

interface KanbanColumnProps {
  readonly status: JobStatus;
  readonly label: string;
  readonly colorClass: string;
  readonly jobs: Job[];
  readonly isLoading: boolean;
  readonly onDeleteJob?: (id: string) => void;
  readonly deletingJobId?: string;
  readonly onRename?: (status: JobStatus, label: string) => void;
  readonly onHide?: (status: JobStatus) => void;
}

export function KanbanColumn({
  status,
  label,
  colorClass,
  jobs,
  isLoading,
  onDeleteJob,
  deletingJobId,
  onRename,
  onHide,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  const jobIds = jobs.map((j) => j.id);

  function startEdit() {
    setDraft(label);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== label) {
      onRename?.(status, trimmed);
    }
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(label);
    setEditing(false);
  }

  return (
    <div
      className={[
        "flex flex-col rounded-2xl border border-border/50 bg-muted/30 transition-colors duration-200",
        isOver && "border-primary/30 bg-accent/50",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Color strip */}
      <div className={`mx-4 mt-3 h-1 rounded-full ${colorClass}`} />

      {/* Header */}
      <div className="group/header flex items-center gap-2 px-4 pb-2 pt-3">
        {editing ? (
          <div className="flex flex-1 items-center gap-1">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitEdit();
                if (e.key === "Escape") cancelEdit();
              }}
              className="flex-1 rounded-md border border-primary/40 bg-background px-2 py-0.5 text-sm font-bold tracking-tight outline-none focus:border-primary"
              maxLength={32}
            />
            <button onClick={commitEdit} className="text-primary hover:text-primary/80">
              <Check size={14} />
            </button>
            <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
              <X size={14} />
            </button>
          </div>
        ) : (
          <h3 className="flex-1 text-sm font-bold tracking-tight">{label}</h3>
        )}

        {!editing && (
          <div className="flex items-center gap-1">
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1.5 text-xs font-semibold">
              {jobs.length}
            </span>
            {onRename && (
              <button
                onClick={startEdit}
                title="Rename column"
                className="rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover/header:opacity-100"
              >
                <Pencil size={12} />
              </button>
            )}
            {onHide && (
              <button
                onClick={() => onHide(status)}
                title="Hide column"
                className="rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover/header:opacity-100"
              >
                <EyeOff size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card list */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 pb-3"
        style={{ maxHeight: "calc(100vh - 240px)" }}
      >
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          {isLoading && <JobCardSkeleton count={3} />}

          {!isLoading && jobs.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-border/50 p-6">
              <p className="text-center text-sm text-muted-foreground">No jobs yet</p>
            </div>
          )}

          {!isLoading &&
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={onDeleteJob ? () => onDeleteJob(job.id) : undefined}
                isDeleting={deletingJobId === job.id}
              />
            ))}
        </SortableContext>
      </div>
    </div>
  );
}
