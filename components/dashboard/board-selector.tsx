"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutGrid, Trash2 } from "lucide-react";
import { useBoards } from "@/hooks/use-boards";
import { createBoardSchema } from "@/types/boards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Board } from "@/types/boards";

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const BOARD_GRADIENTS = [
  "from-violet-500/20 to-indigo-500/10",
  "from-blue-500/20 to-cyan-500/10",
  "from-emerald-500/20 to-teal-500/10",
  "from-amber-500/20 to-orange-500/10",
  "from-rose-500/20 to-pink-500/10",
  "from-fuchsia-500/20 to-purple-500/10",
];

function getBoardGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return BOARD_GRADIENTS[hash % BOARD_GRADIENTS.length];
}

interface CreateBoardModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreate: (name: string, description: string) => Promise<void>;
  readonly isPending: boolean;
}

function CreateBoardModal({ open, onOpenChange, onCreate, isPending }: CreateBoardModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function reset() {
    setName("");
    setDescription("");
    setError("");
    setFieldErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = createBoardSchema.safeParse({ name, description });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") errors[field] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await onCreate(result.data.name, result.data.description);
      reset();
      onOpenChange(false);
    } catch {
      setError("Failed to create board. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New board</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="board-name" className="text-sm font-semibold">
              Name
            </Label>
            <Input
              id="board-name"
              placeholder="My Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={80}
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.name && (
              <p className="text-sm font-medium text-destructive">{fieldErrors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="board-desc" className="text-sm font-semibold">
              Description <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="board-desc"
              placeholder="What is this board for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
            />
            {fieldErrors.description && (
              <p className="text-sm font-medium text-destructive">{fieldErrors.description}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-11 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {isPending ? "Creating..." : "Create board"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface BoardCardProps {
  readonly board: Board;
  readonly onOpen: () => void;
  readonly onDelete: () => void;
  readonly isDeleting: boolean;
}

function BoardCard({ board, onOpen, onDelete, isDeleting }: BoardCardProps) {
  const [confirming, setConfirming] = useState(false);

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirming) {
      onDelete();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  }

  const gradient = getBoardGradient(board.id);

  return (
    <button
      onClick={onOpen}
      onMouseLeave={() => setConfirming(false)}
      disabled={isDeleting}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-left transition-all duration-200 cursor-pointer",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30",
        isDeleting && "pointer-events-none opacity-50",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Gradient top band */}
      <div className={`h-24 w-full bg-gradient-to-br ${gradient} transition-opacity`} />

      {/* Delete button */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-3 top-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDelete}
          className={[
            "flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all duration-150",
            confirming
              ? "bg-destructive text-destructive-foreground opacity-100"
              : "bg-black/20 text-white/80 opacity-0 hover:bg-destructive/80 hover:text-white group-hover:opacity-100",
          ].join(" ")}
        >
          <Trash2 size={11} />
          {confirming && "Confirm"}
        </button>
      </div>

      {/* Icon */}
      <div className="absolute left-4 top-12 flex h-12 w-12 items-center justify-center rounded-xl border border-border/60 bg-card shadow-sm">
        <LayoutGrid size={20} className="text-primary" />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 p-4 pt-8">
        <p className="truncate text-sm font-bold tracking-tight">{board.name}</p>
        {board.description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{board.description}</p>
        )}
        <p className="mt-2 text-[10px] text-muted-foreground/60">
          {relativeTime(board.created_at)}
        </p>
      </div>
    </button>
  );
}

export function BoardSelector() {
  const router = useRouter();
  const { boards, isLoading, isError, refetch, createBoard, deleteBoard } = useBoards();
  const [createOpen, setCreateOpen] = useState(false);

  async function handleCreate(name: string, description: string) {
    const board = await createBoard.mutateAsync({ name, description });
    router.push(`/dashboard/board/${board.id}`);
  }

  return (
    <div className="flex h-full flex-col p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your boards</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a board to open it, or create a new one.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-10 gap-2 rounded-xl px-5 text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          <Plus className="h-4 w-4" />
          New board
        </Button>
      </div>

      {/* Error */}
      {isError && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">Could not load your boards.</p>
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

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
            >
              <Skeleton className="h-24 w-full rounded-none" />
              <div className="flex flex-col gap-2 p-4 pt-8">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="mt-2 h-2 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : boards.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-border/50 py-24">
          <LayoutGrid size={40} className="text-muted-foreground/40" />
          <div className="text-center">
            <p className="font-semibold text-foreground">No boards yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first board to get started.
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 rounded-xl shadow-lg shadow-primary/25"
          >
            <Plus className="h-4 w-4" />
            New board
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onOpen={() => router.push(`/dashboard/board/${board.id}`)}
              onDelete={() => deleteBoard.mutate(board.id)}
              isDeleting={deleteBoard.isPending && deleteBoard.variables === board.id}
            />
          ))}
        </div>
      )}

      <CreateBoardModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={handleCreate}
        isPending={createBoard.isPending}
      />
    </div>
  );
}
