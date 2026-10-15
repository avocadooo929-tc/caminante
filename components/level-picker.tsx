'use client'

import type { Level } from '@/lib/types'
import { LEVELS, LEVEL_STYLE } from '@/lib/levels'
import { cn } from '@/lib/utils'

export function LevelPicker({
  value,
  onChange,
}: {
  value: Level
  onChange: (level: Level) => void
}) {
  return (
    <div className="flex gap-2">
      {LEVELS.map((l) => {
        const active = value === l
        return (
          <button
            key={l}
            type="button"
            onClick={() => onChange(l)}
            className={cn(
              'flex-1 rounded-sm border-2 px-2 py-1.5 text-sm font-black transition-colors',
              active
                ? cn('border-bauhaus-black', LEVEL_STYLE[l].badge)
                : 'border-bauhaus-line bg-white text-bauhaus-muted hover:border-bauhaus-black'
            )}
          >
            {l}
          </button>
        )
      })}
    </div>
  )
}
