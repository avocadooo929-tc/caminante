'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Level } from '@/lib/types'
import { LEVELS, LEVEL_STYLE } from '@/lib/levels'
import { loadWordMap } from '@/lib/manual-words'
import { Card } from './ui/card'

interface Row {
  proficiency: number
  word_id: string
}

const EMPTY_LEVEL: Record<Level, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0 }

const PROF_LABELS = ['未学', '1', '2', '3', '4', '5', '掌握']

export function LearningProgress() {
  const [total, setTotal] = useState(0)
  const [known, setKnown] = useState(0) // 熟练度 6 = 完全掌握
  const [profDist, setProfDist] = useState<number[]>([0, 0, 0, 0, 0, 0, 0])
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
          .select('proficiency, word_id')
          .eq('user_id', user.id)
          .range(from, from + 999)
        const page = (data ?? []) as unknown as Row[]
        rows.push(...page)
        if (page.length < 1000) break
      }

      const dist = [0, 0, 0, 0, 0, 0, 0]
      const lvl: Record<Level, number> = { ...EMPTY_LEVEL }
      let knownCount = 0
      for (const r of rows) {
        const p = Math.max(0, Math.min(6, r.proficiency))
        dist[p]++
        if (p >= 6) knownCount++
        const l = wordMap.get(r.word_id)?.level
        if (l && l in lvl) lvl[l]++
      }

      setTotal(rows.length)
      setKnown(knownCount)
      setProfDist(dist)
      setPerLevel(lvl)
    }
    load()
  }, [])

  const pct = total > 0 ? Math.round((known / total) * 100) : 0
  const maxProf = Math.max(1, ...profDist)
  const maxLevel = Math.max(1, ...LEVELS.map((l) => perLevel[l] ?? 0))

  return (
    <Card className="p-6">
      <h2 className="font-black">学习成果</h2>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-xs font-bold text-bauhaus-muted">已掌握</div>
          <div className="text-4xl font-black text-bauhaus-blue">{known}</div>
        </div>
        <div className="text-sm font-bold text-bauhaus-muted">
          共 {total} 词
        </div>
      </div>

      <div className="mt-3 h-4 w-full overflow-hidden rounded-sm border-2 border-bauhaus-black bg-white">
        <div className="h-full bg-bauhaus-blue" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-right text-xs font-bold text-bauhaus-muted">
        {pct}% 掌握
      </div>

      <div className="mt-5">
        <div className="mb-2 text-xs font-bold text-bauhaus-muted">
          熟练度分布
        </div>
        <div className="flex flex-col gap-1.5">
          {profDist.map((count, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-8 text-xs font-black">{PROF_LABELS[i]}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-sm border-2 border-bauhaus-line bg-white">
                <div
                  className="h-full bg-bauhaus-blue"
                  style={{ width: `${(count / maxProf) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-bold text-bauhaus-muted">
                {count}
              </span>
            </div>
          ))}
        </div>
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
