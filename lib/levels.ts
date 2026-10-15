import type { Level } from './types'

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export const LEVEL_LABELS: Record<Level, string> = {
  A1: '入门',
  A2: '基础',
  B1: '进阶',
  B2: '中高级',
  C1: '高级',
}

/** 每个等级对应的徽章/圆点配色（Tailwind 任意值，避免额外配置） */
export const LEVEL_STYLE: Record<Level, { badge: string; dot: string }> = {
  A1: { badge: 'bg-[#2a9d8f] text-white', dot: 'bg-[#2a9d8f]' },
  A2: { badge: 'bg-[#4c9a2a] text-white', dot: 'bg-[#4c9a2a]' },
  B1: { badge: 'bg-[#f2a63c] text-black', dot: 'bg-[#f2a63c]' },
  B2: { badge: 'bg-[#e6772e] text-white', dot: 'bg-[#e6772e]' },
  C1: { badge: 'bg-[#e63946] text-white', dot: 'bg-[#e63946]' },
}

export function isLevel(value: unknown): value is Level {
  return typeof value === 'string' && (LEVELS as string[]).includes(value)
}

export function levelFromValue(value: string | null | undefined): Level {
  return isLevel(value) ? value : 'A1'
}

/** 等级顺序下标（A1=0 … C1=4），用于比较高低 */
export function levelIndex(level: Level): number {
  return LEVELS.indexOf(level)
}
