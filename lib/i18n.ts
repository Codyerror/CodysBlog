import zhCN from '../messages/zh-CN.json'
import en from '../messages/en.json'

/** 顺序决定语言切换器里的排列，也决定默认语言。 */
export const locales = ['en', 'zh-CN'] as const
export const defaultLocale = 'en'
export type Locale = (typeof locales)[number]

export const messages = {
  en: en,
  'zh-CN': zhCN,
} as const

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

/** 取整个语言包，供客户端组件直接读嵌套字段。 */
export function getDictionary(locale: string) {
  return messages[isLocale(locale) ? locale : defaultLocale]
}

/**
 * 支持点路径取值，例如 getMessage('en', 'nav.blog') -> 'Blog'。
 * 可选 vars 用来替换 {year} 之类的占位符。
 */
export function getMessage(
  locale: string,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const dict: unknown = messages[isLocale(locale) ? locale : defaultLocale]
  let value: unknown = dict

  for (const part of key.split('.')) {
    if (value === null || typeof value !== 'object') {
      value = undefined
      break
    }
    value = (value as Record<string, unknown>)[part]
  }

  if (typeof value !== 'string') return key

  let result: string = value
  if (vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      result = result.replaceAll(`{${name}}`, String(replacement))
    }
  }
  return result
}
