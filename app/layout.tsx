import type { Metadata, Viewport } from 'next'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
import './globals.css'

export const metadata: Metadata = {
  title: 'Camina · 西语学习助手',
  description: '背单词、例句理解、造句翻译与语法教程，辅助学习西班牙语。',
  applicationName: 'Camina',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Camina',
  },
}

export const viewport: Viewport = {
  themeColor: '#141414',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  )
}
