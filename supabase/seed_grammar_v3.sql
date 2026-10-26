-- Caminante 语法教程 · 完整版（参照《Complete Spanish Step-by-Step》）
-- 先清空旧课与旧练习，再按教材 6 大部分 / 30 章重建。
-- 说明：本文件分多次补全；当前含第一部分（第 1–9 章）。

delete from public.grammar_exercises;
delete from public.grammar_lessons;

-- ============================================================
-- 第一部分 I · 句子的要素（第 1–9 章）
-- ============================================================
insert into public.grammar_lessons
  (title, level, order_index, part_no, part_title, chapter_no, subtopics, explanation_cn)
values

('名词、冠词与形容词', 'A1', 1, 1, 'I · 句子的要素', 1,
$$名词的性与数
定冠词与不定冠词
形容词的性数一致$$,
$$【名词的性】西语名词分阳性/阴性，要连同冠词一起记。
一般规律：以 -o 结尾多为阳性（el libro、el niño）；以 -a 结尾多为阴性（la casa、la niña）。
重要例外：以 -ción、-sión、-dad、-tad、-tud 结尾为阴性（la canción、la ciudad、la verdad）；以 -ma、-pa 结尾多为阳性（el problema、el mapa、el día）；以 -ista、-nte 结尾阴阳同形，靠冠词区分（el/la estudiante、el/la artista）。
少数例外：la mano、la foto 是阴性，el clima、el poema 是阳性。

【名词的数】复数规则：元音结尾加 -s（libro→libros）；辅音结尾加 -es（ciudad→ciudades）；以 -z 结尾改 z 为 c 再加 -es（lápiz→lápices）。

【冠词】定冠词 el/la/los/las（特指）；不定冠词 un/una/unos/unas（泛指）。

【形容词】要与名词性数一致：以 -o 结尾分性（bueno/buena），复数加 -s；以 -e 或辅音结尾通常无性变化（grande→grandes）。

例句：El libro es bueno.（这本书很好。）Las casas son grandes.（这些房子很大。）Quiero un café.（我想要一杯咖啡。）$$),

('Estar、Ser 与主语代词', 'A1', 2, 1, 'I · 句子的要素', 2,
$$主语人称代词
Estar（to be）
Ser（to be）$$,
$$【主语人称代词】yo（我）、tú（你）、él（他）、ella（她）、usted（您）、nosotros（我们）、vosotros（你们）、ellos（他们）、ellas（她们）、ustedes（你们/您们）。动词变位已体现人称，主语常省略。

【ser】表示本质、身份、来源、材料、时间等固有属性。变位：soy、eres、es、somos、sois、son。
用法：身份（Yo soy médico）、来源（Somos de China）、时间（Es la una）、描述（Es alto）。

【estar】表示位置、状态等暂时情况。变位：estoy、estás、está、estamos、estáis、están。
用法：位置（Está en casa）、状态（Estoy cansado）、进行时（Estoy estudiando）。

对比例：Soy aburrido.（我是个无趣的人。）Estoy aburrido.（我现在很无聊。）

例句：Hoy estoy contento.（今天我很高兴。）El libro está en la mesa.（书在桌上。）$$),

('Hay、疑问词、星期与月份', 'A1', 3, 1, 'I · 句子的要素', 3,
$$Hay（有）
疑问词
介词
星期、月份与季节$$,
$$【hay】表示「有、存在」，无单复数变化：Hay un libro.（有一本书。）Hay muchas personas.（有很多人。）否定：No hay agua.（没有水。）

【疑问词】疑问句前后都要加倒问号 ¿…?；疑问词一律带重音：
qué（什么）、cuál（哪一个）、quién（谁）、dónde（哪里）、cuándo（何时）、cómo（怎样）、cuánto（多少）、por qué（为什么）。

【星期与月份】星期：lunes、martes、miércoles、jueves、viernes、sábado、domingo（都不大写首字母）。
月份：enero、febrero、marzo、abril、mayo、junio、julio、agosto、septiembre、octubre、noviembre、diciembre。
季节：la primavera（春）、el verano（夏）、el otoño（秋）、el invierno（冬）。

例句：¿Qué es esto?（这是什么？）¿Dónde vives?（你住在哪里？）Hay dos parques en la ciudad.（城里有两个公园。）$$),

('数字、日期与时间', 'A1', 4, 1, 'I · 句子的要素', 4,
$$基数词
序数词
日期
时间$$,
$$【基数词】uno、dos、tres、cuatro、cinco、seis、siete、ocho、nueve、diez、once、doce、trece、catorce、quince、dieciséis、diecisiete、dieciocho、diecinueve、veinte、treinta、cuarenta、cincuenta、sesenta、setenta、ochenta、noventa、cien/ciento、mil。
注意：uno 在阳性单数名词前变 un（un libro）；ciento 在名词前变 cien（cien personas）。

【序数词】primero、segundo、tercero、cuarto、quinto、sexto…，置于名词前并与名词性数一致（el primer día、la segunda casa）。

【日期】¿Qué fecha es hoy?（今天几号？）Es el cinco de mayo.（今天是五月五日。）

【时间】¿Qué hora es?（几点了？）Es la una.（一点。）Son las dos.（两点。）Son las tres y media.（三点半。）

例句：Hoy es lunes.（今天是星期一。）Son las nueve de la mañana.（现在是早上九点。）$$),

