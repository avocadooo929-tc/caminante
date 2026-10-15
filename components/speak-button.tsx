'use client'

import { useState, type SyntheticEvent } from 'react'
import { cn } from '@/lib/utils'

/** 播放西班牙语发音（用浏览器自带语音合成，免费离线，无需 API key） */
export function SpeakButton({
  text,
  className,
  size = 16,
}: {
  text: string
  className?: string
  size?: number
}) {
  const [speaking, setSpeaking] = useState(false)

  function speak(e: SyntheticEvent) {
    // 阻止点击冒泡，避免触发父级卡片的翻面/跳转
    e.preventDefault()
    e.stopPropagation()
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-ES'
    u.rate = 0.9
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(u)
  }

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={`播放 ${text} 的发音`}
      title="播放发音"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-sm border-2 border-bauhaus-black leading-none transition-colors',
        speaking
          ? 'bg-bauhaus-yellow'
          : 'bg-white hover:bg-bauhaus-paper',
        className
      )}
      style={{ width: size + 12, height: size + 12 }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  )
}
