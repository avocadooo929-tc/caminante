'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Level } from '@/lib/types'
import { levelFromValue } from '@/lib/levels'
import { LevelPicker } from '@/components/level-picker'
import { LearningProgress } from '@/components/learning-progress'
import { CheckinCalendar } from '@/components/checkin-calendar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PerfilPage() {
  const [email, setEmail] = useState('')
  const [level, setLevel] = useState<Level>('A1')
  const [dailyGoal, setDailyGoal] = useState(20)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      const { data } = await supabase
        .from('profiles')
        .select('target_level, daily_goal')
        .eq('id', user.id)
        .single()
      if (data?.target_level) setLevel(levelFromValue(data.target_level))
      if (data?.daily_goal != null) setDailyGoal(data.daily_goal)
    }
    load()
  }, [])

  async function onLevelChange(l: Level) {
    setLevel(l)
    setSaved(false)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ target_level: l }).eq('id', user.id)
    setSaved(true)
  }

  async function onGoalChange(g: number) {
    setDailyGoal(g)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('profiles').update({ daily_goal: g }).eq('id', user.id)
  }

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-6">
        <h1 className="text-xl font-black">个人信息</h1>
        <p className="mt-2 break-all text-sm text-bauhaus-muted">{email}</p>
      </Card>

      <LearningProgress />
      <CheckinCalendar />

      <Card className="p-6">
        <h2 className="mb-1 font-black">每日学习目标</h2>
        <p className="mb-3 text-sm text-bauhaus-muted">每天想学多少个新词</p>
        <div className="flex gap-2">
          {[10, 20, 30, 50].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => onGoalChange(g)}
              className={`flex-1 rounded-sm border-2 px-2 py-2 text-sm font-black ${
                dailyGoal === g
                  ? 'border-bauhaus-black bg-bauhaus-black text-white'
                  : 'border-bauhaus-line bg-white text-bauhaus-muted'
              }`}
            >
              {g} 词
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-1 font-black">我的水平（CEFR）</h2>
        <p className="mb-4 text-sm text-bauhaus-muted">
          例句与练习会按这个难度生成
        </p>
        <LevelPicker value={level} onChange={onLevelChange} />
        {saved && (
          <p className="mt-2 text-sm font-bold text-bauhaus-blue">已保存 ✓</p>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="mb-3 font-black">关于</h2>
        <p className="text-sm leading-relaxed text-bauhaus-muted">
          Camina（西语「走」）是一个辅助学习西班牙语的 PWA。
          背单词 · 例句理解 · 造句翻译 · 语法教程。
        </p>
      </Card>

      <Button variant="outline" onClick={logout}>
        退出登录
      </Button>
    </div>
  )
}
