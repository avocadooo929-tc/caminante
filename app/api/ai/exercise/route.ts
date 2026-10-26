import { NextResponse } from 'next/server'
import { generateExercise } from '@/lib/ai'
import { isLevel } from '@/lib/levels'
import { createClient } from '@/lib/supabase/server'
import type { ExerciseType } from '@/lib/types'

const EXERCISE_TYPES: ExerciseType[] = [
  'translate_zh_es',
  'translate_es_zh',
  'sentence_build',
]

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  let body: {
    word?: unknown
    definitionCn?: unknown
    level?: unknown
    exerciseType?: unknown
    grammarPoints?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const word = typeof body.word === 'string' ? body.word.trim() : ''
  const definitionCn =
    typeof body.definitionCn === 'string' ? body.definitionCn.trim() : ''
  const level = isLevel(body.level) ? body.level : null
  const exerciseType = EXERCISE_TYPES.includes(body.exerciseType as ExerciseType)
    ? (body.exerciseType as ExerciseType)
    : null
  const grammarPoints = Array.isArray(body.grammarPoints)
    ? (body.grammarPoints as unknown[]).filter(
        (x): x is string => typeof x === 'string'
      )
    : []

  if (!word || !definitionCn || !level || !exerciseType) {
    return NextResponse.json({ error: '参数不完整' }, { status: 400 })
  }

  try {
    const result = await generateExercise({
      word,
      definitionCn,
      level,
      exerciseType,
      grammarPoints,
    })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '出题失败' },
      { status: 500 }
    )
  }
}
