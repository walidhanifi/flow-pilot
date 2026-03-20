-- Grant table-level access to Supabase roles.
-- RLS policies (in 20260320000000) handle row-level filtering;
-- these grants allow the roles to reach the table in the first place.
grant select, insert, update, delete on public.jobs to authenticated;
grant select, insert, update, delete on public.jobs to anon;
