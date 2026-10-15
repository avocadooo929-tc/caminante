-- Camina 每日学习功能（在 0001 之后运行，可重复运行）

-- 用户每日学习目标（新词数）
alter table public.profiles add column if not exists daily_goal int not null default 20;

-- 每日学习记录
create table if not exists public.study_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  study_date date not null,
  words_added int not null default 0,
  words_reviewed int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, study_date)
);

alter table public.study_logs enable row level security;
drop policy if exists "study_logs_select_own" on public.study_logs;
create policy "study_logs_select_own" on public.study_logs for select to authenticated using (user_id = auth.uid());
drop policy if exists "study_logs_insert_own" on public.study_logs;
create policy "study_logs_insert_own" on public.study_logs for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "study_logs_update_own" on public.study_logs;
create policy "study_logs_update_own" on public.study_logs for update to authenticated using (user_id = auth.uid());
