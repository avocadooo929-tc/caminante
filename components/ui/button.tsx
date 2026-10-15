import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm font-bold uppercase tracking-wide transition-all select-none'

const variants: Record<ButtonVariant, string> = {
  primary:
    'border-2 border-bauhaus-black bg-bauhaus-black text-white hover:bg-bauhaus-ink',
  secondary:
    'border-2 border-bauhaus-black bg-bauhaus-yellow text-bauhaus-black hover:brightness-95',
  outline:
    'border-2 border-bauhaus-black bg-transparent text-bauhaus-black hover:bg-bauhaus-black hover:text-white',
  ghost:
    'border-2 border-transparent bg-transparent text-bauhaus-ink hover:border-bauhaus-line',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-7 text-lg',
}

const shadow =
  'shadow-[4px_4px_0_0_#141414] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-50'

export function buttonStyles(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string
) {
  return cn(base, variants[variant], sizes[size], variant !== 'ghost' && shadow, extra)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonStyles(variant, size, className)} {...props} />
}