('规则动词', 'A1', 5, 1, 'I · 句子的要素', 5,
$$-Ar 动词
-Er 动词
-Ir 动词$$,
$$规则动词在现在时去掉词尾 -ar/-er/-ir，再加人称词尾。
-ar：-o、-as、-a、-amos、-áis、-an。例：hablar→hablo、hablas、habla、hablamos、habláis、hablan。
-er：-o、-es、-e、-emos、-éis、-en。例：comer→como、comes、come、comemos、coméis、comen。
-ir：-o、-es、-e、-imos、-ís、-en。例：vivir→vivo、vives、vive、vivimos、vivís、viven。

现在时用法：表示习惯、正在进行、普遍事实、最近将来。
例句：Yo hablo español.（我说西班牙语。）Comemos a las dos.（我们两点吃饭。）Vivimos en Madrid.（我们住在马德里。）$$),

('不规则动词', 'A2', 6, 1, 'I · 句子的要素', 6,
$$-Ar 不规则
-Er 不规则
-Ir 不规则
句子构成$$,
$$常见不规则动词在现在时（多为第一人称特殊或词干变化）：
tener→tengo、tienes、tiene、tenemos、tenéis、tienen
venir→vengo、vienes、viene、venimos、venís、vienen
hacer→hago、haces、hace、hacemos、hacéis、hacen
salir→salgo、sales、sale、salimos、salís、salen
poner→pongo、pones、pone、ponemos、ponéis、ponen
traer→traigo、traes、trae、traemos、traéis、traen
dar→doy、das、da、damos、dais、dan
ir→voy、vas、va、vamos、vais、van
ver→veo、ves、ve、vemos、veis、ven
saber→sé、sabes、sabe、sabemos、sabéis、saben

例句：Tengo dos hermanos.（我有两个兄弟。）¿Qué haces hoy?（你今天做什么？）Voy al cine.（我去电影院。）$$),

('Ir 与将来时', 'A2', 7, 1, 'I · 句子的要素', 7,
$$Ir（去）
ir + a + 不定式表将来
习语
que 与 para$$,
$$【ir】变位：voy、vas、va、vamos、vais、van。后接地点用 a：Voy a la escuela.（我去学校。）

【将来时】口语最常用 ir a + 动词原形表示「即将做、打算做」：Voy a estudiar.（我要学习了。）Vamos a comer.（我们要去吃饭。）¿Qué vas a hacer?（你要做什么？）

【que】可作关系代词连接从句，或作连词「那/因为」。
【para】表示「为了（目的）、给、目的地、截止时间」。

例句：Voy a Madrid mañana.（我明天去马德里。）Estudio para el examen.（我为考试而学习。）El libro que leo es bueno.（我读的那本书很好。）$$),

('形容词与副词', 'A2', 8, 1, 'I · 句子的要素', 8,
$$物主形容词
指示形容词
比较级与最高级
副词$$,
$$【物主形容词】mi/mis（我的）、tu/tus（你的）、su/sus（他/她/您的）、nuestro/nuestra/nuestros/nuestras（我们的）、vuestro（你们的）。置于名词前，与名词性数一致（nuestro/vuestro 分性）。

【指示形容词】este/esta（这个）、ese/esa（那个）、aquel/aquella（远指那个），复数加 -s。

【比较级与最高级】más + 形容词 + que（更……）；menos…que（不如……）；tan…como（一样……）。最高级：el/la + más + 形容词。
不规则：bueno→mejor、malo→peor、grande→mayor、pequeño→menor。

【副词】多由形容词阴性 + -mente 构成：rápido→rápidamente。不规则副词：bien（好）、mal（坏）、mucho（多）、poco（少）、muy（很）、siempre（总是）、nunca（从不）。

例句：Este libro es mejor que aquel.（这本书比那本好。）Habla rápidamente.（他说话很快。）Mi casa es pequeña.（我的房子很小。）$$),

('否定与介词', 'A1', 9, 1, 'I · 句子的要素', 9,
$$否定
介词
por 与 para$$,
$$【否定】在动词前加 no：No hablo inglés.（我不说英语。）
其他否定词：nada（没有什么）、nadie（没有人）、nunca（从不）、tampoco（也不）、ni…ni（既不……也不）。

【介词】a（到/向）、de（的/从）、en（在……里）、con（和/带着）、sin（没有）、sobre（关于/在……上）、entre（在……之间）、hasta（直到）、desde（从……起）。

【por 与 para】por 表示「因为、通过、为了（交换）、时间段」；para 表示「为了（目的）、给、目的地、截止时间」。
对比：Trabajo por dinero.（我为钱而工作。——原因/交换）Este regalo es para ti.（这个礼物是给你的。——对象/目的）

例句：No me gusta el café.（我不喜欢咖啡。）Voy a la escuela en autobús.（我坐公交车去学校。）Estudio para aprender.（我为了学习而学习。）$$)

on conflict (title) do nothing;


