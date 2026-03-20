"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Job } from "@/types/jobs";

interface JobCardProps {
  readonly job: Job;
  readonly isDragOverlay?: boolean;
}

export function JobCard({ job, isDragOverlay = false }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: { type: "job", job },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={[
        "cursor-grab rounded-xl border border-border/60 bg-card p-4 transition-all duration-200",
        isDragging && "opacity-40",
        isDragOverlay && "rotate-2 shadow-xl shadow-primary/15 scale-105",
        !isDragging &&
          !isDragOverlay &&
          "hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-sm font-bold text-foreground">{job.company}</p>
      <p className="mt-1 text-sm text-muted-foreground">{job.role}</p>
      {job.url && (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 block truncate text-xs font-medium text-primary hover:underline"
        >
          {job.url}
        </a>
      )}
    </div>
  );
}
