import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** 中文站显示「2026年11月4日」，英文站显示「Nov 4, 2026」。 */
export function formatDate(date: string | Date, locale: string = 'en') {
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return String(date)
  return format(
    value,
    locale === 'zh-CN' ? 'yyyy年M月d日' : 'MMM d, yyyy',
    { locale: locale === 'zh-CN' ? zhCN : enUS },
  )
}

/** 供文章 slug / 锚点使用：中文保留，空白转连字符，去掉标点。 */
export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
