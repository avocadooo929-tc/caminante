import Link from 'next/link'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth-form'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-black">登录</h1>
      <p className="mb-6 mt-1 text-sm text-bauhaus-muted">欢迎回来</p>
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
      <p className="mt-6 text-center text-sm text-bauhaus-muted">
        还没有账号？{' '}
        <Link href="/register" className="font-bold text-bauhaus-black underline">
          注册
        </Link>
      </p>
    </Card>
  )
}
