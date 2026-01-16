'use client'
import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'
import { getMessage } from '@/lib/i18n'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || 'zh-CN'
  const t = (key: string) => getMessage(locale, key)
  
  return (
    <header className="border-b bg-background sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          CodyInsight
        </Link>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/blog`} className="hover:text-primary transition-colors">
            {t('nav.blog')}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-primary transition-colors">
            {t('nav.about')}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
