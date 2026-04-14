"use client";

import { useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Check, EyeOff, Pencil, X } from "lucide-react";
import type { BoardItem, BoardItemStatus } from "@/types/board-items";
import { BoardItemCard } from "@/components/dashboard/board-item-card";
import { JobCardSkeleton } from "@/components/dashboard/job-card-skeleton";
import type { Job } from "@/types/jobs";

interface KanbanColumnProps {
  readonly status: BoardItemStatus;
  readonly label: string;
  readonly colorClass: string;
  readonly items?: BoardItem[];
  readonly jobs?: Job[];
  readonly isLoading: boolean;
  readonly emptyState?: string;
  readonly onDeleteItem?: (id: string) => void;
  readonly deletingItemId?: string;
  readonly onRename?: (status: BoardItemStatus, label: string) => void;
  readonly onHide?: (status: BoardItemStatus) => void;
  readonly onEditItem?: (item: BoardItem) => void;
}

export function KanbanColumn({
  status,
  label,
  colorClass,
  items,
  jobs,
  isLoading,
  emptyState = "Nothing here yet",
  onDeleteItem,
  deletingItemId,
  onRename,
  onHide,
  onEditItem,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: { type: "column", status },
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const resolvedItems =
    items ??
    (jobs ?? []).map<BoardItem>((job) => ({
      id: job.id,
      user_id: job.user_id,
      board_id: job.board_id ?? "",
      title: job.company,
      subtitle: job.role,
      link: job.url,
      status: job.status,
      position: job.position,
      notes: job.notes,
      created_at: job.created_at,
    }));

  const itemIds = resolvedItems.map((item) => item.id);

  function startEdit() {
    setDraft(label);
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitEdit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== label) onRename?.(status, trimmed);
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(label);
    setEditing(false);
  }

  return (
    <div
      className={[
        "flex flex-col rounded-[1.8rem] border border-border/50 bg-muted/25 shadow-lg shadow-primary/5 transition-colors duration-200",
        isOver && "border-primary/30 bg-accent/40",
      ].join(" ")}
    >
      <div className={`mx-4 mt-4 h-1.5 rounded-full ${colorClass}`} />

      <div className="group/header flex items-center gap-2 px-4 pb-3 pt-4">
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
            <button
              onClick={commitEdit}
              className="cursor-pointer text-primary hover:text-primary/80"
            >
              <Check size={14} />
            </button>
            <button
              onClick={cancelEdit}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex-1">
            <h3 className="text-sm font-bold tracking-tight">{label}</h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {resolvedItems.length} item{resolvedItems.length === 1 ? "" : "s"}
            </p>
          </div>
        )}

        {!editing && (
          <div className="flex items-center gap-1">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-foreground/10 px-1.5 text-xs font-semibold">
              {resolvedItems.length}
            </span>
            {onRename && (
              <button
                onClick={startEdit}
                title="Rename column"
                className="cursor-pointer rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover/header:opacity-100"
              >
                <Pencil size={12} />
              </button>
            )}
            {onHide && (
              <button
                onClick={() => onHide(status)}
                title="Hide column"
                className="cursor-pointer rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover/header:opacity-100"
              >
                <EyeOff size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-3 overflow-y-auto px-3 pb-3"
        style={{ maxHeight: "calc(100vh - 240px)" }}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          {isLoading && <JobCardSkeleton count={3} />}

          {!isLoading && resolvedItems.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-background/55 p-6">
              <p className="text-center text-sm text-muted-foreground">{emptyState}</p>
            </div>
          )}

          {!isLoading &&
            resolvedItems.map((item) => (
              <BoardItemCard
                key={item.id}
                item={item}
                onDelete={onDeleteItem ? () => onDeleteItem(item.id) : undefined}
                isDeleting={deletingItemId === item.id}
                onEdit={onEditItem ? () => onEditItem(item) : undefined}
              />
            ))}
        </SortableContext>
      </div>
    </div>
  );
}
