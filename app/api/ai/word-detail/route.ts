import { NextResponse } from 'next/server'
import { generateWordDetail } from '@/lib/ai'
import { isLevel } from '@/lib/levels'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  let body: { word?: unknown; pos?: unknown; level?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const word = typeof body.word === 'string' ? body.word.trim() : ''
  const pos = typeof body.pos === 'string' ? body.pos : ''
  const level = isLevel(body.level) ? body.level : null

  if (!word || !pos || !level) {
    return NextResponse.json({ error: '参数不完整' }, { status: 400 })
  }

  try {
    const result = await generateWordDetail({ word, pos, level })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '生成失败' },
      { status: 500 }
    )
  }
}
