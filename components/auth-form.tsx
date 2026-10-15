'use client'

import { useState, type SyntheticEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  async function onSubmit(e: SyntheticEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)

    try {
      const supabase = createClient()
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setError(error.message)
          return
        }
        const next = searchParams.get('next')
        router.replace(next && next.startsWith('/') ? next : '/palabras')
        router.refresh()
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setError(error.message)
          return
        }
        if (data.session) {
          router.replace('/palabras')
          router.refresh()
        } else {
          setInfo('注册成功！请前往邮箱查收确认邮件后再登录。')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-bold">
        邮箱
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tú@example.com"
          className="h-11 rounded-sm border-2 border-bauhaus-black bg-bauhaus-paper px-3 outline-none focus:bg-white"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-bold">
        密码
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="至少 6 位"
          className="h-11 rounded-sm border-2 border-bauhaus-black bg-bauhaus-paper px-3 outline-none focus:bg-white"
        />
      </label>

      {error && <p className="text-sm font-bold text-bauhaus-red">{error}</p>}
      {info && <p className="text-sm font-bold text-bauhaus-blue">{info}</p>}

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? '处理中…' : mode === 'login' ? '登录' : '注册'}
      </Button>
    </form>
  )
}
