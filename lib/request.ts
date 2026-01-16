import { getRequestConfig } from 'next-intl/server'
import { locales } from '@/i18n'

export default getRequestConfig(async ({ locale }) => {
  const localeValue = locale || 'zh-CN'
  return {
    locale: localeValue,
    messages: (await import(`@/messages/${localeValue}.json`)).default,
    timeZone: 'Asia/Shanghai',
    now: new Date()
  }
})
