'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ExerciseType, Level, Word } from '@/lib/types'
import { levelFromValue } from '@/lib/levels'
import { loadWordMap } from '@/lib/manual-words'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LevelBadge } from '@/components/ui/badge'
import { SpeakButton } from '@/components/speak-button'

const TYPES: { value: ExerciseType; label: string }[] = [
  { value: 'translate_zh_es', label: '中译西' },
  { value: 'translate_es_zh', label: '西译中' },
]

interface Pick {
  spanish: string
  definition_cn: string
  level: Level
}

interface GradeResult {
  correct: boolean
  feedback: string
  model_answer: string
}

export default function PracticaPage() {
  const [exerciseType, setExerciseType] = useState<ExerciseType>('translate_zh_es')
  const [word, setWord] = useState<Pick | null>(null)
  const [prompt, setPrompt] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<GradeResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [grading, setGrading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [noWords, setNoWords] = useState(false)
  const [userLevel, setUserLevel] = useState<Level>('A1')
  const wordMapRef = useRef<Map<string, Word> | null>(null)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      let lvl: Level = 'A1'
      if (user) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('target_level')
          .eq('id', user.id)
          .single()
        if (prof?.target_level) lvl = levelFromValue(prof.target_level)
      }
      setUserLevel(lvl)
      const w = await pickWord()
      if (w) await generate(w, exerciseType, lvl)
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function pickWord(): Promise<Pick | null> {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    if (!wordMapRef.current) wordMapRef.current = await loadWordMap()
    const wordMap = wordMapRef.current

    const { data } = await supabase
      .from('user_words')
      .select('word_id')
      .eq('user_id', user.id)
      .limit(500)

    const rows = (data ?? []) as unknown as { word_id: string }[]
    if (rows.length === 0) {
      setNoWords(true)
      return null
    }
    setNoWords(false)
    const random = rows[Math.floor(Math.random() * rows.length)]
    const w = wordMap.get(random.word_id)
    if (!w) {
      setNoWords(true)
      return null
    }
    const pick: Pick = {
      spanish: w.spanish,
      definition_cn: w.definition_cn,
      level: w.level,
    }
    setWord(pick)
    return pick
  }

  async function generate(forWord: Pick, type: ExerciseType, lvl: Level) {
    setLoading(true)
    setError(null)
    setResult(null)
    setAnswer('')
    setPrompt(null)
    try {
      const res = await fetch('/api/ai/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: forWord.spanish,
          definitionCn: forWord.definition_cn,
          level: lvl,
          exerciseType: type,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '出题失败')
      setPrompt(data.prompt)
    } catch (e) {
      setError(e instanceof Error ? e.message : '出题失败')
    } finally {
      setLoading(false)
    }
  }

  async function changeType(t: ExerciseType) {
    setExerciseType(t)
    if (word) await generate(word, t, userLevel)
  }

  async function newWord() {
    const w = await pickWord()
    if (w) await generate(w, exerciseType, userLevel)
  }

  async function submit() {
    if (!prompt) return
    setGrading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userAnswer: answer }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '批改失败')
      setResult(data as GradeResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : '批改失败')
    } finally {
      setGrading(false)
    }
  }

  if (noWords) {
    return (
      <Card className="p-6 text-center">
        <div className="text-xl font-black">还没有可练习的单词</div>
        <p className="mt-2 text-sm text-bauhaus-muted">
          先去「词库」添加一些单词，再来做练习吧
        </p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => changeType(t.value)}
            className={
              'flex-1 rounded-sm border-2 px-2 py-2 text-sm font-black transition-colors ' +
              (exerciseType === t.value
                ? 'border-bauhaus-black bg-bauhaus-black text-white'
                : 'border-bauhaus-line bg-white text-bauhaus-muted hover:border-bauhaus-black')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {word && (
        <Card className="flex items-center justify-between p-4 shadow-none">
          <div>
            <div className="text-lg font-black">{word.spanish}</div>
            <div className="text-sm text-bauhaus-muted">{word.definition_cn}</div>
          </div>
          <LevelBadge level={word.level} />
        </Card>
      )}

      <Button
        variant="outline"
        onClick={newWord}
        disabled={loading}
        className="w-full"
      >
        换一个
      </Button>

      {loading && (
        <p className="py-4 text-center text-sm font-bold text-bauhaus-muted">
          正在出题…
        </p>
      )}

      {prompt && !loading && (
        <Card className="p-5">
          <h2 className="mb-3 font-black">题目</h2>
          <div className="flex items-start justify-between gap-2">
            <p className="whitespace-pre-line text-lg">{prompt}</p>
            {exerciseType === 'translate_es_zh' && <SpeakButton text={prompt} />}
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="在这里写下你的答案…"
            rows={4}
            className="mt-4 w-full rounded-sm border-2 border-bauhaus-black bg-white px-3 py-2 text-lg font-bold outline-none focus:border-bauhaus-blue"
          />
          <div className="mt-1 text-right text-xs font-bold text-bauhaus-muted">
            {answer.trim() !== '' ? `已输入 ${answer.trim().length} 字` : ''}
          </div>
          <Button
            className="mt-3 w-full"
            onClick={submit}
            disabled={grading || answer.trim() === ''}
          >
            {grading ? '批改中…' : '提交批改'}
          </Button>
        </Card>
      )}

      {error && (
        <Card className="border-bauhaus-red p-4">
          <p className="text-sm font-bold text-bauhaus-red">{error}</p>
        </Card>
      )}

      {result && (
        <Card className="overflow-hidden p-0">
          <div
            className={
              'px-4 py-3 text-lg font-black text-white ' +
              (result.correct ? 'bg-bauhaus-blue' : 'bg-bauhaus-red')
            }
          >
            {result.correct ? '✓ 正确' : '✗ 错误'}
          </div>
          <div className="p-5">
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {result.feedback}
            </p>
            {result.model_answer && (
              <div className="mt-3 rounded-sm bg-bauhaus-paper p-3">
                <div className="text-xs font-bold text-bauhaus-muted">参考答案</div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-lg font-bold">{result.model_answer}</span>
                  {exerciseType === 'translate_zh_es' && (
                    <SpeakButton text={result.model_answer} size={14} />
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
