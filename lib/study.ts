import { createClient } from './supabase/client'

/** 真实日历日期（YYYY-MM-DD，用于日历「今天」高亮等） */
export function todayStr(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** 学习日（次日凌晨 3 点结算）：0-3 点仍算前一天 */
export function studyDateStr(now = new Date()): string {
  const d = new Date(now)
  if (d.getHours() < 3) d.setDate(d.getDate() - 1)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** 记录当日学习量：added=加入学习计划数，reviewed=认识（已学习）数 */
export async function logStudy(delta: { added?: number; reviewed?: number }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const date = studyDateStr()
  const { data: existing } = await supabase
    .from('study_logs')
    .select('words_added, words_reviewed')
    .eq('user_id', user.id)
    .eq('study_date', date)
    .maybeSingle()

  const words_added = (existing?.words_added ?? 0) + (delta.added ?? 0)
  const words_reviewed = (existing?.words_reviewed ?? 0) + (delta.reviewed ?? 0)

  await supabase
    .from('study_logs')
    .upsert(
      { user_id: user.id, study_date: date, words_added, words_reviewed },
      { onConflict: 'user_id,study_date' }
    )
}

/** 打卡：当日待新学 + 待复习清 0 后自动标记 */
export async function checkInToday() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const date = studyDateStr()
  await supabase
    .from('study_logs')
    .upsert(
      { user_id: user.id, study_date: date, checked: true },
      { onConflict: 'user_id,study_date' }
    )
}