-- ============================================================
-- 第一部分 I 配套练习（第 1–9 章）
-- ============================================================
insert into public.grammar_exercises (lesson_id, prompt, answer, order_index)
select l.id, v.prompt, v.answer, v.order_index
from (values

-- 1 名词、冠词与形容词
('名词、冠词与形容词', '填定冠词：___ libro（书）', 'el', 1),
('名词、冠词与形容词', '填定冠词：___ ciudad（城市）', 'la', 2),
('名词、冠词与形容词', '写出 casa（房子）的复数', 'casas', 3),
('名词、冠词与形容词', '写出 lápiz（铅笔）的复数', 'lápices', 4),
('名词、冠词与形容词', '填不定冠词：___ café（一杯咖啡）', 'un', 5),
('名词、冠词与形容词', '翻译：这些房子很大', 'Las casas son grandes.', 6),

-- 2 Estar、Ser 与主语代词
('Estar、Ser 与主语代词', '用 ser/estar 填空：Yo ___ cansado.（状态）', 'estoy', 1),
('Estar、Ser 与主语代词', '用 ser/estar 填空：Ella ___ doctora.（身份）', 'es', 2),
('Estar、Ser 与主语代词', '用 ser/estar 填空：El libro ___ en la mesa.（位置）', 'está', 3),
('Estar、Ser 与主语代词', '填代词：___ hablamos español（我们）', 'Nosotros', 4),
('Estar、Ser 与主语代词', '翻译：我是医生', 'Soy médico.', 5),

-- 3 Hay、疑问词、星期与月份
('Hay、疑问词、星期与月份', '填 hay：___ un libro en la mesa', 'Hay', 1),
('Hay、疑问词、星期与月份', '填疑问词：¿___ vives?（你住哪里）', 'Dónde', 2),
('Hay、疑问词、星期与月份', '翻译：城里有三个公园', 'Hay tres parques en la ciudad.', 3),
('Hay、疑问词、星期与月份', '「星期一」的西班牙语是____', 'lunes', 4),

-- 4 数字、日期与时间
('数字、日期与时间', '写出「五」的西班牙语', 'cinco', 1),
('数字、日期与时间', '写出「十五」的西班牙语', 'quince', 2),
('数字、日期与时间', '翻译：几点了？', '¿Qué hora es?', 3),
('数字、日期与时间', '翻译：现在是九点', 'Son las nueve.', 4),

-- 5 规则动词
('规则动词', 'hablar（说）的「我」形式', 'hablo', 1),
('规则动词', 'comer（吃）的「他们」形式', 'comen', 2),
('规则动词', 'vivir（住）的「我们」形式', 'vivimos', 3),
('规则动词', '翻译：我们说西班牙语', 'Hablamos español.', 4),

-- 6 不规则动词
('不规则动词', 'tener（有）的「我」形式', 'tengo', 1),
('不规则动词', 'ir（去）的「我们」形式', 'vamos', 2),
('不规则动词', 'hacer（做）的「他」形式', 'hace', 3),
('不规则动词', '翻译：我有两个兄弟', 'Tengo dos hermanos.', 4),

-- 7 Ir 与将来时
('Ir 与将来时', 'ir（去）的「我」形式', 'voy', 1),
('Ir 与将来时', '翻译：我要学习了', 'Voy a estudiar.', 2),
('Ir 与将来时', '翻译：我们要去吃饭', 'Vamos a comer.', 3),

-- 8 形容词与副词
('形容词与副词', '填物主：___ casa（我的房子）', 'Mi', 1),
('形容词与副词', 'bueno（好）的比较级是____', 'mejor', 2),
('形容词与副词', '翻译：这本书比那本好', 'Este libro es mejor que aquel.', 3),
('形容词与副词', '翻译：他说话很快', 'Habla rápidamente.', 4),

-- 9 否定与介词
('否定与介词', '翻译：我不说英语', 'No hablo inglés.', 1),
('否定与介词', '填 para/por：Este regalo es ___ ti', 'para', 2),
('否定与介词', '翻译：我不喜欢咖啡', 'No me gusta el café.', 3),
('否定与介词', '「从不」的西班牙语是____', 'nunca', 4)

) as v(title, prompt, answer, order_index)
join public.grammar_lessons l on l.title = v.title;


-- ============================================================
-- 第二部分 II · 宾语、反身动词与虚拟式现在时（第 10–13 章）
-- ============================================================
insert into public.grammar_lessons
  (title, level, order_index, part_no, part_title, chapter_no, subtopics, explanation_cn)
values

('间接宾语', 'A2', 10, 2, 'II · 宾语、反身动词与虚拟式现在时', 10,
$$Gustar 与间接宾语
间接宾语代词
代词位置$$,
$$【间接宾语代词】me（我）、te（你）、le（他/她/您）、nos（我们）、os（你们）、les（他们/您们），表示「给谁、对谁」做某事。

【gustar 类动词】这类动词用间接宾语，真正的主语是「令人喜欢的东西」，动词随该东西的单复数变化：
Me gusta el español.（我喜欢西语。——西语是主语，用单数 gusta）
Me gustan las flores.（我喜欢花。——花是复数，用 gustan）
其他同类动词：encantar（使着迷）、interesar（使感兴趣）、importar（对……重要）、doler（使疼）。

【代词位置】一般放在变位动词前：Le doy el libro.（我把书给他。）也可接在不定式后连写。

例句：Te gusta el café.（你喜欢咖啡。）Me duele la cabeza.（我头疼。）$$),

('直接宾语', 'A2', 11, 2, 'II · 宾语、反身动词与虚拟式现在时', 11,
$$人称 a 与直接宾语
直接宾语代词
代词位置$$,
$$【直接宾语代词】me（我）、te（你）、lo（他/它·阳）、la（她/它·阴）、nos（我们）、os（你们）、los（他们·阳）、las（她们·阴）。

【人称 a】直接宾语指人或拟人化的对象时，前面加 a（人称 a）：
Veo a María.（我看见玛丽亚。）Busco a mi hermano.（我找我弟弟。）

【代词位置】放在变位动词前，或接在不定式/命令式后连写（注意重音）：
Lo veo todos los días.（我每天看见他。）
Voy a comprarlo.（我要买它。）/ Lo voy a comprar.

例句：¿Me escuchas?（你在听我说话吗？）Las quiero mucho.（我很爱她们。）$$),

