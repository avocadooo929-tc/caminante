-- Caminante 语法教程 · 重构版（按《Complete Spanish Step-by-Step》6 大部分 / 30 章）
-- 先清空旧课与旧练习，再按教材框架重建（练习留待后续版本重新配题）
-- 可重复运行。

delete from public.grammar_exercises;
delete from public.grammar_lessons;

insert into public.grammar_lessons
  (title, level, order_index, part_no, part_title, chapter_no, subtopics, explanation_cn)
values

-- ============ I · 句子的要素 ============
('名词、冠词与形容词', 'A1', 1, 1, 'I · 句子的要素', 1,
$$名词的性与数
定冠词与不定冠词
形容词的性数一致$$,
$$西班牙语名词有「性」（阳性/阴性）和「数」（单数/复数）。
一般以 -o 结尾为阳性（libro 书），以 -a 结尾为阴性（casa 房子）；复数规则：元音结尾加 -s，辅音结尾加 -es，以 z 结尾改 z 为 c 再加 -es（lápiz→lápices）。注意例外：mano（手）是阴性，mapa、día 是阳性。
定冠词：el/la/los/las（特指）；不定冠词：un/una/unos/unas（泛指）。
形容词要与名词保持性数一致：bueno→buena→buenos→buenas；以 -e 或辅音结尾的通常无性变化（grande→grandes）。
例句：El libro es bueno.（这本书很好。）Las casas son grandes.（这些房子很大。）$$),

('Estar、Ser 与主语代词', 'A1', 2, 1, 'I · 句子的要素', 2,
$$主语人称代词
Estar（to be）
Ser（to be）$$,
$$主语人称代词：yo、tú、él、ella、usted、nosotros、vosotros、ellos、ellas、ustedes。动词变位已体现人称，主语常可省略。
ser 表示本质、身份、来源、时间等固有属性；estar 表示状态、位置等暂时情况。
ser 变位：soy、eres、es、somos、sois、son；estar 变位：estoy、estás、está、estamos、estáis、están。
例句：Yo soy médico.（我是医生。）Hoy estoy cansado.（今天我很累。）$$),

('Hay、疑问词、星期与月份', 'A1', 3, 1, 'I · 句子的要素', 3,
$$Hay（有）
疑问词
介词
星期、月份与季节$$,
$$hay 表示「有、存在」，无复数变化：Hay un libro.（有一本书。）Hay muchas personas.（有很多人。）
疑问句前后都要加倒问号 ¿…?；疑问词一律带重音：qué（什么）、cuál（哪一个）、quién（谁）、dónde（哪里）、cuándo（何时）、cómo（怎样）、cuánto（多少）、por qué（为什么）。
星期（lunes、martes…）、月份（enero、febrero…）、季节（primavera、verano、otoño、invierno）都不大写首字母。
例句：¿Qué es esto?（这是什么？）Hay dos parques en la ciudad.（城里有两个公园。）$$),

('数字、日期与时间', 'A1', 4, 1, 'I · 句子的要素', 4,
$$基数词
序数词
日期
时间$$,
$$基数词：uno、dos、tres、cuatro、cinco、seis、siete、ocho、nueve、diez、once、doce、trece、catorce、quince、dieciséis、veinte、treinta、cien/ciento、mil。
序数词：primero、segundo、tercero、cuarto、quinto、sexto…（置于名词前，与名词性数一致）。
日期：¿Qué fecha es hoy?（今天几号？）Es el cinco de mayo.（今天是五月五日。）
时间：¿Qué hora es?（几点了？）Es la una.（一点。）Son las dos y media.（两点半。）$$),

('规则动词', 'A1', 5, 1, 'I · 句子的要素', 5,
$$-Ar 动词
-Er 动词
-Ir 动词$$,
$$规则动词在现在时去掉词尾再加人称词尾。
-ar：-o、-as、-a、-amos、-áis、-an。例：hablar→hablo、hablas、habla、hablamos、habláis、hablan。
-er：-o、-es、-e、-emos、-éis、-en。例：comer→como、comes、come、comemos、coméis、comen。
-ir：-o、-es、-e、-imos、-ís、-en。例：vivir→vivo、vives、vive、vivimos、vivís、viven。
例句：Yo hablo español.（我说西班牙语。）Vivimos en Madrid.（我们住在马德里。）$$),

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
ir→voy、vas、va、vamos、vais、van；ver→veo、ves、ve、vemos、veis、ven。
例句：Tengo dos hermanos.（我有两个兄弟。）¿Qué haces hoy?（你今天做什么？）$$),

