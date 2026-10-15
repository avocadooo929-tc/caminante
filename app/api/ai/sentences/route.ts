import { NextResponse } from 'next/server'
import { generateExerciseSentence, generateSentences } from '@/lib/ai'
import { isLevel } from '@/lib/levels'
import { getStaticWord } from '@/lib/words-data'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  let body: {
    wordId?: unknown
    word?: unknown
    pos?: unknown
    level?: unknown
    kind?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const wordId = typeof body.wordId === 'string' ? body.wordId : null
  const level = isLevel(body.level) ? body.level : null
  const kind = body.kind === 'exercise' ? 'exercise' : 'flashcard'
  if (!wordId || !level) {
    return NextResponse.json({ error: '缺少 wordId 或 level' }, { status: 400 })
  }

  // 1. 命中缓存则直接返回（同词同难度同 kind 不重复计费）
  const { data: cached } = await supabase
    .from('sentences')
    .select('spanish, chinese')
    .eq('word_id', wordId)
    .eq('level', level)
    .eq('kind', kind)
    .order('created_at', { ascending: true })
  if (cached && cached.length > 0) {
    return NextResponse.json({ sentences: cached })
  }

  // 2. 取单词信息（优先用客户端传来的 word/pos，兜底查静态词表）
  let word = typeof body.word === 'string' ? body.word : ''
  let pos = typeof body.pos === 'string' ? body.pos : ''
  if (!word || !pos) {
    const sw = getStaticWord(wordId)
    if (sw) {
      word = sw.spanish
      pos = sw.pos
    }
  }
  if (!word || !pos) {
    return NextResponse.json({ error: '单词不存在' }, { status: 404 })
  }

  // 3. 该词已有的全部例句（两种 kind 都算），生成时避免重复
  const { data: existingRows } = await supabase
    .from('sentences')
    .select('spanish')
    .eq('word_id', wordId)
  const existing = ((existingRows ?? []) as unknown as { spanish: string }[]).map(
    (r) => r.spanish
  )

  // 4. 取学习者已掌握词汇（user_words 里的 slug → 从静态/手动词表解析 spanish）
  const { data: knownRows } = await supabase
    .from('user_words')
    .select('word_id')
    .eq('user_id', user.id)
    .limit(1000)
  const slugs = ((knownRows ?? []) as unknown as { word_id: string }[]).map(
    (r) => r.word_id
  )
  const knownWords: string[] = []
  const missing = new Set<string>()
  for (const s of slugs) {
    const sw = getStaticWord(s)
    if (sw) knownWords.push(sw.spanish)
    else missing.add(s)
  }
  if (missing.size > 0) {
    const { data: manual } = await supabase
      .from('words')
      .select('id, spanish')
      .in('id', [...missing])
    for (const m of (manual ?? []) as unknown as { spanish: string }[]) {
      knownWords.push(m.spanish)
    }
  }

  // 5. 调用 AI 生成（flashcard 3 句 / exercise 1 句疑问句）
  let sentences: { spanish: string; chinese: string }[]
  try {
    if (kind === 'exercise') {
      const s = await generateExerciseSentence({ word, pos, level, knownWords, existing })
      sentences = s ? [s] : []
    } else {
      sentences = await generateSentences({ word, pos, level, knownWords, existing })
    }
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : '生成失败' },
      { status: 500 }
    )
  }

  // 6. 落库缓存
  if (sentences.length > 0) {
    await supabase.from('sentences').insert(
      sentences.map((s) => ({
        word_id: wordId,
        level,
        kind,
        spanish: s.spanish,
        chinese: s.chinese,
      }))
    )
  }

  return NextResponse.json({ sentences })
}
