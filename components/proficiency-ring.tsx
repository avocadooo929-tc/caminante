'use client'

import { useEffect, useRef, useState } from 'react'

const CENTER = 60
const RING_R = 34
const HEX_R = 14

/** 第 i 个六边形的顶点（顺时针从顶部开始，顶点朝向圆心，构成环形蜂窝） */
function hexPoints(i: number): string {
  const theta = (-90 + i * 60) * (Math.PI / 180)
  const cx = CENTER + RING_R * Math.cos(theta)
  const cy = CENTER + RING_R * Math.sin(theta)
  const rot = theta + Math.PI // 让一个顶点指向圆心
  const pts: string[] = []
  for (let k = 0; k < 6; k++) {
    const a = rot + (k * Math.PI) / 3
    pts.push(`${(cx + HEX_R * Math.cos(a)).toFixed(2)},${(cy + HEX_R * Math.sin(a)).toFixed(2)}`)
  }
  return pts.join(' ')
}

/** 六边形环形熟练度：顺时针渐次点亮；熟练度增加时新六边形有弹出动效 */
export function ProficiencyRing({
  proficiency,
  className = '',
}: {
  proficiency: number
  className?: string
}) {
  const prevRef = useRef(proficiency)
  const [popIndex, setPopIndex] = useState<number | null>(null)

  useEffect(() => {
    const prev = prevRef.current
    if (proficiency > prev) {
      setPopIndex(proficiency - 1)
      const t = setTimeout(() => setPopIndex(null), 600)
      prevRef.current = proficiency
      return () => clearTimeout(t)
    }
    prevRef.current = proficiency
  }, [proficiency])

  const p = Math.max(0, Math.min(6, proficiency))

  return (
    <svg viewBox="0 0 120 120" className={className} aria-label={`熟练度 ${p}/6`}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const lit = i < p
        const cls =
          'pfx-hex' +
          (lit ? ' pfx-hex--lit' : '') +
          (lit && i === popIndex ? ' pfx-hex--pop' : '')
        return <polygon key={i} points={hexPoints(i)} className={cls} />
      })}
      <text x="60" y="60" textAnchor="middle" dominantBaseline="central" className="pfx-hex-text">
        {p}
      </text>
    </svg>
  )
}
