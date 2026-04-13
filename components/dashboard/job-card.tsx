"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, FileText, ExternalLink, Pencil } from "lucide-react";
import type { Job } from "@/types/jobs";

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

interface JobCardProps {
  readonly job: Job;
  readonly isDragOverlay?: boolean;
  readonly onDelete?: () => void;
  readonly isDeleting?: boolean;
  readonly onEdit?: () => void;
}

export function JobCard({
  job,
  isDragOverlay = false,
  onDelete,
  isDeleting = false,
  onEdit,
}: JobCardProps) {
  const [confirming, setConfirming] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: { type: "job", job },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirming) {
      onDelete?.();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseLeave={() => setConfirming(false)}
      className={[
        "group relative cursor-grab rounded-xl border border-border/60 bg-card p-4 transition-all duration-200",
        isDragging && "opacity-40",
        isDeleting && "pointer-events-none opacity-50",
        isDragOverlay && "rotate-2 scale-105 shadow-xl shadow-primary/15",
        !isDragging &&
          !isDragOverlay &&
          "hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute right-2 top-2 flex items-center gap-1">
        {onEdit && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground opacity-0 transition-all duration-150 hover:bg-muted hover:text-foreground group-hover:opacity-100"
          >
            <Pencil size={11} />
          </button>
        )}
        {onDelete && (
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleDeleteClick}
            disabled={isDeleting}
            className={[
              "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all duration-150",
              confirming
                ? "bg-destructive text-destructive-foreground opacity-100"
                : "text-muted-foreground opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Trash2 size={11} />
            {confirming && "Confirm"}
          </button>
        )}
      </div>

      <p className="pr-6 text-sm font-bold text-foreground">{job.company}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{job.role}</p>

      <div className="mt-3 flex items-center justify-between gap-2">
        {job.url ? (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="flex min-w-0 items-center gap-1 rounded-md border border-border/60 bg-muted/50 px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
          >
            <ExternalLink size={9} className="shrink-0" />
            <span className="truncate">{extractDomain(job.url)}</span>
          </a>
        ) : (
          <span />
        )}
        <div className="flex shrink-0 items-center gap-1.5">
          {job.notes && (
            <span title="Has notes" className="text-muted-foreground/60">
              <FileText size={11} />
            </span>
          )}
          <span className="text-[10px] text-muted-foreground/50">
            {relativeTime(job.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
