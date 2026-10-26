'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { GrammarLesson } from '@/lib/types'
import { getGrammarProgress, type LessonProgress } from '@/lib/grammar-progress'
import { Card } from '@/components/ui/card'
import { LevelBadge } from '@/components/ui/badge'

interface PartGroup {
  partNo: number
  partTitle: string
  items: GrammarLesson[]
}

export default function GramaticaPage() {
  const [lessons, setLessons] = useState<GrammarLesson[]>([])
  const [progress, setProgress] = useState<Map<string, LessonProgress>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [lessonRes, prog] = await Promise.all([
        supabase.from('grammar_lessons').select('*').order('order_index', { ascending: true }),
        getGrammarProgress(),
      ])
      setLessons((lessonRes.data as GrammarLesson[]) ?? [])
      setProgress(new Map(prog.map((p) => [p.lessonId, p])))
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return <p className="py-10 text-center text-bauhaus-muted">加载中…</p>
  }

  const parts: PartGroup[] = []
  for (const l of lessons) {
    const pn = l.part_no ?? 0
    const last = parts[parts.length - 1]
    if (last && last.partNo === pn) last.items.push(l)
    else parts.push({ partNo: pn, partTitle: l.part_title ?? '', items: [l] })
  }

  return (
    <div className="flex flex-col gap-6">
      {parts.map((p) => (
        <div key={p.partNo}>
          <div className="mb-3 border-l-4 border-bauhaus-black pl-3">
            <div className="font-black">{p.partTitle}</div>
            <div className="text-xs font-bold text-bauhaus-muted">
              {p.items.length} 章
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {p.items.map((l) => {
              const prog = progress.get(l.id)
              const done = prog?.done ?? false
              return (
                <Link key={l.id} href={`/gramatica/${l.id}`}>
                  <Card className="flex items-center justify-between gap-3 p-4 shadow-none hover:bg-bauhaus-paper">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {l.chapter_no != null && (
                            <span className="mr-2 text-bauhaus-muted">
                              {l.chapter_no}.
                            </span>
                          )}
                          {l.title}
                        </span>
                        {done && (
                          <span className="shrink-0 rounded-sm bg-bauhaus-blue px-1.5 py-0.5 text-[10px] font-black text-white">
                            ✓ 已掌握
                          </span>
                        )}
                      </div>
                      {l.subtopics && (
                        <div className="mt-0.5 truncate text-xs text-bauhaus-muted">
                          {l.subtopics.split('\n').filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                    <LevelBadge level={l.level} />
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
