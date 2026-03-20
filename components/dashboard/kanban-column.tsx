"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Job, JobStatus } from "@/types/jobs";
import { JobCard } from "@/components/dashboard/job-card";
import { JobCardSkeleton } from "@/components/dashboard/job-card-skeleton";

interface KanbanColumnProps {
  readonly status: JobStatus;
  readonly label: string;
  readonly colorClass: string;
  readonly jobs: Job[];
  readonly isLoading: boolean;
}

export function KanbanColumn({
  status,
  label,
  colorClass,
  jobs,
  isLoading,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });

  const jobIds = jobs.map((j) => j.id);

  return (
    <div
      className={[
        "flex flex-col rounded-2xl border border-border/50 bg-muted/30 transition-colors duration-200",
        isOver && "bg-accent/50 border-primary/30",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Color strip */}
      <div className={`mx-4 mt-3 h-1 rounded-full ${colorClass}`} />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <h3 className="text-sm font-bold tracking-tight">{label}</h3>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1.5 text-xs font-semibold">
          {jobs.length}
        </span>
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
              <p className="text-center text-sm text-muted-foreground">
                No jobs yet
              </p>
            </div>
          )}

          {!isLoading &&
            jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </SortableContext>
      </div>
    </div>
  );
}
