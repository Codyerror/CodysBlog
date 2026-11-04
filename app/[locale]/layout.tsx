import { locales } from '@/lib/i18n'

/** 让所有语言路由在构建时预生成静态 HTML，首屏更快、也利于收录。 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
