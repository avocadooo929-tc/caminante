import Link from 'next/link'
import { Suspense } from 'react'
import { AuthForm } from '@/components/auth-form'
import { Card } from '@/components/ui/card'

export default function RegisterPage() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-black">注册</h1>
      <p className="mb-6 mt-1 text-sm text-bauhaus-muted">创建账号开始学习</p>
      <Suspense fallback={null}>
        <AuthForm mode="register" />
      </Suspense>
      <p className="mt-6 text-center text-sm text-bauhaus-muted">
        已有账号？{' '}
        <Link href="/login" className="font-bold text-bauhaus-black underline">
          登录
        </Link>
      </p>
    </Card>
  )
}
