import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Board, CreateBoardPayload, UpdateBoardPayload } from "@/types/boards";

const BOARDS_KEY = ["boards"] as const;

async function fetchBoards(): Promise<Board[]> {
  const res = await fetch("/api/boards");
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Failed to fetch boards");
  }
  return json.data;
}

export function useBoards() {
  const queryClient = useQueryClient();

  const {
    data: boards = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Board[]>({
    queryKey: BOARDS_KEY,
    queryFn: fetchBoards,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const createBoard = useMutation({
    mutationFn: async (payload: CreateBoardPayload) => {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to create board");
      }
      return json.data as Board;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: BOARDS_KEY });
      const previous = queryClient.getQueryData<Board[]>(BOARDS_KEY);
      const optimisticBoard: Board = {
        id: `pending-${crypto.randomUUID()}`,
        user_id: "pending",
        name: payload.name,
        description: payload.description,
        type: payload.type,
        created_at: new Date().toISOString(),
        isPending: true,
      };

      queryClient.setQueryData<Board[]>(BOARDS_KEY, (old = []) => [...old, optimisticBoard]);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(BOARDS_KEY, context.previous);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARDS_KEY });
    },
  });

  const updateBoard = useMutation({
    mutationFn: async ({ id, ...payload }: UpdateBoardPayload & { id: string }) => {
      const res = await fetch(`/api/boards/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to update board");
      }
      return json.data as Board;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARDS_KEY });
    },
  });

  const deleteBoard = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/boards/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to delete board");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARDS_KEY });
    },
  });

  return {
    boards,
    isLoading,
    isError,
    error,
    refetch,
    createBoard,
    updateBoard,
    deleteBoard,
  };
}
