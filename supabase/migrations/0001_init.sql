-- Caminante 数据库初始化（在 Supabase SQL Editor 中运行本文件，再运行 seed 文件）

create extension if not exists pgcrypto;

-- ===== 用户档案 =====
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  target_level text not null default 'A1'
    check (target_level in ('A1','A2','B1','B2','C1')),
  created_at timestamptz not null default now()
);

-- ===== 单词主表（全局共享） =====
create table if not exists public.words (
  id uuid primary key default gen_random_uuid(),
  spanish text not null,
  pos text not null check (pos in
    ('noun','verb','adjective','adverb','pronoun','preposition','conjunction','interjection','article')),
  definition_cn text not null,
  level text not null check (level in ('A1','A2','B1','B2','C1')),
  frequency_rank int,
  source text not null default 'builtin'
    check (source in ('builtin','textbook','manual')),
  gender text check (gender in ('m','f')),
  created_at timestamptz not null default now(),
  unique (spanish, pos)
);
create index if not exists words_spanish_idx on public.words (spanish);

-- ===== 教材与教材词表 =====
create table if not exists public.textbooks (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

create table if not exists public.textbook_words (
  id uuid primary key default gen_random_uuid(),
  textbook_id uuid not null references public.textbooks(id) on delete cascade,
  word_id uuid not null references public.words(id) on delete cascade,
  unit text,
  unique (textbook_id, word_id)
);

-- ===== 每个用户的背词状态（SRS） =====
create table if not exists public.user_words (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id uuid not null references public.words(id) on delete cascade,
  status text not null default 'new' check (status in ('new','learning','known')),
  ease_factor real not null default 2.5,
  interval_days int not null default 0,
  due_at timestamptz not null default now(),
  correct_count int not null default 0,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, word_id)
);
create index if not exists user_words_user_due_idx on public.user_words (user_id, due_at);

-- ===== 例句缓存 =====
create table if not exists public.sentences (
  id uuid primary key default gen_random_uuid(),
  word_id uuid not null references public.words(id) on delete cascade,
  level text not null check (level in ('A1','A2','B1','B2','C1')),
  spanish text not null,
  chinese text not null,
  created_at timestamptz not null default now(),
  unique (word_id, level, spanish)
);
create index if not exists sentences_word_level_idx on public.sentences (word_id, level);

-- ===== 造句/翻译练习记录 =====
create table if not exists public.exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_type text not null,
  prompt text not null,
  user_answer text,
  feedback text,
  score int,
  created_at timestamptz not null default now()
);

-- ===== 语法教程 =====
create table if not exists public.grammar_lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  level text not null check (level in ('A1','A2','B1','B2','C1')),
  order_index int not null default 0,
  explanation_cn text not null default ''
);

create table if not exists public.grammar_exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.grammar_lessons(id) on delete cascade,
  prompt text not null,
  answer text,
  order_index int not null default 0
);

create table if not exists public.grammar_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id uuid not null references public.grammar_exercises(id) on delete cascade,
  user_answer text,
  feedback text,
  correct boolean,
  created_at timestamptz not null default now()
);

-- ===== 自动为用户创建档案 =====
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ===== 行级安全（RLS） =====
alter table public.profiles enable row level security;
alter table public.words enable row level security;
alter table public.textbooks enable row level security;
alter table public.textbook_words enable row level security;
alter table public.user_words enable row level security;
alter table public.sentences enable row level security;
alter table public.exercise_attempts enable row level security;
alter table public.grammar_lessons enable row level security;
alter table public.grammar_exercises enable row level security;
alter table public.grammar_attempts enable row level security;

-- profiles：仅本人可读写
create policy "profiles_select_own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid());

-- words：所有登录用户可读；可添加自己的 manual 词
create policy "words_select" on public.words for select to authenticated using (true);
create policy "words_insert_manual" on public.words for insert to authenticated with check (source = 'manual');

-- 教材/教材词表：登录用户可读
create policy "textbooks_select" on public.textbooks for select to authenticated using (true);
create policy "textbook_words_select" on public.textbook_words for select to authenticated using (true);

-- user_words：仅本人
create policy "user_words_select_own" on public.user_words for select to authenticated using (user_id = auth.uid());
create policy "user_words_insert_own" on public.user_words for insert to authenticated with check (user_id = auth.uid());
create policy "user_words_update_own" on public.user_words for update to authenticated using (user_id = auth.uid());
create policy "user_words_delete_own" on public.user_words for delete to authenticated using (user_id = auth.uid());

-- sentences：登录用户可读、可写（共享缓存）
create policy "sentences_select" on public.sentences for select to authenticated using (true);
create policy "sentences_insert" on public.sentences for insert to authenticated with check (true);

-- 练习记录：仅本人
create policy "exercise_attempts_select_own" on public.exercise_attempts for select to authenticated using (user_id = auth.uid());
create policy "exercise_attempts_insert_own" on public.exercise_attempts for insert to authenticated with check (user_id = auth.uid());

-- 语法：登录用户可读
create policy "grammar_lessons_select" on public.grammar_lessons for select to authenticated using (true);
create policy "grammar_exercises_select" on public.grammar_exercises for select to authenticated using (true);

-- 语法作答：仅本人
create policy "grammar_attempts_select_own" on public.grammar_attempts for select to authenticated using (user_id = auth.uid());
create policy "grammar_attempts_insert_own" on public.grammar_attempts for insert to authenticated with check (user_id = auth.uid());