('反身动词', 'A2', 12, 2, 'II · 宾语、反身动词与虚拟式现在时', 12,
$$反身代词
常用反身动词
反身动词的多种含义
无人称 se$$,
$$【反身代词】me、te、se、nos、os、se，表示动作作用于自身。

【常用反身动词】llamarse（名叫）、levantarse（起床）、ducharse（淋浴）、vestirse（穿衣）、acostarse（睡觉）、despertarse（醒来）、sentarse（坐下）、irse（离开）。
反身动词常表示：日常动作、情感（alegrarse 高兴）、移动（moverse 移动）、「变得」（ponerse 变得）。

【代词位置】位于变位动词前：Me levanto a las siete.（我七点起床。）或接在不定式/命令式后连写。

【无人称 se】se + 第三人称单数动词，表示泛指「人们/有人」：Aquí se habla español.（这里讲西班牙语。）

例句：Me llamo Ana.（我叫安娜。）Nos acostamos tarde.（我们很晚睡觉。）$$),

('虚拟式现在时', 'B1', 13, 2, 'II · 宾语、反身动词与虚拟式现在时', 13,
$$虚拟式构成
用法
各类触发$$,
$$【虚拟式现在时构成】取第一人称单数现在时词干，再加「反向」词尾：
-ar→-e 系列：hablar→hable、hables、hable、hablemos、habléis、hablen。
-er/-ir→-a 系列：comer→coma；vivir→viva。
不规则（源于第一人称单数）：tener→tenga、venir→venga、hacer→haga、salir→salga、ir→vaya、ser→sea、estar→esté、saber→sepa。

【用法】表达愿望、请求、建议、怀疑、情感、评价等主观内容。

【常见触发】
愿望：querer que、esperar que、desear que。
建议/命令：recomendar que、pedir que、aconsejar que。
情感：alegrarse de que、temer que、gustar que。
怀疑/否定：dudar que、no creer que、no pensar que。
无人称判断：es importante que、es necesario que、es posible que。
连词：para que、antes de que、a menos que、sin que。

例句：Quiero que vengas a mi casa.（我希望你来我家。）Es importante que estudies español.（学西语很重要。）Dudo que sea verdad.（我怀疑这不是真的。）$$),

('简单过去时', 'A2', 14, 3, 'III · 简单过去时、未完成时与双宾语代词', 14,
$$构成
用法
不规则动词$$,
$$【简单过去时（pretérito indefinido）】表示过去发生并已结束的动作。
-ar 词尾：-é、-aste、-ó、-amos、-asteis、-aron。例：hablar→hablé、hablaste、habló、hablamos、hablasteis、hablaron。
-er/-ir 词尾：-í、-iste、-ió、-imos、-isteis、-ieron。例：comer→comí、comiste、comió、comimos、comisteis、comieron；vivir→viví。

【常用不规则】
ser/ir→fui、fuiste、fue、fuimos、fuisteis、fueron
estar→estuve、estuviste、estuvo、estuvimos、estuvisteis、estuvieron
tener→tuve；hacer→hice；decir→dije；dar→di；ver→vi；poder→pude；querer→quise；venir→vine；poner→puse。

【用法】过去某时刻完成的动作、一连串已完成的动作、过去某时刻已结束的状态。
例句：Ayer hablé con mi madre.（昨天我和妈妈通了电话。）El año pasado vivimos en China.（去年我们住在中国。）Fui al cine y cené.（我去了电影院然后吃了晚饭。）$$),

('过去未完成时', 'A2', 15, 3, 'III · 简单过去时、未完成时与双宾语代词', 15,
$$构成
用法
与简单过去时对比$$,
$$【过去未完成时（pretérito imperfecto）】表示过去持续、习惯性的动作或背景描写。
-ar 词尾：-aba、-abas、-aba、-ábamos、-abais、-aban。例：hablar→hablaba、hablabas、hablaba、hablábamos、hablabais、hablaban。
-er/-ir 词尾：-ía、-ías、-ía、-íamos、-íais、-ían。例：comer→comía；vivir→vivía。
不规则只有三个：ser→era、ir→iba、ver→veía。

【用法】过去习惯/反复动作、过去正在进行的动作、过去的背景描写、过去的时间/年龄/天气。

【与简单过去时对比】
indefinido：过去某时刻完成的「点状」动作（ayer、el año pasado、una vez）。
imperfecto：过去持续/习惯的「线状」背景（cuando era niño、siempre、todos los días）。
例句：Cuando era niño, jugaba al fútbol.（我小时候常踢足球。——习惯）Ayer fui al cine.（昨天我去了电影院。——完成）$$)

on conflict (title) do nothing;


