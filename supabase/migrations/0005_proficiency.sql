-- Caminante 1.1.01：6 阶熟练度体系 + 例句分类 + 打卡标记
-- 在 0001/0002/0003/0004 之后运行，可重复运行。

-- 每个用户、每个单词的熟练度：0=尚未接触，6=完全掌握
alter table public.user_words
  add column if not exists proficiency int not null default 0;

-- 例句分类：flashcard=闪卡释义例句，exercise=练习栏例句（两者不同）
alter table public.sentences
  add column if not exists kind text not null default 'flashcard'
  check (kind in ('flashcard', 'exercise'));

-- 打卡标记：当日待新学+待复习清 0 后自动置 true
alter table public.study_logs
  add column if not exists checked boolean not null default false;
