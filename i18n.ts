/**
 * 兼容旧路径：以前部分组件从 `@/i18n` 引入。
 * 真正的实现统一放在 lib/i18n.ts，避免两份语言包逻辑不一致。
 */
export { locales, defaultLocale, messages, getMessage, getDictionary, isLocale } from './lib/i18n'
export type { Locale } from './lib/i18n'
