'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { studyDateStr } from '@/lib/study'
import { Card } from './ui/card'

export function DailyProgress({ refreshKey = 0 }: { refreshKey?: number }) {
  const [newCount, setNewCount] = useState(0) // 待新学
  const [reviewCount, setReviewCount] = useState(0) // 待复习
  const [learned, setLearned] = useState(0) // 已学习

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const now = new Date().toISOString()
      const [newRes, reviewRes, logRes] = await Promise.all([
        supabase
          .from('user_words')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('proficiency', 0)
          .lte('due_at', now),
        supabase
          .from('user_words')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('proficiency', 1)
          .lte('due_at', now),
        supabase
          .from('study_logs')
          .select('words_reviewed')
          .eq('user_id', user.id)
          .eq('study_date', studyDateStr())
          .maybeSingle(),
      ])

      setNewCount(newRes.count ?? 0)
      setReviewCount(reviewRes.count ?? 0)
      setLearned(logRes.data?.words_reviewed ?? 0)
    }
    load()
  }, [refreshKey])

  const remaining = newCount + reviewCount

  return (
    <Card className="p-4 shadow-none">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black">今日学习</span>
        <span className="text-xs font-bold text-bauhaus-muted">
          {remaining === 0 ? '已完成 ✓' : `还剩 ${remaining} 词`}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          { label: '待新学', value: newCount, color: 'text-bauhaus-red' },
          { label: '待复习', value: reviewCount, color: 'text-bauhaus-yellow' },
          { label: '已学习', value: learned, color: 'text-bauhaus-blue' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-sm border-2 border-bauhaus-line p-2"
          >
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs font-bold text-bauhaus-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
