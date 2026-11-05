import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Layers, Link2 } from 'lucide-react'
import { CatFace } from '@/components/cats'
import { getMessage } from '@/lib/i18n'
import { siteConfig } from '@/lib/site-config'

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return {
    title: getMessage(locale, 'nav.about'),
    description: siteConfig.description,
    alternates: { canonical: `/${locale}/about` },
  }
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = (key: string) => getMessage(locale, key)
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:py-20">
      <header className="fade-up max-w-2xl">
        <span className="eyebrow flex w-fit">{t('about.kicker')}</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink flex items-center gap-3">
          {t('about.hello')} <CatFace className="w-12 shrink-0 animate-float" blinkDelay="1.1s" />
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-inksoft">{t('about.intro')}</p>
      </header>

      {/* 关注的技术方向 */}
      <section className="mt-12 fade-up delay-1">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-9 h-9 rounded-xl bg-brandsoft text-brandstrong flex items-center justify-center border-2 border-line">
            <Layers className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-bold text-ink">{t('about.focusTitle')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {siteConfig.focusAreas.map((area) => (
            <div key={area.titleEn} className="glass-card p-5 hover:-translate-y-0.5 hover:border-brand transition-all">
              <div className="text-2xl leading-none">{area.icon}</div>
              <h3 className="mt-3 text-base font-bold text-ink">
                {en ? area.titleEn : area.titleZh}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-inksoft">
                {en ? area.descEn : area.descZh}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted leading-relaxed">{t('about.focusNote')}</p>
      </section>

      {/* 友情链接 / 资源导航 */}
      <section className="mt-10 fade-up delay-2">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-9 h-9 rounded-xl bg-brandsoft text-brandstrong flex items-center justify-center border-2 border-line">
            <Link2 className="w-4 h-4" />
          </span>
          <h2 className="text-lg font-bold text-ink">{t('about.linksTitle')}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {siteConfig.friendLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border-2 border-line px-4 py-3 hover:border-brand hover:-translate-y-0.5 transition-all"
            >
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-ink truncate">{link.name}</span>
                <span className="block text-xs text-muted truncate">{link.url.replace(/^https?:\/\//, '')}</span>
              </span>
              <span className="chip !py-0.5 !px-2 !text-[10px] !bg-brandsoft !text-brandstrong !border-0 shrink-0">
                {link.tag}
              </span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-brandstrong transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </a>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted leading-relaxed">{t('about.linksNote')}</p>
      </section>

      <div className="mt-10 glass-card p-6 md:p-7 fade-up delay-3 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h3 className="font-bold text-ink">{t('about.ctaTitle')}</h3>
          <p className="text-sm text-muted mt-1">{t('about.ctaText')}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${locale}/blog`} className="btn-primary !py-2.5 !px-5 !text-sm">{t('nav.blog')}</Link>
          <Link href={`/${locale}/tags`} className="btn-outline !py-2.5 !px-5 !text-sm">{t('nav.tags')}</Link>
        </div>
      </div>
    </div>
  )
}