('Ir 与将来时', 'A2', 7, 1, 'I · 句子的要素', 7,
$$Ir（去）
ir + a + 不定式表将来
习语
que 与 para$$,
$$ir（去）变位：voy、vas、va、vamos、vais、van。
用 ir a + 动词原形表示「即将做、打算做」（口语将来）：Voy a estudiar.（我要学习了。）Vamos a comer.（我们要去吃饭。）
常用习语：ir a + 地点（去某地）；ir de compras（去购物）。
que 可作关系代词（连接从句）或连词（「那/因为」）；para 作介词表示「为了、给、目的地」。
例句：Voy a Madrid mañana.（我明天去马德里。）Estudio para el examen.（我为考试而学习。）$$),

('形容词与副词', 'A2', 8, 1, 'I · 句子的要素', 8,
$$物主形容词
指示形容词
比较级与最高级
副词$$,
$$物主形容词：mi/mis、tu/tus、su/sus、nuestro/nuestra/nuestros/nuestras、vuestro。置于名词前，与名词性数一致（nuestro/vuestro 分性）。
比较级：más + 形容词 + que（更……）；menos…que（不如……）；tan…como（一样……）。最高级：el/la + más + 形容词。不规则：bueno→mejor、malo→peor、grande→mayor、pequeño→menor。
副词多由形容词阴性 + -mente 构成：rápido→rápidamente；也有不规则副词：bien、mal、mucho、poco、muy、siempre、nunca。
例句：Este libro es mejor que aquel.（这本书比那本好。）Habla rápidamente.（他说话很快。）$$),

('否定与介词', 'A1', 9, 1, 'I · 句子的要素', 9,
$$否定
介词
por 与 para$$,
$$否定：在动词前加 no 即可构成否定句；其他否定词：nada（没有什么）、nadie（没有人）、nunca（从不）、tampoco（也不）。
常用介词：a、de、en、con、sin、por、para、sobre、entre、hasta、desde。
por 表示「因为、通过、为了（交换）、时间段」；para 表示「为了（目的）、给、目的地、截止时间」。
例句：No hablo inglés.（我不说英语。）Voy a la escuela en autobús.（我坐公交车去学校。）Este regalo es para ti.（这个礼物是给你的。）$$),

-- ============ II · 宾语、反身动词与虚拟式现在时 ============
('间接宾语', 'A2', 10, 2, 'II · 宾语、反身动词与虚拟式现在时', 10,
$$Gustar 与间接宾语
间接宾语代词
代词位置$$,
$$间接宾语代词：me、te、le（他/她/您）、nos、os、les（他们/您们），表示「给谁、对谁」做某事。
gustar 这类动词用间接宾语：me gusta/me gustan（我喜欢）——真正的主语是喜欢的东西，所以动词随东西单复数变化：Me gusta el español.（我喜欢西语。）Me gustan las flores.（我喜欢花。）
代词一般放在变位动词前，或接在不定式/副动词后连写。
例句：Le doy el libro.（我把书给他。）Te gusta el café.（你喜欢咖啡。）$$),

('直接宾语', 'A2', 11, 2, 'II · 宾语、反身动词与虚拟式现在时', 11,
$$人称 a 与直接宾语
直接宾语代词
代词位置$$,
$$直接宾语代词：me（我）、te（你）、lo（他/它·阳）、la（她/它·阴）、nos（我们）、os（你们）、los（他们·阳）、las（她们·阴）。
直接宾语指人时，前面加「人称 a」：Veo a María.（我看见玛丽亚。）
代词放在变位动词前，或接在不定式/命令式后连写。
例句：Lo veo todos los días.（我每天看见他。）¿Me escuchas?（你在听我说话吗？）$$),

('反身动词', 'A2', 12, 2, 'II · 宾语、反身动词与虚拟式现在时', 12,
$$反身代词
常用反身动词
反身动词表示情感/动作/成为
无人称 se$$,
$$反身动词带反身代词 me、te、se、nos、os、se，表示动作作用于自身。
例：llamarse（名叫）、levantarse（起床）、ducharse（淋浴）、vestirse（穿衣）、acostarse（睡觉）。
反身代词位于变位动词前，或接在不定式/命令式后连写（此时注意重音）。
无人称 se：se + 第三人称单数动词，表示泛指「人们/有人」：Aquí se habla español.（这里讲西班牙语。）
例句：Me llamo Ana.（我叫安娜。）Me levanto a las siete.（我七点起床。）$$),

