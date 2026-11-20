-- Grandmaster Vault — Supabase PostgreSQL Schema & Row-Level Security (RLS)
-- Run this in the Supabase SQL Editor before deploying with VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY.

create extension if not exists "pgcrypto";

-- 1. User Progress, Bookmarks, Checklists & Mistake Log
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  completed_topics text[] not null default '{}',
  bookmarked_slugs text[] not null default '{}',
  solved_problems text[] not null default '{}',
  project_checklists jsonb not null default '{}'::jsonb,
  mistake_logs jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.user_progress enable row level security;

drop policy if exists "Users can view their own progress" on public.user_progress;
create policy "Users can view their own progress"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own progress" on public.user_progress;
create policy "Users can insert their own progress"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own progress" on public.user_progress;
create policy "Users can update their own progress"
  on public.user_progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own progress" on public.user_progress;
create policy "Users can delete their own progress"
  on public.user_progress
  for delete
  using (auth.uid() = user_id);

-- 2. Custom CMS Entries (Syllabus Extensions, Theory Guides, Vault Reductions)
create table if not exists public.custom_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in ('syllabus', 'theory', 'vault')),
  slug text not null unique,
  title text not null,
  rating_tier text not null,
  usaco_division text not null,
  domain text not null,
  payload jsonb not null default '{}'::jsonb,
  author_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.custom_entries enable row level security;

-- Public read access for all visitors
drop policy if exists "Anyone can read custom entries" on public.custom_entries;
create policy "Anyone can read custom entries"
  on public.custom_entries
  for select
  using (true);

-- Admin-only write policies (matches VITE_ADMIN_EMAIL / randomboy4016@gmail.com)
drop policy if exists "Admin can insert custom entries" on public.custom_entries;
create policy "Admin can insert custom entries"
  on public.custom_entries
  for insert
  with check (
    (auth.jwt() ->> 'email') = 'randomboy4016@gmail.com'
  );

drop policy if exists "Admin can update custom entries" on public.custom_entries;
create policy "Admin can update custom entries"
  on public.custom_entries
  for update
  using (
    (auth.jwt() ->> 'email') = 'randomboy4016@gmail.com'
  )
  with check (
    (auth.jwt() ->> 'email') = 'randomboy4016@gmail.com'
  );

drop policy if exists "Admin can delete custom entries" on public.custom_entries;
create policy "Admin can delete custom entries"
  on public.custom_entries
  for delete
  using (
    (auth.jwt() ->> 'email') = 'randomboy4016@gmail.com'
  );

-- Trigger to keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_user_progress_updated_at on public.user_progress;
create trigger trg_user_progress_updated_at
  before update on public.user_progress
  for each row execute function public.set_updated_at();

drop trigger if exists trg_custom_entries_updated_at on public.custom_entries;
create trigger trg_custom_entries_updated_at
  before update on public.custom_entries
  for each row execute function public.set_updated_at();
