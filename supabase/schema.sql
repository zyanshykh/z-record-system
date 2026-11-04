-- Z Record System: cloud storage for matches.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.game_sessions (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  id         text        not null,
  status     text        not null default 'active',
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists game_sessions_user_updated_idx
  on public.game_sessions (user_id, updated_at desc);

-- Every user can only see and change their own matches.
alter table public.game_sessions enable row level security;

drop policy if exists "Users read own sessions" on public.game_sessions;
create policy "Users read own sessions" on public.game_sessions
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users insert own sessions" on public.game_sessions;
create policy "Users insert own sessions" on public.game_sessions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users update own sessions" on public.game_sessions;
create policy "Users update own sessions" on public.game_sessions
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users delete own sessions" on public.game_sessions;
create policy "Users delete own sessions" on public.game_sessions
  for delete to authenticated
  using ((select auth.uid()) = user_id);
