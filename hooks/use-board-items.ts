import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BOARD_TYPE_CONFIG,
  type BoardItem,
  type BoardItemStatus,
  type CreateBoardItemPayload,
  type UpdateBoardItemPayload,
} from "@/types/board-items";
import type { BoardType } from "@/types/boards";

function boardItemsKey(boardId: string) {
  return ["board-items", boardId] as const;
}

async function fetchBoardItems(boardId: string): Promise<BoardItem[]> {
  const res = await fetch(`/api/board-items?boardId=${encodeURIComponent(boardId)}`);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Failed to fetch items");
  }

  return (json.data as Array<Record<string, unknown>>).map((item) => ({
    id: String(item.id),
    user_id: String(item.user_id),
    board_id: String(item.board_id),
    title: String(item.title ?? item.company ?? ""),
    subtitle: String(item.subtitle ?? item.role ?? ""),
    link: String(item.link ?? item.url ?? ""),
    status: item.status as BoardItemStatus,
    position: Number(item.position ?? 0),
    notes: String(item.notes ?? ""),
    created_at: String(item.created_at),
    isPending: item.isPending === true,
  }));
}

export function useBoardItems(boardId: string, boardType: BoardType) {
  const queryClient = useQueryClient();
  const key = boardItemsKey(boardId);
  const statuses = BOARD_TYPE_CONFIG[boardType].statuses;

  const {
    data: items = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<BoardItem[]>({
    queryKey: key,
    queryFn: () => fetchBoardItems(boardId),
  });

  const itemsByStatus = useMemo(() => {
    const base = Object.fromEntries(
      statuses.map((status) => [status, [] as BoardItem[]])
    ) as Record<BoardItemStatus, BoardItem[]>;

    return items.reduce<Record<BoardItemStatus, BoardItem[]>>((acc, item) => {
      if (!statuses.includes(item.status)) return acc;
      acc[item.status] = [...acc[item.status], item].sort((a, b) => a.position - b.position);
      return acc;
    }, base);
  }, [items, statuses]);

  const addItem = useMutation({
    mutationFn: async (payload: CreateBoardItemPayload) => {
      const res = await fetch("/api/board-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, board_id: boardId }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to create item");
      }

      return json.data as BoardItem;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<BoardItem[]>(key);
      const firstStatus = statuses[0];

      const optimisticItem: BoardItem = {
        id: `pending-${crypto.randomUUID()}`,
        user_id: "pending",
        board_id: boardId,
        title: payload.title,
        subtitle: payload.subtitle,
        link: payload.link,
        status: firstStatus,
        position: previous?.filter((item) => item.status === firstStatus).length ?? 0,
        notes: "",
        created_at: new Date().toISOString(),
        isPending: true,
      };

      queryClient.setQueryData<BoardItem[]>(key, (old = []) => [...old, optimisticItem]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, ...payload }: UpdateBoardItemPayload & { id: string }) => {
      const res = await fetch(`/api/board-items/${id}?boardId=${encodeURIComponent(boardId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to update item");
      }

      return json.data as BoardItem;
    },
    onMutate: async ({ id, ...payload }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<BoardItem[]>(key);

      queryClient.setQueryData<BoardItem[]>(key, (old = []) =>
        old.map((item) => (item.id === id ? { ...item, ...payload } : item))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(key, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/board-items/${id}?boardId=${encodeURIComponent(boardId)}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to delete item");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key });
    },
  });

  return {
    items,
    itemsByStatus,
    statuses,
    isLoading,
    isError,
    error,
    refetch,
    addItem,
    updateItem,
    deleteItem,
  };
}
