import { Suspense } from 'react'
import { AppHeader } from '@/components/app-header'
import { AppNav } from '@/components/app-nav'

// 本组页面均为客户端取数，关闭 Cache Components 的静态壳校验
export const instant = false

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bauhaus-paper pb-24">
      <AppHeader />
      <main className="mx-auto max-w-md px-4 py-6">{children}</main>
      <Suspense fallback={null}>
        <AppNav />
      </Suspense>
    </div>
  )
}
