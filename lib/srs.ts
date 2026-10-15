export const MAX_PROFICIENCY = 6

// 标准间隔：熟练度 0-6 → 下次复习天数（0=当天，6=已掌握约一年后再见）
const DAYS_BY_PROFICIENCY: number[] = [0, 1, 3, 7, 14, 30, 365]

/** 认识 → 熟练度 +1（封顶 6）；不认识 → 熟练度清 0 */
export function nextProficiency(current: number, correct: boolean): number {
  if (!correct) return 0
  return Math.min(MAX_PROFICIENCY, current + 1)
}

/** 根据熟练度计算下次复习时间 */
export function nextDueAt(proficiency: number): Date {
  const p = Math.max(0, Math.min(MAX_PROFICIENCY, proficiency))
  const days = DAYS_BY_PROFICIENCY[p]
  const d = new Date()
  if (days === 0) {
    // 当天：立即到期（尚未接触 / 刚忘记的词马上复习）
    return d
  }
  d.setDate(d.getDate() + days)
  d.setHours(4, 0, 0, 0)
  return d
}
