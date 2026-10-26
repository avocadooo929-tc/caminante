-- Caminante：语法板块框架重构（按《Complete Spanish Step-by-Step》6 大部分 / 30 章）
-- 在 0001-0005 之后运行，可重复运行。

alter table public.grammar_lessons add column if not exists part_no int;
alter table public.grammar_lessons add column if not exists part_title text;
alter table public.grammar_lessons add column if not exists chapter_no int;
alter table public.grammar_lessons add column if not exists subtopics text;
