import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { zhCN, enUS } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, locale: string = 'zh-CN') {
  return format(new Date(date), 'yyyy年MM月dd日', {
    locale: locale === 'zh-CN' ? zhCN : enUS
  })
}
