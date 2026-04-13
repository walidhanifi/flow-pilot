-- Create boards table
CREATE TABLE IF NOT EXISTS public.boards (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS boards_user_id_idx ON public.boards (user_id);

ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "boards_select" ON public.boards
  FOR SELECT TO authenticated, anon
  USING (auth.uid() = user_id);

CREATE POLICY "boards_insert" ON public.boards
  FOR INSERT TO authenticated, anon
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "boards_update" ON public.boards
  FOR UPDATE TO authenticated, anon
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "boards_delete" ON public.boards
  FOR DELETE TO authenticated, anon
  USING (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.boards TO authenticated, anon;