('虚拟式现在时', 'B1', 13, 2, 'II · 宾语、反身动词与虚拟式现在时', 13,
$$虚拟式构成
用法
各类触发$$,
$$presente de subjuntivo（虚拟式现在时）：-ar→-e 系列（hablar→hable、hables、hable、hablemos、habléis、hablen）；-er/-ir→-a 系列（comer→coma、viva）。
用于表达愿望、请求、建议、怀疑、情感、评价等主观内容。
常见触发：querer que、esperar que、es importante que、para que、antes de que、ojalá、quizás、tal vez。
例句：Quiero que vengas a mi casa.（我希望你来我家。）Es importante que estudies español.（学西语很重要。）$$),

-- ============ III · 简单过去时、未完成时与双宾语代词 ============
('简单过去时', 'A2', 14, 3, 'III · 简单过去时、未完成时与双宾语代词', 14,
$$构成
用法
不规则动词$$,
$$pretérito indefinido（简单过去时）表示过去发生并已结束的动作。
-ar 词尾：-é、-aste、-ó、-amos、-asteis、-aron；-er/-ir 词尾：-í、-iste、-ió、-imos、-isteis、-ieron。例：hablar→hablé、comer→comí、vivir→viví。
常用不规则：ser/ir→fui、fuiste、fue、fuimos、fuisteis、fueron；estar→estuve；tener→tuve；hacer→hice；decir→dije；dar→di。
例句：Ayer hablé con mi madre.（昨天我和妈妈通了电话。）El año pasado vivimos en China.（去年我们住在中国。）$$),

('过去未完成时', 'A2', 15, 3, 'III · 简单过去时、未完成时与双宾语代词', 15,
$$构成
用法
与简单过去时对比$$,
$$pretérito imperfecto（过去未完成时）表示过去持续、习惯性的动作或背景描写。
-ar 词尾：-aba、-abas、-aba、-ábamos、-abais、-aban；-er/-ir 词尾：-ía、-ías、-ía、-íamos、-íais、-ían。
不规则只有三个：ser→era、ir→iba、ver→veía。
简单过去时 vs 未完成时：indefinido 表示过去某时刻完成的具体动作；imperfecto 表示持续状态、习惯或背景。常搭配：indefinido 用 ayer、el año pasado；imperfecto 用 cuando era niño、siempre。
例句：Cuando era niño, jugaba al fútbol.（我小时候常踢足球。）Ayer fui al cine.（昨天我去了电影院。）$$),

-- ============ IV · Ser/Estar、各时态、进行时、虚拟式与命令式 ============
('Ser 与 Estar 及现在时', 'A2', 16, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 16,
$$Estar（to be）
Ser（to be）$$,
$$ser 与 estar 都表示「是/在」，但用法不同。
ser：本质、身份、来源、材料、时间、所属关系（固有属性）。
estar：位置、状态、进行时（暂时情况）。
对比例：Soy aburrido.（我是个无趣的人。——本质）Estoy aburrido.（我很无聊。——此刻状态）。
例句：El libro es de papel.（书是纸做的。）El libro está en la mesa.（书在桌上。）$$),

('Ser 与 Estar 的过去时', 'B1', 17, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 17,
$$简单过去时
未完成时
对比$$,
$$ser 的过去：简单过去 fui、fuiste、fue、fuimos、fuisteis、fueron；未完成 era、eras、era、éramos、erais、eran。
estar 的过去：简单过去 estuve、estuviste、estuvo、estuvimos、estuvisteis、estuvieron；未完成 estaba、estabas、estaba、estábamos、estabais、estaban。
简单过去表示「当时那一刻」；未完成表示「过去持续的状态/背景」。
例句：Fue un día maravilloso.（那是美好的一天。——当时）Estaba muy contento.（我当时很高兴。——持续状态）$$),

