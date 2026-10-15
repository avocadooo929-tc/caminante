'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { GrammarLesson, Level } from '@/lib/types'
import { LEVELS, LEVEL_LABELS } from '@/lib/levels'
import { Card } from '@/components/ui/card'
import { LevelBadge } from '@/components/ui/badge'

export default function GramaticaPage() {
  const [lessons, setLessons] = useState<GrammarLesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    createClient()
      .from('grammar_lessons')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data }) => {
        setLessons((data as GrammarLesson[]) ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="py-10 text-center text-bauhaus-muted">加载中…</p>
  }

  return (
    <div className="flex flex-col gap-6">
      {LEVELS.map((lvl) => {
        const items = lessons.filter((l) => l.level === lvl)
        if (items.length === 0) return null
        return (
          <div key={lvl}>
            <div className="mb-3 flex items-center gap-2">
              <LevelBadge level={lvl} />
              <span className="text-xs font-bold text-bauhaus-muted">
                {items.length} 个语法点
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {items.map((l) => (
                <Link key={l.id} href={`/gramatica/${l.id}`}>
                  <Card className="flex items-center justify-between p-4 shadow-none hover:bg-bauhaus-paper">
                    <span className="font-bold">{l.title}</span>
                    <span className="text-xs font-bold text-bauhaus-muted">
                      {LEVEL_LABELS[lvl]}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
