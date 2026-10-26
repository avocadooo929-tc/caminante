import type { ExerciseType, ExampleSentence, Level } from '../types'
import { chatJSON } from './deepseek'
import {
  buildExerciseSentenceUserPrompt,
  buildExerciseSystemPrompt,
  buildExerciseUserPrompt,
  buildGradeSystemPrompt,
  buildGradeUserPrompt,
  buildSentenceSystemPrompt,
  buildSentenceUserPrompt,
  buildWordDetailSystemPrompt,
  buildWordDetailUserPrompt,
} from './prompts'

export interface GradeResult {
  correct: boolean
  feedback: string
  model_answer: string
}

export interface GeneratedExercise {
  prompt: string
  answer: string
  hint: string
}

/** 生成贴合学习者水平与词库的例句（AI provider 的对外入口，可在此替换服务商） */
export async function generateSentences(opts: {
  word: string
  pos: string
  level: Level
  knownWords: string[]
  existing?: string[]
}): Promise<ExampleSentence[]> {
  const data = await chatJSON<{ sentences: ExampleSentence[] }>([
    { role: 'system', content: buildSentenceSystemPrompt() },
    {
      role: 'user',
      content: buildSentenceUserPrompt(
        opts.word,
        opts.pos,
        opts.level,
        opts.knownWords,
        opts.existing ?? []
      ),
    },
  ])
  return Array.isArray(data.sentences) ? data.sentences : []
}

/** 生成练习栏目的 1 条例句（优先疑问句，且与闪卡例句不同） */
export async function generateExerciseSentence(opts: {
  word: string
  pos: string
  level: Level
  knownWords: string[]
  existing?: string[]
}): Promise<ExampleSentence | null> {
  const data = await chatJSON<{ sentences: ExampleSentence[] }>([
    { role: 'system', content: buildSentenceSystemPrompt() },
    {
      role: 'user',
      content: buildExerciseSentenceUserPrompt(
        opts.word,
        opts.pos,
        opts.level,
        opts.knownWords,
        opts.existing ?? []
      ),
    },
  ])
  return Array.isArray(data.sentences) && data.sentences.length > 0
    ? data.sentences[0]
    : null
}

export async function gradeAnswer(opts: {
  prompt: string
  userAnswer: string
  expectedHint?: string
}): Promise<GradeResult> {
  return chatJSON<GradeResult>([
    { role: 'system', content: buildGradeSystemPrompt() },
    {
      role: 'user',
      content: buildGradeUserPrompt(
        opts.prompt,
        opts.userAnswer,
        opts.expectedHint
      ),
    },
  ])
}

export async function generateExercise(opts: {
  exerciseType: ExerciseType
  word: string
  definitionCn: string
  level: Level
  grammarPoints?: string[]
}): Promise<GeneratedExercise> {
  return chatJSON<GeneratedExercise>([
    { role: 'system', content: buildExerciseSystemPrompt() },
    {
      role: 'user',
      content: buildExerciseUserPrompt(
        opts.exerciseType,
        opts.word,
        opts.definitionCn,
        opts.level,
        opts.grammarPoints ?? []
      ),
    },
  ])
}

export interface WordDetail {
  definition: string
  tips: string
}

/** 生成词典式详细中文释义 */
export async function generateWordDetail(opts: {
  word: string
  pos: string
  level: Level
}): Promise<WordDetail> {
  return chatJSON<WordDetail>([
    { role: 'system', content: buildWordDetailSystemPrompt() },
    {
      role: 'user',
      content: buildWordDetailUserPrompt(opts.word, opts.pos, opts.level),
    },
  ])
}
