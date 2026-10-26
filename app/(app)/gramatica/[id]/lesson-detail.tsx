'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { GrammarLesson } from '@/lib/types'
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
  const [revealed, setRevealed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const supabase = createClient()
    Promise.all([
      supabase.from('grammar_lessons').select('*').eq('id', id).single(),
      supabase
        .from('grammar_exercises')
        .select('id, prompt, answer, order_index')
        .eq('lesson_id', id)
        .order('order_index', { ascending: true }),
    ]).then(([l, e]) => {
      setLesson((l.data as GrammarLesson) ?? null)
      setExercises((e.data as GrammarExercise[]) ?? [])
    })
  }, [id])

  function toggle(exId: string) {
    setRevealed((s) => {
      const next = new Set(s)
      if (next.has(exId)) next.delete(exId)
      else next.add(exId)
      return next
    })
  }

  if (!lesson) {
    return <p className="py-10 text-center text-bauhaus-muted">加载中…</p>
  }

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
        <h2 className="mb-3 font-black">练习</h2>
        {exercises.length === 0 ? (
          <p className="text-sm text-bauhaus-muted">
            本课配套练习整理中，敬请期待。
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {exercises.map((ex, i) => (
              <div key={ex.id} className="rounded-sm border-2 border-bauhaus-line bg-bauhaus-paper p-3">
                <div className="text-sm font-bold">
                  {i + 1}. {ex.prompt}
                </div>
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggle(ex.id)}
                  >
                    {revealed.has(ex.id) ? '隐藏答案' : '显示答案'}
                  </Button>
                  {revealed.has(ex.id) && (
                    <div className="mt-2 text-base font-black text-bauhaus-blue">
                      {ex.answer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
