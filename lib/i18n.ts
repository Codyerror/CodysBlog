import zhCN from '../messages/zh-CN.json'
import en from '../messages/en.json'

export const locales = ['zh-CN', 'en'] as const
export const defaultLocale = 'zh-CN'

export const messages = {
  'zh-CN': zhCN,
  'en': en
} as const

export function getMessage(locale: string, key: string): string {
  return messages[locale as keyof typeof messages]?.[key] || key
}