-- ============================================================
-- 第二、三部分 配套练习（第 10–15 章）
-- ============================================================
insert into public.grammar_exercises (lesson_id, prompt, answer, order_index)
select l.id, v.prompt, v.answer, v.order_index
from (values

-- 10 间接宾语
('间接宾语', '填间接宾语代词：___ gusta el español（我喜欢西语）', 'Me', 1),
('间接宾语', '翻译：我喜欢花', 'Me gustan las flores.', 2),
('间接宾语', '翻译：我把书给他', 'Le doy el libro.', 3),
('间接宾语', '翻译：我头疼', 'Me duele la cabeza.', 4),

-- 11 直接宾语
('直接宾语', '填直接宾语代词：___ veo todos los días（我每天看见他）', 'Lo', 1),
('直接宾语', '翻译：我在听你说话', 'Te escucho.', 2),
('直接宾语', '翻译：我要买它', 'Voy a comprarlo.', 3),

-- 12 反身动词
('反身动词', 'llamarse 的「我」形式（我叫……）', 'Me llamo', 1),
('反身动词', 'levantarse 的「我」形式（我起床）', 'Me levanto', 2),
('反身动词', '翻译：这里讲西班牙语', 'Aquí se habla español.', 3),
('反身动词', '翻译：我们很晚睡觉', 'Nos acostamos tarde.', 4),

-- 13 虚拟式现在时
('虚拟式现在时', 'hablar 的虚拟式「他」形式', 'hable', 1),
('虚拟式现在时', 'comer 的虚拟式「他」形式', 'coma', 2),
('虚拟式现在时', '翻译：我希望你来我家', 'Quiero que vengas a mi casa.', 3),
('虚拟式现在时', '翻译：学西语很重要', 'Es importante que estudies español.', 4),

-- 14 简单过去时
('简单过去时', 'hablar 的简单过去「我」形式', 'hablé', 1),
('简单过去时', 'comer 的简单过去「我」形式', 'comí', 2),
('简单过去时', 'ser/ir 的简单过去「我」形式', 'fui', 3),
('简单过去时', '翻译：昨天我和妈妈通了电话', 'Ayer hablé con mi madre.', 4),

-- 15 过去未完成时
('过去未完成时', 'hablar 的未完成时「我」形式', 'hablaba', 1),
('过去未完成时', 'ser 的未完成时「我」形式', 'era', 2),
('过去未完成时', '翻译：我小时候常踢足球', 'Cuando era niño, jugaba al fútbol.', 3)

) as v(title, prompt, answer, order_index)
join public.grammar_lessons l on l.title = v.title;


-- ============================================================
-- 第四部分 IV · Ser/Estar、各时态、进行时、虚拟式与命令式（第 16–21 章）
-- ============================================================
insert into public.grammar_lessons
  (title, level, order_index, part_no, part_title, chapter_no, subtopics, explanation_cn)
values

('Ser 与 Estar 及现在时', 'A2', 16, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 16,
$$Estar（to be）
Ser（to be）$$,
$$ser 与 estar 都表示「是/在」，但用法不同。
【ser】本质、身份、来源、材料、所属、时间、事件发生地等固有属性：Soy estudiante.（我是学生。）Somos de China.（我们来自中国。）El reloj es de oro.（表是金的。）La fiesta es en casa.（聚会在我家。）
【estar】位置、状态、进行时等暂时情况：Estoy en casa.（我在家。）Está cansado.（他累了。）Estoy estudiando.（我正在学习。）

【形容词含义随 ser/estar 变化】ser listo（聪明）/ estar listo（准备好了）；ser aburrido（无趣的人）/ estar aburrido（无聊）；ser verde（绿色）/ estar verde（未成熟）。
例句：Soy médico.（我是医生。）Hoy estoy cansado.（今天我很累。）$$),

('Ser 与 Estar 的过去时', 'B1', 17, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 17,
$$简单过去时
未完成时
对比$$,
$$【ser 的过去】
简单过去：fui、fuiste、fue、fuimos、fuisteis、fueron。
未完成：era、eras、era、éramos、erais、eran。

【estar 的过去】
简单过去：estuve、estuviste、estuvo、estuvimos、estuvisteis、estuvieron。
未完成：estaba、estabas、estaba、estábamos、estabais、estaban。

【选择】简单过去表示「当时那一刻（已完成、有明确时间点）」；未完成表示「过去持续的状态/背景/描述」。
例句：Fue un día maravilloso.（那是美好的一天。——当时那次）Estaba muy contento.（我当时很高兴。——持续状态）
Era una persona amable.（他以前是个和善的人。）Estuvo enfermo la semana pasada.（他上周生病了。）$$),

('现在进行时', 'B1', 18, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 18,
$$副动词构成
现在进行时构成
用法
代词位置$$,
$$【副动词（gerundio）构成】
-ar→-ando：hablar→hablando；estudiar→estudiando。
-er/-ir→-iendo：comer→comiendo；vivir→viviendo。
不规则/拼写变化：leer→leyendo、oír→oyendo、ir→yendo、decir→diciendo、dormir→durmiendo、pedir→pidiendo。

【现在进行时】= estar（现在时）+ 副动词，表示正在进行的动作：
Estoy estudiando.（我正在学习。）Estamos comiendo.（我们正在吃饭。）

【代词位置】可放在 estar 前，或接在副动词后连写（加写重音）：
Lo estoy leyendo. = Estoy leyéndolo.（我正在读它。）

例句：¿Qué estás haciendo?（你在做什么？）Está lloviendo.（正在下雨。）$$),

('过去进行时', 'B1', 19, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 19,
$$未完成进行时
简单过去进行时$$,
$$【过去进行时】= estar（过去时）+ 副动词。
【未完成进行时】estar 用 imperfecto，表示过去正在持续进行的动作或背景：
Estaba estudiando cuando llamaste.（你打电话来时我正在学习。）
Estábamos cenando.（我们当时正在吃晚饭。）

【简单过去进行时】estar 用 indefinido，强调某一段过去时间内的进行：
Estuve trabajando toda la noche.（我整晚都在工作。）

例句：Cuando entré, estaban hablando.（我进去时他们正在说话。）$$),

