'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { todayStr } from '@/lib/study'
import { Card } from './ui/card'

export function DailyProgress({ refreshKey = 0 }: { refreshKey?: number }) {
  const [goal, setGoal] = useState(20)
  const [added, setAdded] = useState(0)
  const [reviewed, setReviewed] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const [profRes, logRes] = await Promise.all([
        supabase.from('profiles').select('daily_goal').eq('id', user.id).single(),
        supabase
          .from('study_logs')
          .select('words_added, words_reviewed')
          .eq('user_id', user.id)
          .eq('study_date', todayStr())
          .maybeSingle(),
      ])

      if (profRes.data?.daily_goal != null) setGoal(profRes.data.daily_goal)
      setAdded(logRes.data?.words_added ?? 0)
      setReviewed(logRes.data?.words_reviewed ?? 0)
    }
    load()
  }, [refreshKey])

  const pct = goal > 0 ? Math.min(100, Math.round((added / goal) * 100)) : 0

  return (
    <Card className="p-4 shadow-none">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black">今日学习</span>
        <span className="text-xs font-bold text-bauhaus-muted">
          新学 {added} / {goal} 词
        </span>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-sm border-2 border-bauhaus-black bg-white">
        <div className="h-full bg-bauhaus-blue" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 text-xs font-bold text-bauhaus-muted">
        今日复习 {reviewed} 次
      </div>
    </Card>
  )
}
