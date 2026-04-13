import { createServerSupabaseClient } from "@/lib/supabase/server";
import { updateJobSchema } from "@/types/jobs";
import { NextResponse, type NextRequest } from "next/server";

const JOB_COLUMNS = "id, user_id, company, role, url, status, position, notes, created_at";

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

  const result = updateJobSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const patch: Record<string, unknown> = {};
  if (result.data.status !== undefined) patch.status = result.data.status;
  if (result.data.position !== undefined) patch.position = result.data.position;
  if (result.data.company !== undefined) patch.company = result.data.company;
  if (result.data.role !== undefined) patch.role = result.data.role;
  if (result.data.url !== undefined) patch.url = result.data.url;
  if (result.data.notes !== undefined) patch.notes = result.data.notes;

  const { data, error } = await supabase
    .from("jobs")
    .update(patch)
    .eq("id", id)
    .eq("user_id", user.id)
    .select(JOB_COLUMNS)
    .single();

  if (error) {
    console.error("[jobs] PATCH error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to update job" }, { status: 500 });
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
    .from("jobs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) {
    console.error("[jobs] DELETE error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to delete job" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
