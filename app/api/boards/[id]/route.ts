import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateBoardSchema } from "@/types/boards";
import { NextResponse, type NextRequest } from "next/server";

const BOARD_COLUMNS = "id, user_id, name, description, type, created_at";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("boards")
    .select(BOARD_COLUMNS)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const result = updateBoardSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const patch: Record<string, unknown> = {};
  if (result.data.name !== undefined) patch.name = result.data.name;
  if (result.data.description !== undefined) patch.description = result.data.description;
  if (result.data.type !== undefined) patch.type = result.data.type;

  const { data, error } = await supabase
    .from("boards")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .select(BOARD_COLUMNS)
    .single();

  if (error) {
    console.error("[boards] PATCH error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to update board" }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("boards")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) {
    console.error("[boards] DELETE error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to delete board" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ success: false, error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