('虚拟式现在时·进阶', 'B1', 20, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 20,
$$构成回顾
用法扩展
触发时态$$,
$$虚拟式现在时大量出现在各类从句中。构成见第 13 章（-ar→-e，-er/-ir→-a）。

【常见触发】
愿望：querer que、esperar que、desear que。
建议/命令：recomendar que、pedir que、aconsejar que。
情感：alegrarse de que、temer que、sentir que、gustar que。
怀疑/否定：dudar que、no creer que、no pensar que、no estar seguro de que。
无人称判断：es importante/necesario/posible/bueno/malo que。
连词：para que、antes de que、a menos que、sin que、en caso de que。
其他：ojalá、quizás、tal vez、aunque（表「即使/让步」）。

【直陈 vs 虚拟对比】肯定事实→直陈；否定/怀疑/情感/期望→虚拟：
Creo que viene.（我相信他会来。）No creo que venga.（我不认为他会来。）
例句：Espero que tengas suerte.（我祝你好运。）Quizás llueva mañana.（明天也许会下雨。）$$),

('命令式', 'A2', 21, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 21,
$$肯定 tú 命令
否定 tú 命令
Ud./Uds. 命令
nosotros 命令$$,
$$【肯定 tú 命令】通常用第三人称单数现在时形式：habla（说）、come（吃）、escribe（写）。
不规则：haz（hacer）、ve（ir）、pon（poner）、ten（tener）、di（decir）、sal（salir）、sé（ser）、ven（venir）。

【否定 tú 命令】用 no + 虚拟式现在时第二人称：no hables、no comas、no escribas。

【Ud./Uds. 命令】用虚拟式第三人称：hable/hablen、coma/coman。

【nosotros 命令（「让我们…」）】用虚拟式第一人称复数：hablemos、comamos、escribamos。

例句：Habla más despacio, por favor.（请说慢一点。）No comas tanto.（别吃这么多。）Hablemos español.（我们说西语吧。）$$)

on conflict (title) do nothing;


-- ============================================================
-- 第四部分 配套练习（第 16–21 章）
-- ============================================================
insert into public.grammar_exercises (lesson_id, prompt, answer, order_index)
select l.id, v.prompt, v.answer, v.order_index
from (values

-- 16 Ser 与 Estar 及现在时
('Ser 与 Estar 及现在时', '用 ser/estar：Yo ___ aburrido（我现在很无聊）', 'estoy', 1),
('Ser 与 Estar 及现在时', '用 ser/estar：Yo ___ aburrido（我是个无趣的人）', 'soy', 2),
('Ser 与 Estar 及现在时', '翻译：表是金的', 'El reloj es de oro.', 3),
('Ser 与 Estar 及现在时', '翻译：他准备好了', 'Está listo.', 4),

-- 17 Ser 与 Estar 的过去时
('Ser 与 Estar 的过去时', 'ser 的未完成时「我」形式', 'era', 1),
('Ser 与 Estar 的过去时', 'estar 的简单过去「我」形式', 'estuve', 2),
('Ser 与 Estar 的过去时', '翻译：我当时很高兴', 'Estaba muy contento.', 3),

-- 18 现在进行时
('现在进行时', 'hablar 的副动词', 'hablando', 1),
('现在进行时', 'comer 的副动词', 'comiendo', 2),
('现在进行时', '翻译：我正在学习', 'Estoy estudiando.', 3),
('现在进行时', '翻译：正在下雨', 'Está lloviendo.', 4),

-- 19 过去进行时
('过去进行时', '翻译：你打电话来时我正在学习', 'Estaba estudiando cuando llamaste.', 1),
('过去进行时', '翻译：我们当时正在吃晚饭', 'Estábamos cenando.', 2),

-- 20 虚拟式现在时·进阶
('虚拟式现在时·进阶', '翻译：我不认为他会来', 'No creo que venga.', 1),
('虚拟式现在时·进阶', '翻译：我祝你好运', 'Espero que tengas suerte.', 2),
('虚拟式现在时·进阶', '翻译：明天也许会下雨', 'Quizás llueva mañana.', 3),

-- 21 命令式
('命令式', 'hablar 的肯定 tú 命令', 'habla', 1),
('命令式', 'comer 的否定 tú 命令', 'no comas', 2),
('命令式', 'hacer 的肯定 tú 命令（不规则）', 'haz', 3),
('命令式', '翻译：请说慢一点', 'Habla más despacio, por favor.', 4)

) as v(title, prompt, answer, order_index)
join public.grammar_lessons l on l.title = v.title;


-- ============================================================
-- 第五部分 V · 名词、冠词、形容词、代词与完成时（第 22–24 章）
-- ============================================================
insert into public.grammar_lessons
  (title, level, order_index, part_no, part_title, chapter_no, subtopics, explanation_cn)
values

