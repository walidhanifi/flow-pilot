"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Eye, Plus } from "lucide-react";
import { useBoardItems } from "@/hooks/use-board-items";
import { useColumnSettings } from "@/hooks/use-column-settings";
import { BOARD_TYPE_CONFIG, type BoardItem, type BoardItemStatus } from "@/types/board-items";
import type { BoardType } from "@/types/boards";
import { BoardItemCard } from "@/components/dashboard/board-item-card";
import { BoardItemModal } from "@/components/dashboard/board-item-modal";
import { KanbanColumn } from "@/components/dashboard/kanban-column";
import { Button } from "@/components/ui/button";

interface KanbanBoardProps {
  readonly boardId: string;
  readonly boardName?: string;
  readonly boardType?: BoardType;
}

export function KanbanBoard({
  boardId,
  boardName = "Your board",
  boardType = "job",
}: KanbanBoardProps) {
  const {
    items,
    itemsByStatus,
    isLoading,
    isError,
    error,
    refetch,
    addItem,
    updateItem,
    deleteItem,
  } = useBoardItems(boardId, boardType);
  const { visibleSettings, settings, hiddenCount, renameColumn, toggleColumn } =
    useColumnSettings(boardType);
  const config = BOARD_TYPE_CONFIG[boardType];
  const [activeItem, setActiveItem] = useState<BoardItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BoardItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    const item = items.find((entry) => entry.id === event.active.id);
    if (item) setActiveItem(item);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as { type: string; item: BoardItem } | undefined;
    if (!activeData || activeData.type !== "item") return;

    const draggedItem = activeData.item;
    const overData = over.data.current as
      | { type: string; status?: BoardItemStatus; item?: BoardItem }
      | undefined;

    let targetStatus: BoardItemStatus | undefined;

    if (overData?.type === "column" && overData.status) {
      targetStatus = overData.status;
    } else if (overData?.type === "item" && overData.item) {
      targetStatus = overData.item.status;
    } else if (config.statuses.includes(over.id as BoardItemStatus)) {
      targetStatus = over.id as BoardItemStatus;
    }

    if (!targetStatus) return;

    const targetItems = itemsByStatus[targetStatus] ?? [];
    const newPosition =
      overData?.type === "item" && overData.item
        ? overData.item.position
        : targetItems.length > 0
          ? targetItems[targetItems.length - 1].position + 1
          : 0;

    if (draggedItem.status === targetStatus && draggedItem.position === newPosition) return;
    updateItem.mutate({ id: draggedItem.id, status: targetStatus, position: newPosition });
  }

  const hiddenSettings = settings.filter((setting) => !setting.visible);

  return (
    <div className="flex h-full flex-col p-6 lg:p-8">
      <div className="mb-6 rounded-[1.8rem] border border-border/60 bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
              {config.label}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">{boardName}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {config.description}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingItem(null);
              setModalOpen(true);
            }}
            disabled={isError}
            className="h-11 gap-2 rounded-xl px-5 text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <Plus className="h-4 w-4" />
            Add item
          </Button>
        </div>
      </div>

      {isError && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">
            {error instanceof Error ? error.message : "Something went wrong loading your items."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="ml-4 shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            Retry
          </Button>
        </div>
      )}

      {hiddenCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5">
          <span className="text-xs text-muted-foreground">
            {hiddenCount} hidden column{hiddenCount > 1 ? "s" : ""}
          </span>
          {hiddenSettings.map((setting) => (
            <button
              key={setting.status}
              onClick={() => toggleColumn(setting.status)}
              className="cursor-pointer flex items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              <Eye size={11} />
              {setting.label}
            </button>
          ))}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {visibleSettings.map((setting) => (
            <div key={setting.status} className="w-80 shrink-0">
              <KanbanColumn
                status={setting.status}
                label={setting.label}
                colorClass={setting.color}
                items={itemsByStatus[setting.status] ?? []}
                isLoading={isLoading}
                emptyState={config.emptyState}
                onDeleteItem={(id) => deleteItem.mutate(id)}
                deletingItemId={deleteItem.isPending ? (deleteItem.variables as string) : undefined}
                onRename={renameColumn}
                onHide={toggleColumn}
                onEditItem={setEditingItem}
              />
            </div>
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeItem && <BoardItemCard item={activeItem} isDragOverlay />}
        </DragOverlay>
      </DndContext>

      <BoardItemModal
        key={`${boardType}-${editingItem?.id ?? (modalOpen ? "new-open" : "new-closed")}`}
        boardType={boardType}
        item={editingItem}
        open={modalOpen || !!editingItem}
        onOpenChange={(open) => {
          if (!open) {
            setModalOpen(false);
            setEditingItem(null);
            return;
          }
          if (!editingItem) setModalOpen(true);
        }}
        createItem={addItem}
        updateItem={updateItem}
      />
    </div>
  );
}
