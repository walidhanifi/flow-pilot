"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink, FileText, Pencil, Trash2 } from "lucide-react";
import type { BoardItem } from "@/types/board-items";

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

interface BoardItemCardProps {
  readonly item: BoardItem;
  readonly isDragOverlay?: boolean;
  readonly onDelete?: () => void;
  readonly isDeleting?: boolean;
  readonly onEdit?: () => void;
}

export function BoardItemCard({
  item,
  isDragOverlay = false,
  onDelete,
  isDeleting = false,
  onEdit,
}: BoardItemCardProps) {
  const [confirming, setConfirming] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: "item", item },
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
        "group relative cursor-grab overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200",
        "before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]",
        isDragging && "opacity-40",
        isDeleting && "pointer-events-none opacity-50",
        item.isPending && "animate-pulse",
        isDragOverlay && "rotate-2 scale-[1.02] shadow-xl shadow-primary/15",
        !isDragging &&
          !isDragOverlay &&
          "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative z-10">
        <div className="absolute right-0 top-0 flex items-center gap-1">
          {onEdit && (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground opacity-0 transition-all duration-150 hover:bg-muted hover:text-foreground group-hover:opacity-100"
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
                "flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all duration-150",
                confirming
                  ? "bg-destructive text-destructive-foreground opacity-100"
                  : "text-muted-foreground opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100",
              ].join(" ")}
            >
              <Trash2 size={11} />
              {confirming && "Confirm"}
            </button>
          )}
        </div>

        <div className="pr-6">
          <p className="text-sm font-bold text-foreground">{item.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{item.subtitle}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="flex min-w-0 items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              <ExternalLink size={10} className="shrink-0" />
              <span className="truncate">{extractDomain(item.link)}</span>
            </a>
          ) : (
            <span />
          )}
          <div className="flex shrink-0 items-center gap-1.5">
            {item.notes && (
              <span title="Has notes" className="text-muted-foreground/60">
                <FileText size={11} />
              </span>
            )}
            <span className="text-[10px] text-muted-foreground/50">
              {relativeTime(item.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