('名词、冠词、形容词与代词', 'B1', 22, 5, 'V · 名词、冠词、形容词、代词与完成时', 22,
$$物主代词
关系代词
指示代词
形容词作名词$$,
$$【物主代词】代替「物主形容词 + 名词」，要与所指名词性数一致：
mío/mía/míos/mías（我的）、tuyo（你的）、suyo（他的）、nuestro（我们的）、vuestro（你们的）。
Este libro es mío.（这本书是我的。）La casa es nuestra.（房子是我们的。）

【关系代词】que（最通用，指人指物）、quien/quienes（仅指人，介词后）、cuyo（其……的）、donde（在……地方）、el que/la que（带冠词的，可避免歧义）。
【指示代词】éste/ésta/esto（这个）、ése/ésa/eso（那个）、aquél/aquélla/aquello（远指那个）。
【形容词作名词】el rojo（红色的那个）、los jóvenes（年轻人）、lo + 形容词（抽象：lo bueno 好事、lo importante 重要的事）。

例句：La ciudad donde vivo es grande.（我住的城市很大。）Lo importante es estudiar.（重要的是学习。）$$),

('现在完成时', 'B1', 23, 5, 'V · 名词、冠词、形容词、代词与完成时', 23,
$$过去分词构成
现在完成时构成
用法
代词位置$$,
$$【现在完成时（pretérito perfecto）】= haber（现在时）+ 过去分词。
haber：he、has、ha、hemos、habéis、han。
过去分词：-ar→-ado（hablado）；-er/-ir→-ido（comido、vivido）。
不规则过去分词：hecho（hacer）、dicho（decir）、visto（ver）、escrito（escribir）、vuelto（volver）、abierto（abrir）、puesto（poner）、roto（romper）、muerto（morir）。

【用法】表示与现在有联系、或到目前仍有效的过去动作；常搭配 hoy、ya、todavía no、este año。
【代词位置】放在 haber 前：Lo he visto.（我见过他。）

例句：He comido mucho hoy.（我今天吃了很多。）¿Has estado en España?（你去过西班牙吗？）Todavía no he terminado.（我还没完成。）$$),

('过去完成时', 'B2', 24, 5, 'V · 名词、冠词、形容词、代词与完成时', 24,
$$构成
用法
过去分词作形容词
被动语态$$,
$$【过去完成时（pluscuamperfecto）】= haber（过去未完成时）+ 过去分词。
haber 的未完成时：había、habías、había、habíamos、habíais、habían。

【用法】表示「过去的过去」，即某一过去动作之前已完成的事：
Cuando llegué, ya había salido.（我到的时候，他已经走了。）

【过去分词作形容词】要与名词性数一致：una puerta abierta（一扇开着的门）、las ventanas cerradas（关着的窗户）。

【被动语态】ser + 过去分词 + por（施动者），过去分词与主语性数一致：
El edificio fue construido en 1990.（这栋楼建于 1990 年。）Las cartas fueron escritas por Ana.（这些信是安娜写的。）$$)

on conflict (title) do nothing;


-- ============================================================
-- 第六部分 VI · 将来时与条件式、过去虚拟式、习语（第 25–30 章）
-- ============================================================
insert into public.grammar_lessons
  (title, level, order_index, part_no, part_title, chapter_no, subtopics, explanation_cn)
values

('将来时', 'B1', 25, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 25,
$$构成
用法
将来进行时
将来完成时$$,
$$【将来时（futuro simple）】在动词原形后加词尾（三类动词相同）：-é、-ás、-á、-emos、-éis、-án。
例：hablar→hablaré、hablarás、hablará、hablaremos、hablaréis、hablarán。

【不规则词干】tener→tendr-、venir→vendr-、hacer→har-、poder→podr-、querer→querr-、saber→sabr-、salir→saldr-、decir→dir-、poner→pondr-。

【用法】表示将来动作、推测（「大概」）、承诺。
【将来进行时】estaré + 副动词；【将来完成时】habré + 过去分词。

例句：Mañana viajaré a Madrid.（明天我要去马德里。）¿Qué harás este fin de semana?（这个周末你要做什么？）Serán las ocho.（现在大概八点了。）$$),

('条件式', 'B1', 26, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 26,
$$构成
用法
条件进行时
条件完成时$$,
$$【条件式（condicional）】词尾（加在动词原形后）：-ía、-ías、-ía、-íamos、-íais、-ían（三类动词相同，词干同将来时）。
例：hablar→hablaría、hablarías、hablaría、hablaríamos、hablaríais、hablarían。
不规则词干同将来时：tener→tendría、hacer→haría、poder→podría、querer→querría。

【用法】委婉请求/意愿、过去将来、与现在相反的假设。
【条件进行时】estaría + 副动词；【条件完成时】habría + 过去分词。

例句：Me gustaría un café, por favor.（我想要一杯咖啡。）¿Podrías ayudarme?（你能帮我吗？）Dijo que vendría.（他说他会来。）$$),

('现在完成虚拟式', 'B2', 27, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 27,
$$构成
用法$$,
$$【现在完成虚拟式（pretérito perfecto de subjuntivo）】= haber（虚拟式现在时）+ 过去分词。
haber 的虚拟式现在时：haya、hayas、haya、hayamos、hayáis、hayan。

【用法】用于主观、不确定、情感的过去动作（相对现在而言已完成）：
Dudo que haya venido.（我怀疑他来过。）Espero que hayas descansado.（我希望你已经休息好了。）Es posible que haya llovido.（可能下过雨了。）$$),

