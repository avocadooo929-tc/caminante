import { createClient } from './supabase/client'

export function todayStr(): string {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** 记录当日学习量：added=新增单词数，reviewed=复习次数 */
export async function logStudy(delta: { added?: number; reviewed?: number }) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const date = todayStr()
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
