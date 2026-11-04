import type { Metadata } from 'next'
import Link from 'next/link'
import { Github, Mail, Rss, ArrowUpRight, Layers, PenLine, Sparkles } from 'lucide-react'
import { CatFace, CatPaw, CatSitting } from '@/components/cats'
import { getMessage } from '@/lib/i18n'
import { siteConfig } from '@/lib/site-config'
import { getSiteStats } from '@/lib/posts'

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return {
    title: getMessage(locale, 'nav.about'),
    description: siteConfig.description,
    alternates: { canonical: `/${locale}/about` },
  }
}

const stack = [
  { name: 'Next.js 14', note: 'App Router / static pages', icon: '▲' },
  { name: 'Contentlayer + MDX', note: 'plain .mdx files, typed at build time', icon: '◈' },
  { name: 'Tailwind CSS 4', note: 'one stylesheet, two themes', icon: '✦' },
  { name: 'Giscus', note: 'comments via GitHub Discussions', icon: '❝' },
]

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = (key: string) => getMessage(locale, key)
  const stats = getSiteStats(locale)
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:py-20">
      <header className="fade-up max-w-2xl">
        <span className="eyebrow flex w-fit">{t('about.kicker')}</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink flex items-center gap-3">
          {t('about.hello')} <CatFace className="w-12 shrink-0 animate-float" blinkDelay="1.1s" />
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-inksoft">{t('about.intro')}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {[
            { label: `${stats.posts} ${en ? 'posts' : '篇文章'}`, icon: <PenLine className="w-3.5 h-3.5" /> },
            { label: `${stats.tags} ${en ? 'topics' : '个话题'}`, icon: <Layers className="w-3.5 h-3.5" /> },
            { label: `${stats.words.toLocaleString()} ${en ? 'words' : '字'}`, icon: <Sparkles className="w-3.5 h-3.5" /> },
          ].map((item) => (
            <span key={item.label} className="chip !py-1.5 !px-3 !text-xs">
              {item.icon} {item.label}
            </span>
          ))}
        </div>
      </header>

      {/* 猫的工牌 */}
      <section className="mt-12 glass-card relative overflow-hidden p-6 md:p-8 fade-up delay-1">
        <div className="grid sm:grid-cols-[150px_1fr] gap-6 items-center">
          <div className="relative cat-pettable flex justify-center">
            <CatSitting className="w-36" blinkDelay="2.2s" />
          </div>
          <div>
            <span className="eyebrow">{t('about.catTitle')}</span>
            <h2 className="mt-1 text-2xl font-bold text-ink hand">
              {siteConfig.cat.name} <span className="text-base font-normal not-italic text-muted">/ {t('about.catRole')}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-inksoft">{t('about.catBio')}</p>
            <p className="mt-4 text-xs text-muted">
              <span className="font-semibold text-brandstrong">{t('about.catSkill')}: </span>
              {t('about.catSkills')}
            </p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 opacity-30">
              <CatPaw className="w-4 text-brand -rotate-12" />
              <CatPaw className="w-3 text-brand rotate-6" />
              <CatPaw className="w-4 text-brand rotate-12" />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <section className="glass-card p-6 md:p-7 fade-up delay-2">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-9 rounded-xl bg-brandsoft text-brandstrong flex items-center justify-center border-2 border-line">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-ink">{t('about.stackTitle')}</h2>
          </div>
          <div className="space-y-2">
            {stack.map((item) => (
              <div key={item.name} className="flex items-center gap-3 rounded-xl border-2 border-line px-3.5 py-2.5 hover:border-brand hover:-translate-y-0.5 transition-all">
                <span className="font-mono text-brandstrong w-5 text-center">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink">{item.name}</div>
                  <div className="text-xs text-muted truncate">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-muted leading-relaxed">{t('about.stackNote')}</p>
        </section>

        <section className="glass-card p-6 md:p-7 fade-up delay-3">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-9 rounded-xl bg-brandsoft text-brandstrong flex items-center justify-center border-2 border-line">
              <Mail className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-ink">{t('about.contactTitle')}</h2>
          </div>
          <p className="text-sm leading-relaxed text-inksoft">{t('about.contactText')}</p>

          <div className="mt-6 space-y-2">
            <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border-2 border-line px-4 py-3 hover:border-brand hover:-translate-y-0.5 transition-all">
              <Github className="w-4 h-4 text-muted group-hover:text-brandstrong" />
              <span className="flex-1 text-sm text-ink">GitHub</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-brandstrong transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href={`mailto:${siteConfig.social.email}`} className="group flex items-center gap-3 rounded-xl border-2 border-line px-4 py-3 hover:border-brand hover:-translate-y-0.5 transition-all">
              <Mail className="w-4 h-4 text-muted group-hover:text-brandstrong" />
              <span className="flex-1 text-sm text-ink truncate">{siteConfig.social.email}</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-brandstrong" />
            </a>
            <Link href={`/${locale}/rss.xml`} className="group flex items-center gap-3 rounded-xl border-2 border-line px-4 py-3 hover:border-brand hover:-translate-y-0.5 transition-all">
              <Rss className="w-4 h-4 text-muted group-hover:text-brandstrong" />
              <span className="flex-1 text-sm text-ink">RSS</span>
              <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-brandstrong" />
            </Link>
          </div>
        </section>
      </div>

      <div className="mt-6 glass-card p-6 md:p-7 fade-up delay-4 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h3 className="font-bold text-ink">{t('about.startTitle')}</h3>
          <p className="text-sm text-muted mt-1">{t('about.startText')}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${locale}/blog`} className="btn-primary !py-2.5 !px-5 !text-sm">{t('nav.blog')}</Link>
          <Link href={`/${locale}/tags`} className="btn-outline !py-2.5 !px-5 !text-sm">{t('nav.tags')}</Link>
        </div>
      </div>
    </div>
  )
}
