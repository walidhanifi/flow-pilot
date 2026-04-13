-- Add notes column to jobs table for storing user notes about applications
alter table public.jobs add column notes text not null default '';
