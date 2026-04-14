import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createBoardSchema } from "@/types/boards";
import { NextResponse, type NextRequest } from "next/server";

const BOARD_COLUMNS = "id, user_id, name, description, type, created_at";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("boards")
    .select(BOARD_COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("[boards] GET error:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not load your boards. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const result = createBoardSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("boards")
    .insert({
      user_id: user.id,
      name: result.data.name,
      description: result.data.description,
      type: result.data.type,
    })
    .select(BOARD_COLUMNS)
    .single();

  if (error) {
    console.error("[boards] POST error:", error.message);
    return NextResponse.json(
      { success: false, error: "Could not create board. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
