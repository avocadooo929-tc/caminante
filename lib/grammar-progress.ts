import { createClient } from './supabase/client'

export interface LessonProgress {
  lessonId: string
  title: string
  total: number
  correct: number
  done: boolean
}

/** 返回每个语法点（章）的练习完成情况：该章所有练习都答对才算 done */
export async function getGrammarProgress(): Promise<LessonProgress[]> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const [exRes, attRes, lessonRes] = await Promise.all([
    supabase.from('grammar_exercises').select('id, lesson_id'),
    supabase
      .from('grammar_attempts')
      .select('exercise_id')
      .eq('user_id', user.id)
      .eq('correct', true),
    supabase.from('grammar_lessons').select('id, title').order('order_index'),
  ])

  const correctIds = new Set(
    ((attRes.data ?? []) as { exercise_id: string }[]).map((r) => r.exercise_id)
  )
  const totalByLesson = new Map<string, number>()
  const correctByLesson = new Map<string, number>()
  for (const e of (exRes.data ?? []) as { id: string; lesson_id: string }[]) {
    totalByLesson.set(e.lesson_id, (totalByLesson.get(e.lesson_id) ?? 0) + 1)
    if (correctIds.has(e.id)) {
      correctByLesson.set(e.lesson_id, (correctByLesson.get(e.lesson_id) ?? 0) + 1)
    }
  }

  return ((lessonRes.data ?? []) as { id: string; title: string }[]).map((l) => {
    const total = totalByLesson.get(l.id) ?? 0
    const correct = correctByLesson.get(l.id) ?? 0
    return {
      lessonId: l.id,
      title: l.title,
      total,
      correct,
      done: total > 0 && correct >= total,
    }
  })
}

/** 返回用户已完成的语法点标题（用于单词练习融合语法考察） */
export async function getLearnedGrammarTitles(): Promise<string[]> {
  const progress = await getGrammarProgress()
  return progress.filter((p) => p.done).map((p) => p.title)
}
