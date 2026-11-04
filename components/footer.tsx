'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Mail, Rss, ArrowUp } from 'lucide-react'
import { CatFace, CatPaw, CatWalk } from './cats'
import { getMessage, defaultLocale, isLocale } from '@/lib/i18n'
import { siteConfig } from '@/lib/site-config'

export function Footer() {
  const pathname = usePathname()
  const locale = isLocale(pathname.split('/')[1]) ? pathname.split('/')[1] : defaultLocale
  const t = (key: string, vars?: Record<string, string | number>) => getMessage(locale, key, vars)
  const year = new Date().getFullYear()

  return (
    <footer className="relative mt-24 border-t-2 border-dashed border-line bg-surface/50">
      {/* 一只猫沿着页脚边界溜达过去 */}
      <CatWalk className="absolute -top-[52px] right-[8%] w-24 pointer-events-none animate-float" />

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <CatFace className="w-10 shrink-0" blinkDelay="2.6s" />
              <span className="font-extrabold text-ink text-lg">{siteConfig.name}</span>
            </div>
            <p className="mt-2 text-sm text-muted leading-relaxed">{siteConfig.tagline}</p>
            <p className="mt-3 text-xs text-muted hand inline-flex items-center gap-1.5">
              <CatPaw className="w-3 text-brand" /> {t('footer.builtWith')}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="eyebrow !text-sm">links & stuff</span>
            <div className="flex flex-wrap items-center gap-2">
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
              <a href={`mailto:${siteConfig.social.email}`} className="icon-btn" aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
              <Link href={`/${locale}/rss.xml`} className="icon-btn" aria-label="RSS">
                <Rss className="w-4 h-4" />
              </Link>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="icon-btn"
                aria-label={t('footer.top')}
                title={t('footer.top')}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
            <Link href={`/${locale}/rss.xml`} className="text-xs text-muted hover:text-brandstrong transition-colors w-fit">
              {t('footer.rss')} · /{locale}/rss.xml
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t-2 border-dashed border-line flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted">
          <span>{t('footer.copyright', { year })}</span>
          {siteConfig.icp ? (
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-brandstrong">
              {siteConfig.icp}
            </a>
          ) : (
            <span className="hand inline-flex items-center gap-1.5">
              <CatPaw className="w-3 text-brand" /> {t('footer.note')}
            </span>
          )}
        </div>
      </div>
    </footer>
  )
}
