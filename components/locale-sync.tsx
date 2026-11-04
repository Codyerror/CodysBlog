'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** 让 <html lang> 跟随当前语言，利于屏幕阅读器与搜索引擎。 */
export function LocaleSync() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  useEffect(() => {
    if (locale === 'zh-CN' || locale === 'en') {
      document.documentElement.lang = locale
    }
  }, [locale])

  return null
}