('现在进行时', 'B1', 18, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 18,
$$副动词构成
现在进行时构成
用法
代词位置$$,
$$副动词（gerundio）：-ar→-ando（hablar→hablando）；-er/-ir→-iendo（comer→comiendo、vivir→viviendo）。部分不规则：decir→diciendo、dormir→durmiendo、leer→leyendo、ir→yendo。
现在进行时 = estar（现在时）+ 副动词，表示正在进行的动作：Estoy estudiando.（我正在学习。）Estamos comiendo.（我们正在吃饭。）
代词可放在 estar 前，或接在副动词后连写（加写重音）：Estoy leyéndolo. / Lo estoy leyendo.（我正在读它。）$$),

('过去进行时', 'B1', 19, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 19,
$$未完成进行时
简单过去进行时$$,
$$过去进行时 = estar（过去时）+ 副动词。
未完成进行时（estar 用 imperfecto）表示过去正在持续进行的动作、背景：Estaba estudiando cuando llamaste.（你打电话来时我正在学习。）
简单过去进行时（estar 用 indefinido）强调某一段过去时间内的进行：Estuve trabajando toda la noche.（我整晚都在工作。）
例句：Estábamos cenando.（我们当时正在吃晚饭。）$$),

('虚拟式现在时·进阶', 'B1', 20, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 20,
$$构成回顾
用法扩展
触发时态$$,
$$进阶要点：虚拟式现在时不仅出现在简单句中，还大量出现在各类从句里。
触发词：表愿望（querer que、esperar que）、表建议/命令（recomendar que、pedir que）、表情感（alegrarse de que、temer que）、表怀疑（dudar que、no creer que）、无人称判断（es posible que、es bueno que）、连词（para que、antes de que、a menos que）。
比较直陈/虚拟：Creo que viene.（我相信他会来。——肯定→直陈）No creo que venga.（我不认为他会来。——否定/怀疑→虚拟）。
例句：Espero que tengas suerte.（我祝你好运。）Dudo que sea verdad.（我怀疑这不是真的。）$$),

('命令式', 'A2', 21, 4, 'IV · Ser/Estar、各时态、进行时、虚拟式与命令式', 21,
$$肯定 tú 命令
否定 tú 命令
Ud./Uds. 命令
nosotros 命令$$,
$$肯定命令式（tú）通常用第三人称单数现在时形式：habla（说）、come（吃）、escribe（写）；不规则：haz（hacer）、ve（ir）、pon（poner）、ten（tener）、di（decir）。
否定命令式（tú）用 no + 虚拟式现在时第二人称：no hables、no comas、no escribas。
Ud./Uds. 命令用虚拟式第三人称：hable/hablen。
nosotros 命令（「让我们…」）用虚拟式第一人称复数：hablemos、comamos。
例句：Habla más despacio, por favor.（请说慢一点。）No comas tanto.（别吃这么多。）$$),

-- ============ V · 名词、冠词、形容词、代词与完成时 ============
('名词、冠词、形容词与代词', 'B1', 22, 5, 'V · 名词、冠词、形容词、代词与完成时', 22,
$$物主代词
关系代词
指示代词
形容词作名词$$,
$$物主代词（代替「物主形容词 + 名词」）：mío、tuyo、suyo、nuestro、vuestro，要与所指名词性数一致：Este libro es mío.（这本书是我的。）
关系代词：que（最通用，指人指物）、quien/quienes（仅指人，介词后）、cuyo（其……的）、donde（在……地方）。
指示代词：éste/ésta/esto（这个）、ése/ésa/eso（那个）、aquél/aquélla/aquello（远指那个）。
形容词可作名词：el rojo（红色的那个）、los jóvenes（年轻人）。
例句：La ciudad donde vivo es grande.（我住的城市很大。）$$),

('现在完成时', 'B1', 23, 5, 'V · 名词、冠词、形容词、代词与完成时', 23,
$$过去分词构成
现在完成时构成
用法
代词位置$$,
$$pretérito perfecto = haber（现在时）+ 过去分词。
haber：he、has、ha、hemos、habéis、han。
过去分词：-ar→-ado（hablado）；-er/-ir→-ido（comido、vivido）；不规则：hecho（hacer）、dicho（decir）、visto（ver）、escrito（escribir）、vuelto（volver）。
表示与现在有联系、或到目前仍有效的过去动作。
代词放在 haber 前：Lo he visto.（我见过他。）
例句：He comido mucho hoy.（我今天吃了很多。）¿Has estado en España?（你去过西班牙吗？）$$),

