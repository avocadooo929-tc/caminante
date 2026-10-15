import type { ReactNode } from 'react'
import type { Level } from '@/lib/types'
import { LEVEL_LABELS, LEVEL_STYLE } from '@/lib/levels'
import { cn } from '@/lib/utils'

export function LevelBadge({
  level,
  className,
}: {
  level: Level
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-1.5 py-0.5 text-xs font-black',
        LEVEL_STYLE[level].badge,
        className
      )}
    >
      {level} · {LEVEL_LABELS[level]}
    </span>
  )
}

export function Tag({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border-2 border-bauhaus-black bg-bauhaus-paper px-2 py-0.5 text-xs font-bold',
        className
      )}
    >
      {children}
    </span>
  )
}

const POS_LABELS: Record<string, string> = {
  noun: '名词',
  verb: '动词',
  adjective: '形容词',
  adverb: '副词',
  pronoun: '代词',
  preposition: '介词',
  conjunction: '连词',
  interjection: '感叹词',
  article: '冠词',
}

export function PosTag({ pos }: { pos: string }) {
  return <Tag className="bg-bauhaus-card">{POS_LABELS[pos] ?? pos}</Tag>
}
