'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { GrammarLesson } from '@/lib/types'
import { gradeGrammar } from '@/lib/grammar-grade'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LevelBadge } from '@/components/ui/badge'

interface GrammarExercise {
  id: string
  prompt: string
  answer: string | null
  order_index: number
}

export function LessonDetail({ id }: { id: string }) {
  const [lesson, setLesson] = useState<GrammarLesson | null>(null)
  const [exercises, setExercises] = useState<GrammarExercise[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Record<string, boolean>>({})
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const [l, e, att] = await Promise.all([
        supabase.from('grammar_lessons').select('*').eq('id', id).single(),
        supabase
          .from('grammar_exercises')
          .select('id, prompt, answer, order_index')
          .eq('lesson_id', id)
          .order('order_index', { ascending: true }),
        user
          ? supabase
              .from('grammar_attempts')
              .select('exercise_id')
              .eq('user_id', user.id)
              .eq('correct', true)
          : Promise.resolve({ data: null }),
      ])

      setLesson((l.data as GrammarLesson) ?? null)
      setExercises((e.data as GrammarExercise[]) ?? [])
      setDoneIds(
        new Set(
          ((att.data ?? []) as { exercise_id: string }[]).map((r) => r.exercise_id)
        )
      )
    }
    load()
  }, [id])

  async function submit(ex: GrammarExercise) {
    const answer = (answers[ex.id] ?? '').trim()
    if (!answer || !ex.answer) return

    const correct = gradeGrammar(answer, ex.answer)
    setResults((prev) => ({ ...prev, [ex.id]: correct }))
    if (correct) setDoneIds((prev) => new Set(prev).add(ex.id))

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('grammar_attempts').insert({
        user_id: user.id,
        exercise_id: ex.id,
        user_answer: answer,
        correct,
      })
    }
  }

  if (!lesson) {
    return <p className="py-10 text-center text-bauhaus-muted">加载中…</p>
  }

  const doneCount = exercises.filter((e) => doneIds.has(e.id)).length
  const allDone = exercises.length > 0 && doneCount === exercises.length

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/gramatica"
        className="text-sm font-bold text-bauhaus-muted underline-offset-4 hover:underline"
      >
        ← 返回语法
      </Link>

      <Card className="p-6">
        {lesson.part_title && (
          <div className="text-xs font-bold text-bauhaus-muted">
            {lesson.part_title}
            {lesson.chapter_no != null ? ` · 第 ${lesson.chapter_no} 章` : ''}
          </div>
        )}
        <div className="mt-2">
          <LevelBadge level={lesson.level} />
        </div>
        <h1 className="mt-3 text-2xl font-black">{lesson.title}</h1>
      </Card>

      {lesson.subtopics && (
        <Card className="p-6">
          <h2 className="mb-3 font-black">本节内容</h2>
          <ul className="flex flex-col gap-1.5">
            {lesson.subtopics
              .split('\n')
              .filter(Boolean)
              .map((s, i) => (
                <li key={i} className="flex gap-2 text-sm font-bold">
                  <span className="text-bauhaus-muted">{i + 1}.</span>
                  <span>{s}</span>
                </li>
              ))}
          </ul>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="mb-3 font-black">讲解</h2>
        {lesson.explanation_cn ? (
          <p className="whitespace-pre-line text-base leading-relaxed">
            {lesson.explanation_cn}
          </p>
        ) : (
          <p className="text-sm text-bauhaus-muted">本节讲解整理中，敬请期待。</p>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-black">练习</h2>
          <span className="text-xs font-bold text-bauhaus-muted">
            已完成 {doneCount} / {exercises.length}
          </span>
        </div>

        {allDone && (
          <div className="mt-3 rounded-sm bg-bauhaus-blue px-4 py-3 text-center font-black text-white">
            ✓ 本语法点已全部掌握
          </div>
        )}

        {exercises.length === 0 ? (
          <p className="mt-3 text-sm text-bauhaus-muted">
            本课配套练习整理中，敬请期待。
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {exercises.map((ex, i) => {
              const done = doneIds.has(ex.id)
              const result = results[ex.id]
              return (
                <div
                  key={ex.id}
                  className="rounded-sm border-2 border-bauhaus-line bg-bauhaus-paper p-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-bold text-bauhaus-muted">
                      {i + 1}.
                    </span>
                    <span className="text-sm font-bold">{ex.prompt}</span>
                    {done && (
                      <span className="ml-auto shrink-0 rounded-sm bg-bauhaus-blue px-1.5 py-0.5 text-[10px] font-black text-white">
                        已掌握
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex gap-2">
                    <input
                      value={answers[ex.id] ?? ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submit(ex)
                      }}
                      placeholder="输入你的答案"
                      className="h-10 flex-1 rounded-sm border-2 border-bauhaus-black bg-white px-3 outline-none focus:border-bauhaus-blue"
                    />
                    <Button size="sm" onClick={() => submit(ex)}>
                      提交
                    </Button>
                  </div>

                  {result !== undefined && (
                    <div className="mt-2 text-sm font-bold">
                      {result ? (
                        <span className="text-bauhaus-blue">✓ 正确</span>
                      ) : (
                        <span className="text-bauhaus-red">
                          ✗ 错误 · 参考答案：{ex.answer}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Card>
    </div>
  )
}
