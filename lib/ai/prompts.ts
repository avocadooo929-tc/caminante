import type { ExerciseType, Level } from '../types'

const LEVEL_GUIDE: Record<Level, string> = {
  A1: '入门水平：只使用最基础、最高频的词汇和最简单的句子结构（主语+动词+宾语），避免从句。',
  A2: '基础水平：使用常见日常词汇，以简单句为主，可加入极简单的连接词（y、pero、porque）。',
  B1: '进阶水平：词汇较丰富，允许简单从句（que、cuando），句子中等长度。',
  B2: '中高级水平：词汇较丰富，可使用多种从句和更自然的表达，句子较长。',
  C1: '高级水平：词汇精准多样，可使用复杂句、虚拟式与惯用表达，接近母语自然表达。',
}

export function buildSentenceSystemPrompt(): string {
  return [
    '你是西班牙语教学助手，为中文母语者生成学习例句。',
    '输出必须是合法 JSON，格式如下（不要输出任何其他文字）：',
    '{"sentences":[{"spanish":"...","chinese":"..."}]}',
    '要求：',
    '1. 每个例句自然、地道、语法正确，并真实体现目标词的常见用法。',
    '2. chinese 字段给出整句的中文翻译。',
    '3. 严格限制用词难度（见用户消息中的水平说明），尽量只使用学习者已掌握的词汇。',
  ].join('\n')
}

export function buildSentenceUserPrompt(
  word: string,
  pos: string,
  level: Level,
  knownWords: string[]
): string {
  const known = knownWords.length
    ? knownWords.slice(0, 200).join('、')
    : '（暂无，请使用最基础词汇）'
  return [
    `目标词：${word}（词性：${pos}）`,
    `目标难度：${level}。${LEVEL_GUIDE[level]}`,
    `学习者已掌握的词汇：${known}`,
    '请生成 3 个例句，尽量只使用学习者已掌握的词汇和目标难度范围内的词；若必须引入新词，控制在最少量。',
  ].join('\n')
}

export function buildGradeSystemPrompt(): string {
  return [
    '你是西班牙语教师，批改学生的造句/翻译练习。',
    '输出必须是合法 JSON，格式如下：',
    '{"correct":true,"feedback":"...","model_answer":"..."}',
    'correct 为布尔值；feedback 用中文指出错误、解释原因并给出鼓励；model_answer 给出一个正确的参考答案。',
  ].join('\n')
}

export function buildGradeUserPrompt(
  prompt: string,
  userAnswer: string,
  expectedHint?: string
): string {
  return [
    `题目：${prompt}`,
    expectedHint ? `参考答案提示：${expectedHint}` : '',
    `学生作答：${userAnswer}`,
    '请判断对错并给出反馈。',
  ]
    .filter(Boolean)
    .join('\n')
}

export function buildExerciseSystemPrompt(): string {
  return [
    '你是西班牙语练习生成器。',
    '输出必须是合法 JSON，格式如下：',
    '{"prompt":"...","answer":"...","hint":"..."}',
    'prompt 只写需要翻译/作答的句子或内容本身，不要加“请翻译”“请把下面的句子翻译成……”等任何说明文字；',
    'answer 是参考答案；hint 是可选提示，没有就留空字符串。',
  ].join('\n')
}

const EXERCISE_TYPE_TEXT: Record<ExerciseType, string> = {
  translate_zh_es: '中译西：给一个中文句子，让学生翻译成西班牙语，句子中必须使用目标词。',
  translate_es_zh: '西译中：给一个含目标词的西班牙语句子，让学生翻译成中文。',
  sentence_build: '造句：让学生用目标词造一个西班牙语句子。',
}

export function buildExerciseUserPrompt(
  exerciseType: ExerciseType,
  word: string,
  definitionCn: string,
  level: Level
): string {
  return [
    `题型：${EXERCISE_TYPE_TEXT[exerciseType]}`,
    `目标词：${word}（中文释义：${definitionCn}）`,
    `目标难度：${level}。${LEVEL_GUIDE[level]}`,
    '请生成一道练习。',
  ].join('\n')
}

export function buildWordDetailSystemPrompt(): string {
  return [
    '你是西班牙语词典编撰助手，为中文母语学习者解释单词。',
    '输出必须是合法 JSON，格式如下（不要输出任何其他文字）：',
    '{"definition":"...","tips":"..."}',
    'definition 用中文给出全面释义，包含：词性、名词的阴阳性、2-3 个核心义项（每个义项配一个简短西语例子和中文翻译）、常见搭配。',
    'tips 用一句话给出易错点或用法提示。',
  ].join('\n')
}

export function buildWordDetailUserPrompt(
  word: string,
  pos: string,
  level: Level
): string {
  return [
    `单词：${word}（词性：${pos}）`,
    `学习者水平：${level}。${LEVEL_GUIDE[level]}`,
    '请用中文给出全面、易懂的释义。',
  ].join('\n')
}
