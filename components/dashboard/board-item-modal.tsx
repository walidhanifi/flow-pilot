"use client";

import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import {
  BOARD_TYPE_CONFIG,
  createBoardItemSchema,
  updateBoardItemSchema,
  type BoardItem,
  type BoardItemStatus,
  type CreateBoardItemPayload,
  type UpdateBoardItemPayload,
} from "@/types/board-items";
import type { BoardType } from "@/types/boards";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BoardItemModalProps {
  readonly boardType: BoardType;
  readonly item: BoardItem | null;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly createItem: UseMutationResult<BoardItem, Error, CreateBoardItemPayload>;
  readonly updateItem: UseMutationResult<BoardItem, Error, UpdateBoardItemPayload & { id: string }>;
}

export function BoardItemModal({
  boardType,
  item,
  open,
  onOpenChange,
  createItem,
  updateItem,
}: BoardItemModalProps) {
  const config = BOARD_TYPE_CONFIG[boardType];
  const [title, setTitle] = useState(item?.title ?? "");
  const [subtitle, setSubtitle] = useState(item?.subtitle ?? "");
  const [link, setLink] = useState(item?.link ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [status, setStatus] = useState<BoardItemStatus>(item?.status ?? config.statuses[0]);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      if (item) {
        const result = updateBoardItemSchema.safeParse({ title, subtitle, link, notes, status });
        if (!result.success) {
          const errors: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const field = issue.path[0];
            if (typeof field === "string") errors[field] = issue.message;
          }
          setFieldErrors(errors);
          return;
        }

        await updateItem.mutateAsync({ id: item.id, ...result.data });
      } else {
        const result = createBoardItemSchema.safeParse({ title, subtitle, link });
        if (!result.success) {
          const errors: Record<string, string> = {};
          for (const issue of result.error.issues) {
            const field = issue.path[0];
            if (typeof field === "string") errors[field] = issue.message;
          }
          setFieldErrors(errors);
          return;
        }

        await createItem.mutateAsync(result.data);
      }
      onOpenChange(false);
    } catch {
      setError(`Failed to ${item ? "save" : "add"} item. Please try again.`);
    }
  }

  const isPending = createItem.isPending || updateItem.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {item ? "Edit item" : `Add ${config.fields.title.label.toLowerCase()}`}
          </DialogTitle>
          <DialogDescription>
            Capture the key details for this {config.label.toLowerCase()} item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="item-title" className="text-sm font-semibold">
                {config.fields.title.label}
              </Label>
              <Input
                id="item-title"
                placeholder={config.fields.title.placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
              />
              {fieldErrors.title && (
                <p className="text-sm font-medium text-destructive">{fieldErrors.title}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="item-subtitle" className="text-sm font-semibold">
                {config.fields.subtitle.label}
              </Label>
              <Input
                id="item-subtitle"
                placeholder={config.fields.subtitle.placeholder}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                required
                className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
              />
              {fieldErrors.subtitle && (
                <p className="text-sm font-medium text-destructive">{fieldErrors.subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="item-link" className="text-sm font-semibold">
              {config.fields.link.label}{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="item-link"
              placeholder={config.fields.link.placeholder}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.link && (
              <p className="text-sm font-medium text-destructive">{fieldErrors.link}</p>
            )}
          </div>

          {item && (
            <>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="item-notes" className="text-sm font-semibold">
                  Notes <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <textarea
                  id="item-notes"
                  placeholder="Add context, reminders, or next steps"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border/80 bg-muted/40 px-4 py-3 text-sm transition-colors focus-visible:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-semibold">Status</Label>
                <div className="flex flex-wrap gap-2">
                  {config.columns.map((column) => (
                    <button
                      key={column.status}
                      type="button"
                      onClick={() => setStatus(column.status)}
                      className={[
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                        status === column.status
                          ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                          : "border-border/60 bg-muted/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                      ].join(" ")}
                    >
                      {column.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-11 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {isPending ? (item ? "Saving..." : "Adding...") : item ? "Save changes" : "Add item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
