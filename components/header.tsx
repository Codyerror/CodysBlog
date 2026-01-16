import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()

  return (
    <header className="border-b bg-background sticky top-0 z-10 backdrop-blur-sm bg-opacity-90">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href={`/${locale}`} className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          CodyInsight
        </Link>
        <div className="flex items-center gap-4">
          <Link href={`/${locale}/blog`} className="hover:text-primary transition-colors">
            {t('blog')}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-primary transition-colors">
            {t('about')}
          </Link>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
