'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { getMessage } from '@/lib/i18n'
import { usePathname } from 'next/navigation'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'en'

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="icon-btn relative overflow-hidden"
      aria-label={getMessage(locale, 'common.theme')}
      title={getMessage(locale, 'common.theme')}
    >
      <span
        className="absolute transition-all duration-500"
        style={{ transform: isDark ? 'translateY(0) rotate(0deg)' : 'translateY(-150%) rotate(-90deg)', opacity: isDark ? 1 : 0 }}
      >
        <Sun className="w-[18px] h-[18px]" />
      </span>
      <span
        className="absolute transition-all duration-500"
        style={{ transform: isDark ? 'translateY(150%) rotate(90deg)' : 'translateY(0) rotate(0deg)', opacity: isDark ? 0 : 1 }}
      >
        <Moon className="w-[18px] h-[18px]" />
      </span>
      {!mounted && <Moon className="w-[18px] h-[18px] opacity-0" />}
    </button>
  )
}
