export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'pronoun'
  | 'preposition'
  | 'conjunction'
  | 'interjection'
  | 'article'

export type WordSource = 'builtin' | 'textbook' | 'manual'

export interface Word {
  id: string
  spanish: string
  pos: PartOfSpeech
  definition_cn: string
  level: Level
  frequency_rank: number | null
  source: WordSource
  gender: 'm' | 'f' | null
  created_at?: string
}

export type UserWordStatus = 'new' | 'learning' | 'known'

export interface UserWord {
  id: string
  user_id: string
  word_id: string
  status: UserWordStatus
  ease_factor: number
  interval_days: number
  due_at: string
  correct_count: number
  last_reviewed_at: string | null
}

export interface ExampleSentence {
  spanish: string
  chinese: string
}

export type ExerciseType =
  | 'translate_zh_es'
  | 'translate_es_zh'
  | 'sentence_build'

export interface GrammarLesson {
  id: string
  title: string
  level: Level
  order_index: number
  explanation_cn: string
  part_no: number | null
  part_title: string | null
  chapter_no: number | null
  subtopics: string | null
}
