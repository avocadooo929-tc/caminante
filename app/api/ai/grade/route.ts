import { NextResponse } from 'next/server'
import { gradeAnswer } from '@/lib/ai'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  let body: { prompt?: unknown; userAnswer?: unknown; expectedHint?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt : ''
  const userAnswer =
    typeof body.userAnswer === 'string' ? body.userAnswer.trim() : ''
  const expectedHint =
    typeof body.expectedHint === 'string' ? body.expectedHint : undefined

  if (!prompt || userAnswer === '') {
    return NextResponse.json({ error: '缺少题目或作答' }, { status: 400 })
  }

  try {
    const result = await gradeAnswer({ prompt, userAnswer, expectedHint })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '批改失败' },
      { status: 500 }
    )
  }
}
