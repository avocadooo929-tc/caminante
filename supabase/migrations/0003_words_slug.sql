-- Caminante 方向B：词表静态化 + 稳定词 ID（slug）
-- ⚠️ 本迁移只运行一次（在 0001_init.sql + 0002_daily.sql 之后）。
-- 效果：内置/教材词移到应用静态数据 data/words.json；数据库 words 只留手动词；
--       user_words.word_id / sentences.word_id 由 uuid 改为 text(slug)，保留全部背词进度。
-- slug 规则与前端 lib/word-id.ts、scripts/generate-words-data.mjs 完全一致。

begin;

-- 1) 给 words 加 slug 列并回填（JS 端 wordId() 用相同规则）
alter table public.words add column if not exists slug text;
update public.words
set slug = btrim(regexp_replace(lower(spanish), '[^a-z0-9áéíóúüñ]+', '-', 'g'), '-') || '-' || pos;

-- 2) 删除教材表（单元信息已进静态数据 data/words.json）
drop table if exists public.textbook_words;
drop table if exists public.textbooks;

-- 3) 去掉 user_words / sentences 上指向 words 的外键（之后 word_id 是 slug，不再外键约束）
alter table public.user_words drop constraint if exists user_words_word_id_fkey;
alter table public.sentences drop constraint if exists sentences_word_id_fkey;

-- 兜底：删除任何仍指向 words 的外键
do $$
declare r record;
begin
  for r in
    select conname, conrelid::regclass::text as tbl
    from pg_constraint
    where contype = 'f' and confrelid = 'public.words'::regclass
  loop
    execute format('alter table %s drop constraint %I', r.tbl, r.conname);
  end loop;
end $$;

-- 4) 去掉涉及 word_id 的唯一约束（改类型后重建）
alter table public.user_words drop constraint if exists user_words_user_id_word_id_key;
alter table public.sentences drop constraint if exists sentences_word_id_level_spanish_key;

-- 5) user_words.word_id: uuid -> text(slug)
alter table public.user_words add column if not exists word_id_new text;
update public.user_words uw set word_id_new = w.slug
from public.words w where uw.word_id = w.id;
delete from public.user_words where word_id_new is null;
alter table public.user_words drop column if exists word_id;
alter table public.user_words rename column word_id_new to word_id;
alter table public.user_words alter column word_id set not null;
alter table public.user_words add constraint user_words_user_id_word_id_key unique (user_id, word_id);

-- 6) sentences.word_id: uuid -> text(slug)
alter table public.sentences add column if not exists word_id_new text;
update public.sentences s set word_id_new = w.slug
from public.words w where s.word_id = w.id;
delete from public.sentences where word_id_new is null;
alter table public.sentences drop column if exists word_id;
alter table public.sentences rename column word_id_new to word_id;
alter table public.sentences alter column word_id set not null;
alter table public.sentences add constraint sentences_word_id_level_spanish_key unique (word_id, level, spanish);

-- 7) words：只保留手动词，id 改为 slug（text 主键）
delete from public.words where source <> 'manual';
alter table public.words drop constraint if exists words_pkey;
alter table public.words drop column if exists id;
alter table public.words rename column slug to id;
alter table public.words alter column id set not null;
alter table public.words add constraint words_pkey primary key (id);

-- 8) 允许手动词被重复添加时更新（前端 upsert 的 on conflict do update 需要 update 权限）
drop policy if exists "words_update_manual" on public.words;
create policy "words_update_manual" on public.words
  for update to authenticated
  using (source = 'manual')
  with check (source = 'manual');

commit;
