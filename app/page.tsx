import Link from 'next/link'
import { buttonStyles } from '@/components/ui/button'

const FEATURES = ['背单词', '例句理解', '造句翻译', '语法教程']

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bauhaus-paper">
      {/* Bauhaus 几何装饰 */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-bauhaus-yellow" />
      <div className="pointer-events-none absolute -left-20 top-40 h-36 w-36 rotate-45 bg-bauhaus-red" />
      <div className="pointer-events-none absolute bottom-24 right-12 h-32 w-32 rounded-full bg-bauhaus-blue" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-20 w-20 bg-bauhaus-black" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="flex items-center gap-3">
          <span className="inline-block h-6 w-6 rounded-full bg-bauhaus-red" />
          <h1 className="text-6xl font-black tracking-tight text-bauhaus-black">
            CAMINA
          </h1>
          <span className="inline-block h-6 w-6 rotate-45 bg-bauhaus-yellow" />
        </div>
        <p className="mt-4 text-lg text-bauhaus-muted">西语学习助手 · 陪你走好每一步</p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {FEATURES.map((f) => (
            <span
              key={f}
              className="border-2 border-bauhaus-black bg-bauhaus-card px-3 py-1 text-sm font-bold"
            >
              {f}
            </span>
          ))}
        </div>

        <div className="mt-14 flex w-full flex-col gap-4">
          <Link href="/palabras" className={buttonStyles('primary', 'lg')}>
            开始学习
          </Link>
          <div className="flex justify-center gap-8 text-sm font-bold text-bauhaus-ink">
            <Link href="/login" className="underline-offset-4 hover:underline">
              登录
            </Link>
            <Link href="/register" className="underline-offset-4 hover:underline">
              注册
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
