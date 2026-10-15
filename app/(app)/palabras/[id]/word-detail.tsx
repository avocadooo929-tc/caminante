'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { ExampleSentence, Level, Word } from '@/lib/types'
import { levelFromValue } from '@/lib/levels'
import { getStaticWord } from '@/lib/words-data'
import { LevelPicker } from '@/components/level-picker'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LevelBadge, PosTag, Tag } from '@/components/ui/badge'
import { SpeakButton } from '@/components/speak-button'
import { VerbConjugation } from '@/components/verb-conjugation'

interface WordDetail {
  definition: string
  tips: string
}

export function WordDetail({ id }: { id: string }) {
  const [word, setWord] = useState<Word | null>(null)
  const [level, setLevel] = useState<Level>('A1')
  const [sentences, setSentences] = useState<ExampleSentence[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [detail, setDetail] = useState<WordDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const supabase = createClient()

      // 先查静态词表，查不到再查数据库手动词
      let w: Word | null = getStaticWord(id) ?? null
      if (!w) {
        const { data } = await supabase
          .from('words')
          .select('*')
          .eq('id', id)
          .eq('source', 'manual')
          .single()
        w = (data as Word | null) ?? null
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (cancelled) return
      setWord(w)

      let target = levelFromValue(w?.level)
      if (user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('target_level')
          .eq('id', user.id)
          .single()
        if (prof?.target_level) target = levelFromValue(prof.target_level)
      }
      setLevel(target)
      if (w) {
        const cached = await loadSentences(w.id, target)
        setSentences(cached)
        if (cached.length === 0) {
          try {
            const list = await generateSentencesFor(w, target)
            setSentences(list)
          } catch {
            // 自动生成失败不打扰，用户可手动点「生成例句」
          }
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function loadSentences(wordId: string, lv: Level): Promise<ExampleSentence[]> {
    const supabase = createClient()
    const { data } = await supabase
      .from('sentences')
      .select('spanish, chinese')
      .eq('word_id', wordId)
      .eq('level', lv)
      .order('created_at', { ascending: true })
    return (data as ExampleSentence[]) ?? []
  }

  async function generateSentencesFor(
    w: Word,
    lv: Level
  ): Promise<ExampleSentence[]> {
    const res = await fetch('/api/ai/sentences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wordId: w.id,
        word: w.spanish,
        pos: w.pos,
        level: lv,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || '生成失败')
    return (data.sentences as ExampleSentence[]) ?? []
  }

  async function onLevelChange(lv: Level) {
    setLevel(lv)
    if (!word) return
    setLoading(true)
    setError(null)
    try {
      let list = await loadSentences(word.id, lv)
      if (list.length === 0) list = await generateSentencesFor(word, lv)
      setSentences(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  async function generate() {
    if (!word) return
    setLoading(true)
    setError(null)
    try {
      const list = await generateSentencesFor(word, level)
      setSentences(list)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setLoading(false)
    }
  }

  async function generateDetail() {
    if (!word) return
    setDetailLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/word-detail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.spanish, pos: word.pos, level }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '生成失败')
      setDetail(data as WordDetail)
    } catch (e) {
      setError(e instanceof Error ? e.message : '生成失败')
    } finally {
      setDetailLoading(false)
    }
  }

  if (!word) {
    return <p className="py-10 text-center text-bauhaus-muted">加载中…</p>
  }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/vocabulario"
        className="text-sm font-bold text-bauhaus-muted underline-offset-4 hover:underline"
      >
        ← 返回词库
      </Link>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LevelBadge level={word.level} />
            <PosTag pos={word.pos} />
            {word.gender && (
              <Tag>{word.gender === 'm' ? '阳性' : '阴性'}</Tag>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <h1 className="text-4xl font-black">{word.spanish}</h1>
          <SpeakButton text={word.spanish} />
        </div>
        <p className="mt-3 text-lg text-bauhaus-ink">{word.definition_cn}</p>
        {word.pos === 'verb' && (
          <div className="mt-4">
            <div className="mb-2 text-xs font-bold text-bauhaus-muted">
              陈述式一般现在时变位
            </div>
            <VerbConjugation verb={word.spanish} />
          </div>
        )}
      </Card>

      <div>
        <h2 className="mb-3 font-black">详细释义</h2>
        <Button onClick={generateDetail} disabled={detailLoading} className="w-full">
          {detailLoading ? '生成中…' : '生成详解'}
        </Button>
        {detail && (
          <Card className="mt-3 p-5">
            <p className="whitespace-pre-line text-base leading-relaxed">
              {detail.definition}
            </p>
            {detail.tips && (
              <p className="mt-3 rounded-sm bg-bauhaus-yellow px-3 py-2 text-sm font-bold">
                💡 {detail.tips}
              </p>
            )}
          </Card>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-black">例句（按你的水平自动生成）</h2>
        <div className="mb-3">
          <LevelPicker value={level} onChange={onLevelChange} />
        </div>

        <Button onClick={generate} disabled={loading} className="w-full">
          {loading ? '生成中…' : '生成例句'}
        </Button>

        {error && (
          <Card className="mt-3 border-bauhaus-red p-4">
            <p className="text-sm font-bold text-bauhaus-red">{error}</p>
          </Card>
        )}

        <div className="mt-3 flex flex-col gap-3">
          {sentences.map((s, i) => (
            <Card key={i} className="p-4 shadow-none">
              <div className="flex items-start justify-between gap-2">
                <p className="text-lg font-bold">{s.spanish}</p>
                <SpeakButton text={s.spanish} size={14} />
              </div>
              <p className="mt-1 text-sm text-bauhaus-muted">{s.chinese}</p>
            </Card>
          ))}
          {!loading && sentences.length === 0 && !error && (
            <p className="py-4 text-center text-sm text-bauhaus-muted">
              点「生成例句」，AI 会结合你已掌握的词汇、按 {level} 难度出 3 个例句
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
