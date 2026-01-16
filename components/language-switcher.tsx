'use client'
import { useRouter, usePathname } from 'next/navigation'
import { locales } from '@/i18n'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = pathname.split('/')[1] || 'zh-CN'
  
  const handleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
  }
  
  return (
    <select
      value={currentLocale}
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
