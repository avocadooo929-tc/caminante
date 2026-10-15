import type { Level, PartOfSpeech, Word, WordSource } from './types'
import raw from '@/data/words.json'

/** data/words.json 里的原始条目（source 只有 builtin/textbook，manual 词在数据库） */
interface RawEntry {
  id: string
  spanish: string
  pos: PartOfSpeech
  definition_cn: string
  level: Level
  gender: 'm' | 'f' | null
  source: Exclude<WordSource, 'manual'>
  unit: string | null
}

export interface StaticWord extends Word {
  unit: string | null
}

const entries = raw as unknown as RawEntry[]

/** 内置 + 教材的共享静态词表（随应用打包，是唯一权威源） */
export const STATIC_WORDS: StaticWord[] = entries.map((w) => ({
  id: w.id,
  spanish: w.spanish,
  pos: w.pos,
  definition_cn: w.definition_cn,
  level: w.level,
  frequency_rank: null,
  source: w.source,
  gender: w.gender,
  unit: w.unit,
}))

/** slug -> 静态词 */
export const STATIC_BY_ID = new Map<string, StaticWord>(
  STATIC_WORDS.map((w) => [w.id, w])
)

export function getStaticWord(id: string): StaticWord | undefined {
  return STATIC_BY_ID.get(id)
}

/** 静态词（优先） + 手动词合并成 slug -> Word 的查词表 */
export function buildWordMap(manualWords: Word[] = []): Map<string, Word> {
  const m = new Map<string, Word>()
  for (const w of STATIC_WORDS) m.set(w.id, w)
  for (const w of manualWords) m.set(w.id, w)
  return m
}
