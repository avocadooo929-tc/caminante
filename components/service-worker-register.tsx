'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Service Worker 只在生产环境启用（本地 dev 会干扰热更新）
    if (process.env.NODE_ENV !== 'production') return
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 注册失败静默忽略
      })
    }
  }, [])

  return null
}
