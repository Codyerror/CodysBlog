'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import { LanguageSwitcher } from './language-switcher'
import { CatFace, CatPaw } from './cats'
import { getMessage, defaultLocale, isLocale } from '@/lib/i18n'
import { siteConfig } from '@/lib/site-config'

const navItems = [
  { key: 'nav.home', href: '', match: (rest: string) => rest === '' },
  { key: 'nav.blog', href: '/blog', match: (rest: string) => rest.startsWith('/blog') },
  { key: 'nav.tags', href: '/tags', match: (rest: string) => rest.startsWith('/tags') },
  { key: 'nav.about', href: '/about', match: (rest: string) => rest.startsWith('/about') },
]

export function Header() {
  const pathname = usePathname()
  const locale = isLocale(pathname.split('/')[1]) ? pathname.split('/')[1] : defaultLocale
  const rest = pathname.replace(/^\/(zh-CN|en)(?=\/|$)/, '')
  const t = (key: string) => getMessage(locale, key)

  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [meow, setMeow] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  useEffect(() => {
    if (!meow) return
    const timer = setTimeout(() => setMeow(null), 2400)
    return () => clearTimeout(timer)
  }, [meow])

  const catSays = () => {
    const pool = siteConfig.catLines as readonly string[]
    const next = pool[Math.floor(Math.random() * pool.length)]
    setMeow(next === meow ? pool[(pool.indexOf(next) + 1) % pool.length] : next)
    // 点够 5 次会有小鱼干雨
    document.dispatchEvent(new CustomEvent('cat:pet'))
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/92 backdrop-blur-md border-b-2 border-line'
          : 'bg-transparent border-b-2 border-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 h-[72px] flex items-center justify-between gap-4">
        <div className="relative flex items-center gap-3">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group" onClick={catSays}>
            <CatFace
              className="w-10 h-10 shrink-0 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
              blinkDelay=".5s"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-[18px] font-extrabold tracking-tight text-ink">{siteConfig.name}</span>
              <span className="hand text-[11px] text-muted">{siteConfig.subtitle}</span>
            </span>
          </Link>
          {meow && (
            <span className="absolute -bottom-10 left-2 z-50 whitespace-nowrap rounded-xl rounded-bl-sm border-2 border-line bg-surface px-3 py-1.5 text-xs text-inksoft shadow-[3px_3px_0_var(--sticker)] fade-up hand">
              <CatPaw className="inline w-3.5 h-3.5 mr-1.5 text-brand align-[-2px]" />
              {meow}
            </span>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = item.match(rest)
            return (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                data-active={active}
                className={`nav-link relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  active ? 'text-brandstrong' : 'text-inksoft hover:text-brandstrong'
                }`}
              >
                {t(item.key)}
                {active && <CatPaw className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-3.5 text-brand" />}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><LanguageSwitcher /></div>
          <ThemeToggle />
          <button
            className="icon-btn md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t-2 border-line bg-paper/97 backdrop-blur-md px-5 py-3 fade-up">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}${item.href}`}
                className={`px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  item.match(rest) ? 'bg-brandsoft text-brandstrong' : 'text-inksoft hover:bg-surface2'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="sm:hidden mt-3 pt-3 border-t-2 border-line"><LanguageSwitcher /></div>
        </div>
      )}
    </header>
  )
}
