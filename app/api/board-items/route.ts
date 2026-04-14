import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getBoardTableConfig } from "@/lib/board-items";
import { createBoardItemSchema } from "@/types/board-items";
import type { BoardType } from "@/types/boards";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const boardId = searchParams.get("boardId");

  if (!boardId) {
    return NextResponse.json({ success: false, error: "Missing boardId" }, { status: 400 });
  }

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("id, type")
    .eq("id", boardId)
    .eq("user_id", user.id)
    .single();

  if (boardError || !board) {
    return NextResponse.json({ success: false, error: "Board not found" }, { status: 404 });
  }

  const tableConfig = getBoardTableConfig(board.type as BoardType);
  const { data, error } = await supabase
    .from(tableConfig.table)
    .select(tableConfig.columns)
    .eq("user_id", user.id)
    .eq("board_id", boardId)
    .order("position", { ascending: true })
    .limit(200);

  if (error) {
    console.error("[board-items] GET error:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not load your items. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: (data ?? []).map((row) => tableConfig.toItem(row as unknown as Record<string, unknown>)),
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ success: false, error: "Missing board_id" }, { status: 400 });
  }

  const payload = raw as { board_id?: string };

  if (typeof payload.board_id !== "string") {
    return NextResponse.json({ success: false, error: "Missing board_id" }, { status: 400 });
  }

  const result = createBoardItemSchema.safeParse(raw);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const boardId = payload.board_id;
  const { data: board, error: boardError } = await supabase
    .from("boards")
    .select("id, type")
    .eq("id", boardId)
    .eq("user_id", user.id)
    .single();

  if (boardError || !board) {
    return NextResponse.json({ success: false, error: "Board not found" }, { status: 404 });
  }

  const tableConfig = getBoardTableConfig(board.type as BoardType);
  const { data: maxRow } = await supabase
    .from(tableConfig.table)
    .select("position")
    .eq("user_id", user.id)
    .eq("board_id", boardId)
    .eq("status", tableConfig.defaultStatus)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = maxRow ? Number(maxRow.position) + 1 : 0;

  const { data, error } = await supabase
    .from(tableConfig.table)
    .insert(
      tableConfig.toInsert({
        userId: user.id,
        boardId,
        title: result.data.title,
        subtitle: result.data.subtitle,
        link: result.data.link,
        position: nextPosition,
      })
    )
    .select(tableConfig.columns)
    .single();

  if (error) {
    console.error("[board-items] POST error:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not create item. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, data: tableConfig.toItem(data as unknown as Record<string, unknown>) },
    { status: 201 }
  );
}
