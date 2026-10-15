'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { todayStr } from '@/lib/study'
import { Card } from './ui/card'

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function CheckinCalendar() {
  const [year, setYear] = useState(0)
  const [month, setMonth] = useState(0) // 0-based
  const [today, setToday] = useState('')
  const [ready, setReady] = useState(false)
  const [checkedDays, setCheckedDays] = useState<Set<string>>(new Set())

  useEffect(() => {
    const now = new Date()
    setYear(now.getFullYear())
    setMonth(now.getMonth())
    setToday(todayStr())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    loadMonth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, ready])

  async function loadMonth() {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const first = `${year}-${pad(month + 1)}-01`
    const last = `${year}-${pad(month + 1)}-${pad(daysInMonth)}`

    const { data } = await supabase
      .from('study_logs')
      .select('study_date')
      .eq('user_id', user.id)
      .gte('study_date', first)
      .lte('study_date', last)

    setCheckedDays(
      new Set(((data ?? []) as { study_date: string }[]).map((r) => r.study_date))
    )
  }

  function changeMonth(delta: number) {
    let m = month + delta
    let y = year
    if (m < 0) {
      m = 11
      y--
    } else if (m > 11) {
      m = 0
      y++
    }
    setMonth(m)
    setYear(y)
  }

  if (!ready) {
    return (
      <Card className="p-5">
        <div className="py-6 text-center text-sm text-bauhaus-muted">
          加载日历…
        </div>
      </Card>
    )
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // 周一=0

  const cells: (string | null)[] = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${pad(month + 1)}-${pad(d)}`)
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          className="h-8 w-8 rounded-sm border-2 border-bauhaus-black font-black hover:bg-bauhaus-paper"
        >
          ‹
        </button>
        <h3 className="font-black">
          {year} 年 {month + 1} 月
        </h3>
        <button
          type="button"
          onClick={() => changeMonth(1)}
          className="h-8 w-8 rounded-sm border-2 border-bauhaus-black font-black hover:bg-bauhaus-paper"
        >
          ›
        </button>
      </div>

      <div className="mt-3 text-xs font-bold text-bauhaus-muted">
        本月打卡 {checkedDays.size} 天
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-xs font-bold text-bauhaus-muted">
            {w}
          </div>
        ))}
        {cells.map((c, i) => {
          if (!c) return <div key={`e${i}`} />
          const day = Number(c.slice(-2))
          const checked = checkedDays.has(c)
          const isToday = c === today
          return (
            <div
              key={c}
              className={`flex h-8 items-center justify-center rounded-sm border-2 text-sm font-bold ${
                checked
                  ? 'border-bauhaus-black bg-bauhaus-blue text-white'
                  : 'border-bauhaus-line bg-white text-bauhaus-ink'
              } ${isToday ? 'ring-2 ring-bauhaus-yellow' : ''}`}
            >
              {day}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
