import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bauhaus-paper px-6">
      <div className="w-full max-w-sm">{children}</div>
      <Link
        href="/"
        className="mt-8 text-sm font-bold text-bauhaus-muted underline-offset-4 hover:underline"
      >
        ← 返回首页
      </Link>
    </main>
  )
}
