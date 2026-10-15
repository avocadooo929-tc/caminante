-- Camina 语法练习（A1–A2 填空/翻译题，含答案）

-- 兼容旧库：补上 answer 列（新库本列已存在，会自动跳过）
alter table public.grammar_exercises add column if not exists answer text;

-- 幂等：清空旧的种子练习后重新导入（注意：会连带清空练习作答记录）
delete from public.grammar_exercises;

insert into public.grammar_exercises (lesson_id, prompt, answer, order_index)
select l.id, v.prompt, v.answer, v.order_index
from (values
-- 字母与发音
('字母与发音', '西班牙语中，字母 h 的发音是____（填“发音”或“不发音”）', '不发音', 1),
('字母与发音', '字母 ñ 在 niño 中的发音近似汉语拼音的____', 'ni（尼）', 2),
-- 名词的性与数
('名词的性与数', '写出 libro（书）的复数形式', 'libros', 1),
('名词的性与数', '写出 ciudad（城市）的复数形式', 'ciudades', 2),
('名词的性与数', '写出 lápiz（铅笔）的复数形式', 'lápices', 3),
('名词的性与数', 'mano（手）是____性名词（填“阳”或“阴”）', '阴', 4),
-- 定冠词与不定冠词
('定冠词与不定冠词', '填冠词：___ perro（这只狗，定冠词）', 'el', 1),
('定冠词与不定冠词', '填冠词：___ casa（这所房子，定冠词）', 'la', 2),
('定冠词与不定冠词', '填冠词：___ café（一杯咖啡，不定冠词）', 'un', 3),
-- 主语人称代词
('主语人称代词', '填代词：___ soy estudiante（我）', 'Yo', 1),
('主语人称代词', '填代词：___ hablamos español（我们）', 'Nosotros', 2),
('主语人称代词', '“她”的西班牙语主语代词是____', 'ella', 3),
-- 现在时 -ar 动词变位
('现在时 -ar 动词变位', 'hablar（说）的“我”形式是____', 'hablo', 1),
('现在时 -ar 动词变位', 'hablar（说）的“他们”形式是____', 'hablan', 2),
('现在时 -ar 动词变位', 'estudiar（学习）的“我们”形式是____', 'estudiamos', 3),
-- 现在时 -er/-ir 动词变位
('现在时 -er/-ir 动词变位', 'comer（吃）的“我”形式是____', 'como', 1),
('现在时 -er/-ir 动词变位', 'comer（吃）的“他”形式是____', 'come', 2),
('现在时 -er/-ir 动词变位', 'vivir（住）的“我们”形式是____', 'vivimos', 3),
-- ser 与 estar
('ser 与 estar', '用 ser/estar 填空：Yo ___ médico.（身份）', 'soy', 1),
('ser 与 estar', '用 ser/estar 填空：Hoy ___ cansado.（状态）', 'estoy', 2),
('ser 与 estar', '用 ser/estar 填空：El libro ___ en la mesa.（位置）', 'está', 3),
-- 形容词的性数一致
('形容词的性数一致', '将 nuevo 变为阴性单数：casa ____', 'nueva', 1),
('形容词的性数一致', '将 grande 变为复数：calles ____', 'grandes', 2),
('形容词的性数一致', '“好的”的阴性单数形式是____', 'buena', 3),
-- 疑问句与疑问词
('疑问句与疑问词', '填疑问词：¿___ es esto?（什么）', 'Qué', 1),
('疑问句与疑问词', '填疑问词：¿___ vives?（哪里）', 'Dónde', 2),
('疑问句与疑问词', '填疑问词：¿___ años tienes?（多少）', 'Cuántos', 3),
-- 简单否定
('简单否定', '把句子变否定：Hablo inglés. → No ____ inglés.', 'hablo', 1),
('简单否定', '“我不喜欢咖啡”：No me ____ el café.', 'gusta', 2),
-- 常用不规则动词
('常用不规则动词', 'tener（有）的“我”形式是____', 'tengo', 1),
('常用不规则动词', 'hacer（做）的“我”形式是____', 'hago', 2),
('常用不规则动词', 'venir（来）的“你”形式是____', 'vienes', 3),
-- 直接宾语代词
('直接宾语代词', '用代词替代：Veo el libro. → Lo ____.', 'veo', 1),
('直接宾语代词', '“我每天看见他”：____ veo todos los días.', 'Lo', 2),
-- 间接宾语代词
('间接宾语代词', '“我把书给他”：Le ____ el libro.', 'doy', 1),
('间接宾语代词', '“西班牙语让我喜欢”：Me ____ el español.', 'gusta', 2),
-- 简单过去时（规则）
('简单过去时（规则）', 'hablar（说）的简单过去时“我”形式是____', 'hablé', 1),
('简单过去时（规则）', 'comer（吃）的简单过去时“我”形式是____', 'comí', 2),
('简单过去时（规则）', '“昨天我和妈妈说话”：Ayer ____ con mi madre.', 'hablé', 3),
-- 过去未完成时
('过去未完成时', 'hablar（说）的未完成时“我”形式是____', 'hablaba', 1),
('过去未完成时', 'comer（吃）的未完成时“我”形式是____', 'comía', 2),
('过去未完成时', '“我小时候踢足球”：Cuando era niño, ____ al fútbol.', 'jugaba', 3),
-- 命令式
('命令式', 'hablar 的肯定命令式（tú）是____', 'habla', 1),
('命令式', 'comer 的否定命令式（tú）是：no ____', 'comas', 2),
-- 比较级与最高级
('比较级与最高级', '“更好”的西班牙语是____', 'mejor', 1),
('比较级与最高级', '“更贵”的表达：más ____', 'caro', 2),
-- 物主形容词
('物主形容词', '“我的房子”：____ casa', 'Mi', 1),
('物主形容词', '“我们的朋友”：____ amigos', 'Nuestros', 2),
-- 时间与频率表达
('时间与频率表达', '“总是”的西班牙语是____', 'siempre', 1),
('时间与频率表达', '“从不”的西班牙语是____', 'nunca', 2),
-- 反身动词
('反身动词', '“我叫安娜”：Me ____ Ana.', 'llamo', 1),
('反身动词', '“我七点起床”：Me ____ a las siete.', 'levanto', 2)
) as v(lesson_title, prompt, answer, order_index)
join public.grammar_lessons l on l.title = v.lesson_title;
