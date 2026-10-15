-- Caminante 1.0.07：在「我的」板块选择练习模式（中译西 / 西译中）
-- 在 0001/0002/0003 之后运行，可重复运行。

alter table public.profiles
  add column if not exists exercise_type text not null default 'translate_zh_es'
  check (exercise_type in ('translate_zh_es', 'translate_es_zh'));
