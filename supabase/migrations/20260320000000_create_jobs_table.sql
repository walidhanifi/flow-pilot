-- Create the jobs table for tracking job applications
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  url text not null default '',
  status text not null default 'applied'
    check (status in ('applied', 'interview', 'offer', 'rejected')),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by user
create index if not exists jobs_user_id_idx on public.jobs(user_id);

-- Index for ordering within a column
create index if not exists jobs_user_status_position_idx
  on public.jobs(user_id, status, position);

-- Enable Row Level Security
alter table public.jobs enable row level security;

-- Users can only see their own jobs
create policy "Users can view their own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

-- Users can only insert their own jobs
create policy "Users can insert their own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);

-- Users can only update their own jobs
create policy "Users can update their own jobs"
  on public.jobs for update
  using (auth.uid() = user_id);

-- Users can only delete their own jobs
create policy "Users can delete their own jobs"
  on public.jobs for delete
  using (auth.uid() = user_id);
