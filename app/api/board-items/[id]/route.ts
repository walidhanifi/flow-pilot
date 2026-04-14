import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getBoardTableConfig } from "@/lib/board-items";
import { updateBoardItemSchema } from "@/types/board-items";
import type { BoardType } from "@/types/boards";

async function getBoardForRequest(request: NextRequest, userId: string) {
  const supabase = await createServerSupabaseClient();
  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return { supabase, board: null, boardId: null };
  }

  const { data: board, error } = await supabase
    .from("boards")
    .select("id, type")
    .eq("id", boardId)
    .eq("user_id", userId)
    .single();

  if (error || !board) {
    return { supabase, board: null, boardId };
  }

  return { supabase, board: board as { id: string; type: BoardType }, boardId };
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authSupabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { supabase, board, boardId } = await getBoardForRequest(request, user.id);

  if (!board || !boardId) {
    return NextResponse.json({ success: false, error: "Board not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const result = updateBoardItemSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const tableConfig = getBoardTableConfig(board.type);
  const patch = tableConfig.toPatch(result.data);

  const { data, error } = await supabase
    .from(tableConfig.table)
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("board_id", boardId)
    .select(tableConfig.columns)
    .single();

  if (error) {
    console.error("[board-items] PATCH error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: tableConfig.toItem(data as unknown as Record<string, unknown>),
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authSupabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await authSupabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { supabase, board, boardId } = await getBoardForRequest(request, user.id);

  if (!board || !boardId) {
    return NextResponse.json({ success: false, error: "Board not found" }, { status: 404 });
  }

  const tableConfig = getBoardTableConfig(board.type);
  const { data, error } = await supabase
    .from(tableConfig.table)
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("board_id", boardId)
    .select("id")
    .single();

  if (error) {
    console.error("[board-items] DELETE error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
