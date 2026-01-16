'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { locales } from '@/i18n'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleChange(e.target.value)}
      className="p-2 rounded-md border bg-transparent cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc === 'zh-CN' ? '中文' : 'English'}
        </option>
      ))}
    </select>
  )
}
