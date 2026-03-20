import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createJobSchema } from "@/types/jobs";
import { NextResponse, type NextRequest } from "next/server";

const JOB_COLUMNS = "id, user_id, company, role, url, status, position, created_at";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_COLUMNS)
    .eq("user_id", user.id)
    .order("position", { ascending: true })
    .limit(200);

  if (error) {
    console.error("[jobs] GET error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
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
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
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
    .single();

  const nextPosition = maxRow ? maxRow.position + 1 : 0;

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      user_id: user.id,
      company: result.data.company,
      role: result.data.role,
      url: result.data.url,
      status: "applied",
      position: nextPosition,
    })
    .select(JOB_COLUMNS)
    .single();

  if (error) {
    console.error("[jobs] POST error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to create job" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data }, { status: 201 });
}
