ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'job'
  CHECK (type IN ('job', 'project', 'sales'));

CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assignee TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'backlog'
    CHECK (status IN ('backlog', 'active', 'review', 'shipped')),
  position INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS project_tasks_user_id_idx ON public.project_tasks (user_id);
CREATE INDEX IF NOT EXISTS project_tasks_board_id_idx ON public.project_tasks (board_id);
CREATE INDEX IF NOT EXISTS project_tasks_status_position_idx
  ON public.project_tasks (board_id, status, position);

ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_tasks_select" ON public.project_tasks
  FOR SELECT TO authenticated, anon
  USING (auth.uid() = user_id);

CREATE POLICY "project_tasks_insert" ON public.project_tasks
  FOR INSERT TO authenticated, anon
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_tasks_update" ON public.project_tasks
  FOR UPDATE TO authenticated, anon
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "project_tasks_delete" ON public.project_tasks
  FOR DELETE TO authenticated, anon
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_tasks TO authenticated, anon;

CREATE TABLE IF NOT EXISTS public.sales_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  website TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'lead'
    CHECK (status IN ('lead', 'qualified', 'proposal', 'won')),
  position INTEGER NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sales_leads_user_id_idx ON public.sales_leads (user_id);
CREATE INDEX IF NOT EXISTS sales_leads_board_id_idx ON public.sales_leads (board_id);
CREATE INDEX IF NOT EXISTS sales_leads_status_position_idx
  ON public.sales_leads (board_id, status, position);

ALTER TABLE public.sales_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sales_leads_select" ON public.sales_leads
  FOR SELECT TO authenticated, anon
  USING (auth.uid() = user_id);

CREATE POLICY "sales_leads_insert" ON public.sales_leads
  FOR INSERT TO authenticated, anon
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sales_leads_update" ON public.sales_leads
  FOR UPDATE TO authenticated, anon
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sales_leads_delete" ON public.sales_leads
  FOR DELETE TO authenticated, anon
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.sales_leads TO authenticated, anon;
