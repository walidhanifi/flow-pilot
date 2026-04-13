import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createJobSchema } from "@/types/jobs";
import { NextResponse, type NextRequest } from "next/server";

const JOB_COLUMNS =
  "id, user_id, board_id, company, role, url, status, position, notes, created_at";

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

  let query = supabase
    .from("jobs")
    .select(JOB_COLUMNS)
    .eq("user_id", user.id)
    .order("position", { ascending: true })
    .limit(200);

  if (boardId) {
    query = query.eq("board_id", boardId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[jobs] GET error:", error.message, error.code, error.details);
    return NextResponse.json(
      {
        success: false,
        error: "Could not load your jobs. Please try again.",
        code: error.code,
      },
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
  let boardId: string | undefined;
  try {
    const raw = await request.json();
    // Extract board_id separately — not part of createJobSchema
    if (raw && typeof raw === "object" && "board_id" in raw) {
      boardId = typeof raw.board_id === "string" ? raw.board_id : undefined;
    }
    body = raw;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const result = createJobSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  // Determine next position for "applied" column
  const { data: maxRow } = await supabase
    .from("jobs")
    .select("position")
    .eq("user_id", user.id)
    .eq("status", "applied")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = maxRow ? maxRow.position + 1 : 0;

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      user_id: user.id,
      board_id: boardId ?? null,
      company: result.data.company,
      role: result.data.role,
      url: result.data.url,
      status: "applied",
      position: nextPosition,
    })
    .select(JOB_COLUMNS)
    .single();

  if (error) {
    console.error("[jobs] POST error:", error.message, error.code, error.details);
    return NextResponse.json(
      {
        success: false,
        error: "Could not create job. Please try again.",
        code: error.code,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
