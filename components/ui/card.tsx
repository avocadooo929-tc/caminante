import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-sm border-2 border-bauhaus-black bg-bauhaus-card shadow-[4px_4px_0_0_#141414]',
        className
      )}
      {...props}
    />
  )
}
