'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookIcon, LayersIcon, LibraryIcon, PencilIcon, UserIcon } from './icons'

const TABS = [
  { href: '/palabras', label: '单词', icon: BookIcon },
  { href: '/vocabulario', label: '词库', icon: LibraryIcon },
  { href: '/practica', label: '练习', icon: PencilIcon },
  { href: '/gramatica', label: '语法', icon: LayersIcon },
  { href: '/perfil', label: '我的', icon: UserIcon },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-bauhaus-black bg-bauhaus-card">
      <div className="mx-auto flex max-w-md">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-bold',
                active ? 'text-bauhaus-black' : 'text-bauhaus-muted'
              )}
            >
              <Icon size={22} />
              <span>{label}</span>
              <span
                className={cn(
                  'mt-0.5 h-1 w-6',
                  active ? 'bg-bauhaus-red' : 'bg-transparent'
                )}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