('虚拟式过去时', 'B2', 28, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 28,
$$构成
用法$$,
$$【虚拟式过去时（imperfecto de subjuntivo）】由第三人称复数简单过去时去掉 -ron，再加 -ra/-se 系列词尾：
hablar→hablaron→hablara/hablase、hablaras、hablara、habláramos、hablarais、hablaran。
comer→comieron→comiera/comiese；vivir→vivieron→viviera/viviese。
不规则（源于简单过去时第三人称复数）：ser/ir→fueran、estar→estuvieran、tener→tuvieran、hacer→hicieran。

【用法】与虚拟式现在时一致，只是主句为过去时（时态后退）：
Quería que vinieras.（我当时希望你来。）Era importante que estudiara.（当时学西语很重要。）
也用于与现在相反的假设（si + 虚拟式过去 → 条件式）：Si tuviera dinero, viajaría.（要是我有钱，就会去旅行。）$$),

('过去完成虚拟式', 'B2', 29, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 29,
$$构成
用法$$,
$$【过去完成虚拟式（pluscuamperfecto de subjuntivo）】= haber（虚拟式过去时）+ 过去分词。
haber 的虚拟式过去时：hubiera/hubiese、hubieras、hubiera、hubiéramos、hubierais、hubieran。

【用法】与过去相反的假设、过去的虚拟情况。

【复合条件句三型】
真实（现在/将来）：Si estudias, aprobarás.（如果学习，就会通过。）
与现在相反：Si tuviera dinero, viajaría.（要是我有钱，就会去旅行。）
与过去相反：Si hubiera tenido dinero, habría viajado.（要是我当时有钱，就会去旅行了。）

例句：Si hubiera sabido, habría venido.（要是我早知道，就会来了。）$$),

('惯用表达', 'C1', 30, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 30,
$$介词习语
动词习语
时间表达$$,
$$【常用习语】
estar en las nubes（心不在焉）、costar un ojo de la cara（贵得要命）、tener ganas de（想要做）、echar de menos（想念）、irse de vacaciones（去度假）、llevarse bien/mal con（与……相处好坏）、ponerse de acuerdo（达成一致）、darse cuenta de（意识到）、tener que ver con（与……有关）、de vez en cuando（偶尔）。

【时间表达】
hace + 时间（……之前）：Hace dos años（两年前）。
desde hace + 时间（自从……以来）：Estudio español desde hace dos años.（我学西语两年了。）
llevar + 时间（已经……多久了）：Llevo dos años estudiando español.（我学西语已经两年了。）

例句：Tengo ganas de aprender español.（我想学西语。）Echo de menos a mi familia.（我想念家人。）Hace dos años que vivo aquí.（我住在这里两年了。）$$)

on conflict (title) do nothing;


-- ============================================================
-- 第五、六部分 配套练习（第 22–30 章）
-- ============================================================
insert into public.grammar_exercises (lesson_id, prompt, answer, order_index)
select l.id, v.prompt, v.answer, v.order_index
from (values

-- 22 名词、冠词、形容词与代词
('名词、冠词、形容词与代词', '翻译：这本书是我的', 'Este libro es mío.', 1),
('名词、冠词、形容词与代词', '翻译：我住的城市很大', 'La ciudad donde vivo es grande.', 2),
('名词、冠词、形容词与代词', '翻译：重要的是学习', 'Lo importante es estudiar.', 3),

-- 23 现在完成时
('现在完成时', 'hablar 的过去分词', 'hablado', 1),
('现在完成时', 'comer 的过去分词', 'comido', 2),
('现在完成时', '翻译：你今天去过西班牙吗？', '¿Has estado en España hoy?', 3),
('现在完成时', '翻译：我还没完成', 'Todavía no he terminado.', 4),

-- 24 过去完成时
('过去完成时', '翻译：我到的时候他已经走了', 'Cuando llegué, ya había salido.', 1),
('过去完成时', '翻译：这栋楼建于 1990 年', 'El edificio fue construido en 1990.', 2),

-- 25 将来时
('将来时', 'hablar 的将来时「我」形式', 'hablaré', 1),
('将来时', 'tener 的将来时「我」形式（不规则词干）', 'tendré', 2),
('将来时', '翻译：明天我要去马德里', 'Mañana viajaré a Madrid.', 3),

-- 26 条件式
('条件式', 'hablar 的条件式「我」形式', 'hablaría', 1),
('条件式', 'poder 的条件式「你」形式', 'podrías', 2),
('条件式', '翻译：我想要一杯咖啡', 'Me gustaría un café, por favor.', 3),

-- 27 现在完成虚拟式
('现在完成虚拟式', 'haber 的虚拟式现在时「我」形式', 'haya', 1),
('现在完成虚拟式', '翻译：我怀疑他来过', 'Dudo que haya venido.', 2),

-- 28 虚拟式过去时
('虚拟式过去时', 'hablar 的虚拟式过去时「我」形式', 'hablara', 1),
('虚拟式过去时', '翻译：我当时希望你来', 'Quería que vinieras.', 2),
('虚拟式过去时', '翻译：要是我有钱，就会去旅行', 'Si tuviera dinero, viajaría.', 3),

-- 29 过去完成虚拟式
('过去完成虚拟式', 'haber 的虚拟式过去时「我」形式', 'hubiera', 1),
('过去完成虚拟式', '翻译：要是我早知道，就会来了', 'Si hubiera sabido, habría venido.', 2),

-- 30 惯用表达
('惯用表达', '翻译：我想学西语', 'Tengo ganas de aprender español.', 1),
('惯用表达', '翻译：我想念家人', 'Echo de menos a mi familia.', 2),
('惯用表达', '翻译：我学西语已经两年了', 'Llevo dos años estudiando español.', 3)

) as v(title, prompt, answer, order_index)
join public.grammar_lessons l on l.title = v.title;
