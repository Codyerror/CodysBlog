'use client'

import { useRouter, usePathname } from 'next/navigation'
import { locales, defaultLocale, isLocale, getMessage } from '@/lib/i18n'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = isLocale(pathname.split('/')[1]) ? pathname.split('/')[1] : defaultLocale

  const handleChange = (next: string) => {
    if (next === currentLocale) return
    const rest = pathname.replace(/^\/(zh-CN|en)(?=\/|$)/, '')
    router.push(`/${next}${rest || ''}`)
  }

  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-xl border border-line bg-surface/60"
      role="group"
      aria-label={getMessage(currentLocale, 'common.language')}
    >
      {locales.map((loc) => {
        const active = loc === currentLocale
        return (
          <button
            key={loc}
            onClick={() => handleChange(loc)}
            aria-pressed={active}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
              active ? 'bg-brandsoft text-brandstrong shadow-sm' : 'text-muted hover:text-brand'
            }`}
          >
            {loc === 'zh-CN' ? '中' : 'EN'}
          </button>
        )
      })}
    </div>
  )
}
