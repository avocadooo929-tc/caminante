export interface SrsState {
  easeFactor: number
  intervalDays: number
  correctCount: number
}

export const DEFAULT_EASE = 2.5
export const MIN_EASE = 1.3

/**
 * SM-2 间隔重复算法。
 * @param quality 0-5：>=3 表示记得，<3 表示忘记。我们用 4=认识、2=不认识。
 */
export function review(current: SrsState, quality: number): SrsState {
  const q = Math.max(0, Math.min(5, quality))
  let { easeFactor, intervalDays, correctCount } = current

  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  if (easeFactor < MIN_EASE) easeFactor = MIN_EASE

  if (q < 3) {
    correctCount = 0
    intervalDays = 0 // 忘记的单词稍后/当天再次出现
  } else {
    correctCount += 1
    if (correctCount === 1) intervalDays = 1
    else if (correctCount === 2) intervalDays = 3
    else intervalDays = Math.max(1, Math.round(intervalDays * easeFactor))
  }

  return { easeFactor, intervalDays, correctCount }
}

export function nextDueAt(intervalDays: number): Date {
  const d = new Date()
  if (intervalDays <= 0) {
    // 忘记的词：10 分钟后再次复习
    d.setMinutes(d.getMinutes() + 10)
  } else {
    d.setDate(d.getDate() + intervalDays)
    d.setHours(4, 0, 0, 0)
  }
  return d
}