('过去完成时', 'B2', 24, 5, 'V · 名词、冠词、形容词、代词与完成时', 24,
$$构成
用法
过去分词作形容词
被动语态$$,
$$pluscuamperfecto = haber（过去未完成时）+ 过去分词。
haber 的未完成时：había、habías、había、habíamos、habíais、habían。
表示「过去的过去」，即某一过去动作之前已完成的事。
过去分词可作形容词（性数一致）：una puerta abierta（一扇开着的门）。
被动语态：ser + 过去分词 + por（施动者）：El edificio fue construido en 1990.（这栋楼建于 1990 年。）
例句：Cuando llegué, ya había salido.（我到的时候，他已经走了。）$$),

-- ============ VI · 将来时与条件式、过去虚拟式、习语 ============
('将来时', 'B1', 25, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 25,
$$构成
用法
将来进行时
将来完成时$$,
$$futuro simple 在动词原形后加词尾（三类动词相同）：-é、-ás、-á、-emos、-éis、-án。
不规则词干：tener→tendr-、venir→vendr-、hacer→har-、poder→podr-、querer→querr-、saber→sabr-、salir→saldr-、decir→dir-。
将来进行时：estaré + 副动词；将来完成时：habré + 过去分词。
例句：Mañana viajaré a Madrid.（明天我要去马德里。）¿Qué harás este fin de semana?（这个周末你要做什么？）$$),

('条件式', 'B1', 26, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 26,
$$构成
用法
条件进行时
条件完成时$$,
$$condicional 词尾（加在动词原形后）：-ía、-ías、-ía、-íamos、-íais、-ían（三类动词相同，词干同将来时）。
表示委婉请求、意愿，或「过去将来」。
条件进行时：estaría + 副动词；条件完成时：habría + 过去分词。
例句：Me gustaría un café, por favor.（我想要一杯咖啡。）¿Podrías ayudarme?（你能帮我吗？）$$),

('现在完成虚拟式', 'B2', 27, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 27,
$$构成
用法$$,
$$pretérito perfecto de subjuntivo = haber（虚拟式现在时）+ 过去分词。
haber 的虚拟式现在时：haya、hayas、haya、hayamos、hayáis、hayan。
用于主观、不确定的过去动作（相对现在而言已完成）：Dudo que haya venido.（我怀疑他来过。）Espero que hayas descansado.（我希望你已经休息好了。）$$),

('虚拟式过去时', 'B2', 28, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 28,
$$构成
用法$$,
$$imperfecto de subjuntivo（虚拟式过去时）由第三人称复数简单过去时去掉 -ron，再加 -ra/-se 系列词尾：hablara/hablase、hablaras、hablara、habláramos、habláseis、hablaran。
用法与虚拟式现在时一致，只是时态退回到过去（主句为过去时）。
例句：Quería que vinieras.（我当时希望你来。）Era importante que estudiara.（当时学西语很重要。）$$),

('过去完成虚拟式', 'B2', 29, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 29,
$$构成
用法$$,
$$pluscuamperfecto de subjuntivo = haber（虚拟式过去时）+ 过去分词。
haber 的虚拟式过去时：hubiera/hubiese、hubieras、hubiera、hubiéramos、hubierais、hubieran。
用于与过去相反的假设、或过去的虚拟情况：Si hubiera sabido, habría venido.（要是我早知道，就会来了。）
复合条件句三型：
真实：Si estudias, aprobarás.
与现在相反：Si tuviera dinero, viajaría.
与过去相反：Si hubiera tenido dinero, habría viajado.$$),

('惯用表达', 'C1', 30, 6, 'VI · 将来时与条件式、过去虚拟式、习语', 30,
$$介词习语
动词习语
时间表达$$,
$$常用习语：
estar en las nubes（心不在焉）、costar un ojo de la cara（贵得要命）、tener ganas de（想要做）、echar de menos（想念）、irse de vacaciones（去度假）、llevarse bien/mal con（与……相处好坏）、ponerse de acuerdo（达成一致）、darse cuenta de（意识到）。
时间表达：hace + 时间（……之前）、desde hace + 时间（自从……以来）、llevar + 时间（已经……多久了）。
例句：Tengo ganas de aprender español.（我想学西语。）Echo de menos a mi familia.（我想念家人。）Hace dos años que estudio español.（我学西语两年了。）$$)

on conflict (title) do nothing;
