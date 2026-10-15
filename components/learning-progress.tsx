'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Level } from '@/lib/types'
import { LEVELS, LEVEL_STYLE } from '@/lib/levels'
import { loadWordMap } from '@/lib/manual-words'
import { Card } from './ui/card'

interface Row {
  status: string
  due_at: string
  word_id: string
}

const EMPTY_LEVEL: Record<Level, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 }

export function LearningProgress() {
  const [stats, setStats] = useState({
    total: 0,
    known: 0,
    learning: 0,
    fresh: 0,
    due: 0,
  })
  const [perLevel, setPerLevel] = useState<Record<Level, number>>(EMPTY_LEVEL)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const wordMap = await loadWordMap()

      // 分页拉取（Supabase 单次最多 1000 行）
      const rows: Row[] = []
      for (let from = 0; ; from += 1000) {
        const { data } = await supabase
          .from('user_words')
          .select('status, due_at, word_id')
          .eq('user_id', user.id)
          .range(from, from + 999)
        const page = (data ?? []) as unknown as Row[]
        rows.push(...page)
        if (page.length < 1000) break
      }

      const now = new Date().toISOString()
      let known = 0
      let learning = 0
      let fresh = 0
      let due = 0
      const lvl: Record<Level, number> = { ...EMPTY_LEVEL }

      for (const r of rows) {
        if (r.status === 'known') known++
        else if (r.status === 'learning') learning++
        else fresh++
        if (r.due_at <= now) due++
        const l = wordMap.get(r.word_id)?.level
        if (l && l in lvl) lvl[l]++
      }

      setStats({ total: rows.length, known, learning, fresh, due })
      setPerLevel(lvl)
    }
    load()
  }, [])

  const pct = stats.total > 0 ? Math.round((stats.known / stats.total) * 100) : 0
  const maxLevel = Math.max(1, ...LEVELS.map((l) => perLevel[l] ?? 0))

  return (
    <Card className="p-6">
      <h2 className="font-black">学习进度</h2>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-xs font-bold text-bauhaus-muted">已掌握</div>
          <div className="text-4xl font-black text-bauhaus-blue">{stats.known}</div>
        </div>
        <div className="text-sm font-bold text-bauhaus-muted">
          共 {stats.total} 词
        </div>
      </div>

      <div className="mt-3 h-4 w-full overflow-hidden rounded-sm border-2 border-bauhaus-black bg-white">
        <div className="h-full bg-bauhaus-blue" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-right text-xs font-bold text-bauhaus-muted">
        {pct}% 掌握
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { label: '学习中', value: stats.learning, color: 'text-bauhaus-yellow' },
          { label: '新词', value: stats.fresh, color: 'text-bauhaus-muted' },
          { label: '待复习', value: stats.due, color: 'text-bauhaus-red' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-sm border-2 border-bauhaus-line p-2"
          >
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs font-bold text-bauhaus-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs font-bold text-bauhaus-muted">
          词库等级分布
        </div>
        <div className="flex flex-col gap-1.5">
          {LEVELS.map((l) => {
            const count = perLevel[l] ?? 0
            return (
              <div key={l} className="flex items-center gap-2">
                <span className="w-8 text-sm font-black">{l}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-sm border-2 border-bauhaus-line bg-white">
                  <div
                    className={`h-full ${LEVEL_STYLE[l].dot}`}
                    style={{ width: `${(count / maxLevel) * 100}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-bold text-bauhaus-muted">
                  {count}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
