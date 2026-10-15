import type { ExerciseType, ExampleSentence, Level } from '../types'
import { chatJSON } from './deepseek'
import {
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
}): Promise<ExampleSentence[]> {
  const data = await chatJSON<{ sentences: ExampleSentence[] }>([
    { role: 'system', content: buildSentenceSystemPrompt() },
    {
      role: 'user',
      content: buildSentenceUserPrompt(
        opts.word,
        opts.pos,
        opts.level,
        opts.knownWords
      ),
    },
  ])
  return Array.isArray(data.sentences) ? data.sentences : []
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
}): Promise<GeneratedExercise> {
  return chatJSON<GeneratedExercise>([
    { role: 'system', content: buildExerciseSystemPrompt() },
    {
      role: 'user',
      content: buildExerciseUserPrompt(
        opts.exerciseType,
        opts.word,
        opts.definitionCn,
        opts.level
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
