'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { ExampleSentence, ExerciseType, Level, Word } from '@/lib/types'
import { levelFromValue } from '@/lib/levels'
import { nextDueAt, review } from '@/lib/srs'
import { loadWordMap } from '@/lib/manual-words'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LevelBadge, PosTag, Tag } from '@/components/ui/badge'
import { SpeakButton } from '@/components/speak-button'
import { DailyProgress } from '@/components/daily-progress'
import { VerbConjugation } from '@/components/verb-conjugation'
import { logStudy } from '@/lib/study'

interface DueItem {
  id: string
  ease_factor: number
  interval_days: number
  correct_count: number
  word_id: string
  word: Word
}

interface GradeResult {
  correct: boolean
  feedback: string
  model_answer: string
}

export default function PalabrasPage() {
  const [loading, setLoading] = useState(true)
  const [due, setDue] = useState<DueItem[]>([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [stats, setStats] = useState({ due: 0, learning: 0, known: 0 })
  const [progressKey, setProgressKey] = useState(0)
  const [userLevel, setUserLevel] = useState<Level>('A1')
  const [exerciseType, setExerciseType] = useState<ExerciseType>('translate_zh_es')
  const [sentences, setSentences] = useState<ExampleSentence[]>([])
  const [sentencesLoading, setSentencesLoading] = useState(false)

  // 练习（方式二）状态
  const [answer, setAnswer] = useState('')
  const [grading, setGrading] = useState(false)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [exerciseError, setExerciseError] = useState<string | null>(null)

  const load = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data: prof } = await supabase
      .from('profiles')
      .select('target_level, exercise_type')
      .eq('id', user.id)
      .single()
    if (prof?.target_level) setUserLevel(levelFromValue(prof.target_level))
    if (prof?.exercise_type) setExerciseType(prof.exercise_type as ExerciseType)

    const now = new Date().toISOString()
    const [dueRes, dueCountRes, learningRes, knownRes, wordMap] = await Promise.all([
      supabase
        .from('user_words')
        .select('id, ease_factor, interval_days, correct_count, word_id')
        .eq('user_id', user.id)
        .lte('due_at', now)
        .order('due_at', { ascending: true })
        .limit(30),
      supabase
        .from('user_words')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lte('due_at', now),
      supabase
        .from('user_words')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'learning'),
      supabase
        .from('user_words')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'known'),
      loadWordMap(),
    ])

    const rows = (dueRes.data ?? []) as unknown as {
      id: string
      ease_factor: number
      interval_days: number
      correct_count: number
      word_id: string
    }[]
    const items: DueItem[] = rows
      .map((r) => {
        const word = wordMap.get(r.word_id)
        if (!word) return null
        return {
          id: r.id,
          ease_factor: r.ease_factor,
          interval_days: r.interval_days,
          correct_count: r.correct_count,
          word_id: r.word_id,
          word,
        }
      })
      .filter((d): d is DueItem => d !== null)

    setDue(items)
    setStats({
      due: dueCountRes.count ?? 0,
      learning: learningRes.count ?? 0,
      known: knownRes.count ?? 0,
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const current = due[idx]

  // 练习题目（本地生成，不耗 AI；只有批改时才调 AI）
  const exercisePrompt = current
    ? exerciseType === 'translate_zh_es'
      ? `把下面的中文翻译成西班牙语：${current.word.definition_cn}`
      : `把下面的西班牙语翻译成中文：${current.word.spanish}`
    : null

  const expectedHint = current
    ? exerciseType === 'translate_zh_es'
      ? current.word.spanish
      : current.word.definition_cn
    : null

  async function submitExercise() {
    if (!current || !exercisePrompt || answer.trim() === '') return
    setGrading(true)
    setExerciseError(null)
    try {
      const res = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: exercisePrompt,
          userAnswer: answer,
          expectedHint: expectedHint ?? undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '批改失败')
      setGradeResult(data as GradeResult)
    } catch (e) {
      setExerciseError(e instanceof Error ? e.message : '批改失败')
    } finally {
      setGrading(false)
    }
  }

  async function loadSentencesFor(item: DueItem) {
    const supabase = createClient()
    setSentencesLoading(true)
    setSentences([])
    try {
      const { data: cached } = await supabase
        .from('sentences')
        .select('spanish, chinese')
        .eq('word_id', item.word_id)
        .eq('level', userLevel)
        .order('created_at', { ascending: true })
      let list = (cached as ExampleSentence[]) ?? []
      if (list.length === 0) {
        const res = await fetch('/api/ai/sentences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wordId: item.word_id,
            word: item.word.spanish,
            pos: item.word.pos,
            level: userLevel,
          }),
        })
        const data = await res.json()
        if (res.ok) list = (data.sentences as ExampleSentence[]) ?? []
      }
      setSentences(list)
    } catch {
      setSentences([])
    } finally {
      setSentencesLoading(false)
    }
  }

  useEffect(() => {
    if (flipped && current) {
      loadSentencesFor(current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, current?.id])

  const refreshStats = useCallback(async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    const now = new Date().toISOString()
    const [dueCountRes, learningRes, knownRes] = await Promise.all([
      supabase
        .from('user_words')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .lte('due_at', now),
      supabase
        .from('user_words')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'learning'),
      supabase
        .from('user_words')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'known'),
    ])
    setStats({
      due: dueCountRes.count ?? 0,
      learning: learningRes.count ?? 0,
      known: knownRes.count ?? 0,
    })
  }, [])

  async function submitReview(quality: number) {
    if (!current) return
    const next = review(
      {
        easeFactor: current.ease_factor,
        intervalDays: current.interval_days,
        correctCount: current.correct_count,
      },
      quality
    )
    const supabase = createClient()
    await supabase
      .from('user_words')
      .update({
        ease_factor: next.easeFactor,
        interval_days: next.intervalDays,
        correct_count: next.correctCount,
        due_at: nextDueAt(next.intervalDays).toISOString(),
        status:
          quality >= 3
            ? next.correctCount >= 3
              ? 'known'
              : 'learning'
            : 'learning',
        last_reviewed_at: new Date().toISOString(),
      })
      .eq('id', current.id)

    await logStudy({ reviewed: 1 })
    setProgressKey((k) => k + 1)
    setFlipped(false)
    setAnswer('')
    setGradeResult(null)
    if (idx + 1 < due.length) {
      setIdx(idx + 1)
    } else {
      setDue([])
      setIdx(0)
    }
    await refreshStats()
  }

  return (
    <div className="flex flex-col gap-6">
      <DailyProgress refreshKey={progressKey} />

      {/* 统计 */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: '待复习', value: stats.due, color: 'text-bauhaus-red' },
          { label: '学习中', value: stats.learning, color: 'text-bauhaus-yellow' },
        ].map((s) => (
          <Card key={s.label} className="p-3 text-center shadow-none">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="mt-1 text-xs font-bold text-bauhaus-muted">
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      {current ? (
        <div className="flex flex-col gap-4">
          {/* 闪卡栏目（上） */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setFlipped((f) => !f)
              }
            }}
            className="min-h-44 w-full cursor-pointer select-none text-left"
          >
            <Card className="flex min-h-44 flex-col justify-between p-6">
              <div className="flex items-center gap-2">
                <LevelBadge level={current.word.level} />
                <PosTag pos={current.word.pos} />
                {current.word.gender && (
                  <Tag>{current.word.gender === 'm' ? '阳性' : '阴性'}</Tag>
                )}
              </div>
              <div className="py-5 text-center">
                <div className="flex items-center justify-center gap-3">
                  <div className="text-4xl font-black">{current.word.spanish}</div>
                  <SpeakButton text={current.word.spanish} />
                </div>
                <div className="mt-3 min-h-6 text-lg text-bauhaus-ink">
                  {flipped ? current.word.definition_cn : '· · ·'}
                </div>
                {flipped && current.word.pos === 'verb' && (
                  <div className="mt-4 text-left">
                    <VerbConjugation verb={current.word.spanish} />
                  </div>
                )}
                {flipped && (
                  <div className="mt-4 text-left">
                    {sentencesLoading && (
                      <p className="text-xs font-bold text-bauhaus-muted">
                        正在生成例句…
                      </p>
                    )}
                    {!sentencesLoading && sentences.length > 0 && (
                      <div className="flex flex-col gap-1.5">
                        {sentences.map((s, i) => (
                          <div
                            key={i}
                            className="rounded-sm border-2 border-bauhaus-line bg-bauhaus-paper p-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-bold">{s.spanish}</p>
                              <SpeakButton text={s.spanish} size={13} />
                            </div>
                            <p className="mt-0.5 text-xs text-bauhaus-muted">
                              {s.chinese}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="text-center text-xs font-bold text-bauhaus-muted">
                {flipped ? '第 ' + (idx + 1) + ' / ' + due.length + ' 个' : '点击翻面看释义'}
              </div>
            </Card>
          </div>

          {/* 认识 / 不认识（中间） */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => submitReview(2)}>
              不认识
            </Button>
            <Button onClick={() => submitReview(4)}>认识</Button>
          </div>

          {/* 练习栏目（下） */}
          <Card className="p-5">
            <div className="mb-1 flex items-center justify-between">
              <h2 className="font-black">练习</h2>
              <span className="text-xs font-bold text-bauhaus-muted">
                {exerciseType === 'translate_zh_es' ? '中译西' : '西译中'}
              </span>
            </div>
            <p className="mb-3 text-xs font-bold text-bauhaus-muted">
              做对记「认识」，做错记「不认识」
            </p>

            {exerciseType === 'translate_zh_es' ? (
              <p className="text-lg font-bold">{current.word.definition_cn}</p>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold">{current.word.spanish}</p>
                <SpeakButton text={current.word.spanish} size={14} />
              </div>
            )}

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="在这里写下你的答案…"
              rows={3}
              className="mt-3 w-full rounded-sm border-2 border-bauhaus-black bg-white px-3 py-2 text-lg font-bold outline-none focus:border-bauhaus-blue"
            />
            <div className="mt-1 text-right text-xs font-bold text-bauhaus-muted">
              {answer.trim() !== '' ? `已输入 ${answer.trim().length} 字` : ''}
            </div>

            {!gradeResult ? (
              <Button
                className="mt-3 w-full"
                onClick={submitExercise}
                disabled={grading || answer.trim() === ''}
              >
                {grading ? '批改中…' : '提交批改'}
              </Button>
            ) : (
              <>
                <div
                  className={
                    'mt-3 px-4 py-3 text-lg font-black text-white ' +
                    (gradeResult.correct ? 'bg-bauhaus-blue' : 'bg-bauhaus-red')
                  }
                >
                  {gradeResult.correct ? '✓ 正确' : '✗ 错误'}
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
                  {gradeResult.feedback}
                </p>
                {gradeResult.model_answer && (
                  <div className="mt-3 rounded-sm bg-bauhaus-paper p-3">
                    <div className="text-xs font-bold text-bauhaus-muted">
                      参考答案
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {gradeResult.model_answer}
                      </span>
                      {exerciseType === 'translate_zh_es' && (
                        <SpeakButton text={gradeResult.model_answer} size={14} />
                      )}
                    </div>
                  </div>
                )}
                <Button
                  className="mt-4 w-full"
                  onClick={() => submitReview(gradeResult.correct ? 4 : 2)}
                >
                  下一个
                </Button>
              </>
            )}

            {exerciseError && (
              <p className="mt-3 text-sm font-bold text-bauhaus-red">
                {exerciseError}
              </p>
            )}
          </Card>
        </div>
      ) : (
        !loading && (
          <Card className="p-6 text-center shadow-none">
            <div className="text-2xl font-black">今日复习完成 🎉</div>
            <p className="mt-2 text-sm text-bauhaus-muted">
              {stats.learning + stats.known === 0
                ? '先去「词库」添加一些单词开始学习吧'
                : '暂时没有到期的单词，休息一下'}
            </p>
            <Link
              href="/vocabulario"
              className="mt-4 inline-block text-sm font-bold text-bauhaus-blue underline underline-offset-4"
            >
              去词库添加单词 →
            </Link>
          </Card>
        )
      )}
    </div>
  )
}
