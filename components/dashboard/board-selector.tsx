"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, FolderKanban, Handshake, LayoutGrid, Plus, Trash2 } from "lucide-react";
import { useBoards } from "@/hooks/use-boards";
import { BOARD_TYPE_CONFIG } from "@/types/board-items";
import { BOARD_TYPES, createBoardSchema, type Board, type BoardType } from "@/types/boards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

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
  "from-amber-500/25 via-orange-500/10 to-transparent",
  "from-sky-500/25 via-cyan-500/10 to-transparent",
  "from-emerald-500/25 via-teal-500/10 to-transparent",
  "from-rose-500/25 via-pink-500/10 to-transparent",
  "from-indigo-500/25 via-violet-500/10 to-transparent",
  "from-lime-500/25 via-emerald-500/10 to-transparent",
];

function getBoardGradient(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return BOARD_GRADIENTS[hash % BOARD_GRADIENTS.length];
}

const BOARD_TYPE_ICONS = {
  job: BriefcaseBusiness,
  project: FolderKanban,
  sales: Handshake,
} satisfies Record<BoardType, React.ComponentType<{ size?: number; className?: string }>>;

interface CreateBoardModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreate: (payload: {
    name: string;
    description: string;
    type: BoardType;
  }) => Promise<void>;
  readonly isPending: boolean;
}

function CreateBoardModal({ open, onOpenChange, onCreate, isPending }: CreateBoardModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<BoardType>("job");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function reset() {
    setName("");
    setDescription("");
    setType("job");
    setError("");
    setFieldErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = createBoardSchema.safeParse({ name, description, type });
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
      await onCreate(result.data);
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
      <DialogContent className="overflow-hidden border-border/60 bg-background/95 p-0 backdrop-blur sm:max-w-[560px]">
        <div className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-background px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Create a new board</DialogTitle>
          </DialogHeader>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Pick the workflow first. The board will use a dedicated table and tailored default
            columns.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 pt-5">
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Board type</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {BOARD_TYPES.map((boardType) => {
                const config = BOARD_TYPE_CONFIG[boardType];
                const Icon = BOARD_TYPE_ICONS[boardType];
                const isSelected = type === boardType;

                return (
                  <button
                    key={boardType}
                    type="button"
                    onClick={() => setType(boardType)}
                    className={[
                      "rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer",
                      "bg-card/70 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border/60",
                    ].join(" ")}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                    <p className="mt-3 text-sm font-semibold">{config.label}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {config.shortDescription}
                    </p>
                  </button>
                );
              })}
            </div>
            {fieldErrors.type && (
              <p className="text-sm font-medium text-destructive">{fieldErrors.type}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="board-name" className="text-sm font-semibold">
                Name
              </Label>
              <Input
                id="board-name"
                placeholder="Q3 pipeline"
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
                placeholder="What this board is tracking"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                className="h-11 rounded-xl border-border/80 bg-muted/40 px-4 text-sm transition-colors focus-visible:bg-background"
              />
              {fieldErrors.description && (
                <p className="text-sm font-medium text-destructive">{fieldErrors.description}</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Selected workflow
            </p>
            <p className="mt-2 text-sm font-semibold">{BOARD_TYPE_CONFIG[type].label}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {BOARD_TYPE_CONFIG[type].description}
            </p>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-11 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            {isPending ? "Creating board..." : "Create board"}
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
  const router = useRouter();
  const gradient = getBoardGradient(board.id);
  const Icon = BOARD_TYPE_ICONS[board.type];
  const typeConfig = BOARD_TYPE_CONFIG[board.type];

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirming) {
      onDelete();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  }

  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => router.prefetch(`/dashboard/board/${board.id}`)}
      onFocus={() => router.prefetch(`/dashboard/board/${board.id}`)}
      onMouseLeave={() => setConfirming(false)}
      disabled={isDeleting}
      className={[
        "group relative flex flex-col overflow-hidden rounded-[1.6rem] border border-border/60 bg-card text-left transition-all duration-300 cursor-pointer",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10",
        board.isPending && "animate-pulse",
        isDeleting && "pointer-events-none opacity-50",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={`relative h-28 w-full bg-gradient-to-br ${gradient}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_45%)]" />
      </div>

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

      <div className="absolute left-4 top-14 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/35 bg-card/90 shadow-lg backdrop-blur">
        <Icon size={22} className="text-primary" />
      </div>

      <div className="flex flex-col gap-2 p-4 pt-10">
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {typeConfig.label}
          </span>
          {board.isPending && (
            <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              Creating
            </span>
          )}
        </div>
        <p className="truncate text-base font-bold tracking-tight">{board.name}</p>
        <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
          {board.description || typeConfig.description}
        </p>
        <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground/70">
          <span>{typeConfig.shortDescription}</span>
          <span>{relativeTime(board.created_at)}</span>
        </div>
      </div>
    </button>
  );
}

function BoardCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-border/60 bg-card">
      <Skeleton
        shimmerClassName="from-transparent via-white/50 to-transparent dark:via-white/10"
        className="h-28 w-full rounded-none"
      />
      <div className="space-y-3 p-4 pt-10">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function BoardSelector() {
  const router = useRouter();
  const { boards, isLoading, isError, refetch, createBoard, deleteBoard } = useBoards();
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    for (const board of boards.slice(0, 6)) {
      router.prefetch(`/dashboard/board/${board.id}`);
    }
  }, [boards, router]);

  async function handleCreate(payload: { name: string; description: string; type: BoardType }) {
    const board = await createBoard.mutateAsync(payload);
    router.push(`/dashboard/board/${board.id}`);
  }

  return (
    <div className="flex h-full flex-col p-6 lg:p-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/85 p-6 shadow-xl shadow-primary/5 backdrop-blur lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,oklch(0.72_0.14_45_/_.18),transparent_36%),radial-gradient(circle_at_bottom_right,oklch(0.75_0.14_210_/_.14),transparent_30%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
              Workspace
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight lg:text-4xl">Your boards</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Open an existing workflow or spin up a new board with its own schema, defaults, and
              polished loading states.
            </p>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-11 gap-2 rounded-xl px-5 text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            <Plus className="h-4 w-4" />
            New board
          </Button>
        </div>
      </div>

      {isError && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
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

      {isLoading ? (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BoardCardSkeleton key={i} />
          ))}
        </div>
      ) : boards.length === 0 ? (
        <div className="mt-8 flex flex-1 flex-col items-center justify-center gap-4 rounded-[2rem] border-2 border-dashed border-border/50 bg-card/40 py-24">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <LayoutGrid size={30} />
          </div>
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
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
