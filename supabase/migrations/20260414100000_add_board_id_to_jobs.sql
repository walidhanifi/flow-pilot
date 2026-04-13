-- Add board_id FK to jobs (nullable for backward compat with existing rows)
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS board_id UUID REFERENCES public.boards(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS jobs_board_id_idx ON public.jobs (board_id);
