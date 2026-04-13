import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/dashboard/kanban-board";

export const dynamic = "force-dynamic";

interface BoardPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify board exists and belongs to user
  const { data: board } = await supabase
    .from("boards")
    .select("id, name")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!board) redirect("/dashboard");

  return (
    <div className="bg-dot-grid min-h-full">
      <KanbanBoard boardId={board.id} boardName={board.name} />
    </div>
  );
}
