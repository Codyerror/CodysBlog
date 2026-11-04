import Link from 'next/link'
import { ArrowRight, Rss, BookOpen } from 'lucide-react'
import { Hero } from '@/components/hero'
import { PostCard } from '@/components/post-card'
import { CatLoaf, CatSleep } from '@/components/cats'
import { getMessage } from '@/lib/i18n'
import { getPosts, getSiteStats, toCardData } from '@/lib/posts'

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = (key: string) => getMessage(locale, key)
  const posts = getPosts(locale)
  const latest = posts.slice(0, 3).map(toCardData)
  const stats = getSiteStats(locale)
  const en = locale === 'en'

  return (
    <>
      <Hero locale={locale} stats={stats} slugs={posts.map((post) => post.slug)} />

      <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="eyebrow">{en ? 'just posted' : '刚贴上来'}</span>
            <h2 className="mt-2 text-3xl font-bold text-ink">{t('home.latest')}</h2>
            <p className="mt-2 text-sm text-muted">{t('home.latestHint')}</p>
          </div>
          <Link href={`/${locale}/blog`} className="inline-flex items-center gap-1.5 text-sm font-bold text-brandstrong hover:gap-3 transition-all w-fit">
            {t('home.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post, i) => (
              <PostCard key={post._id} post={post} locale={locale} index={i} />
            ))}
          </div>
        ) : (
          <div className="glass-card py-10 text-center fade-up">
            <CatSleep className="w-44 mx-auto" />
            <p className="mt-3 text-muted hand text-lg">{t('home.empty')}</p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="glass-card relative overflow-hidden p-7 md:p-9 tape-note">
          <CatLoaf className="absolute right-4 -bottom-2 w-40 opacity-90 pointer-events-none hidden sm:block" sleepy />
          <div className="relative max-w-xl">
            <span className="eyebrow">{en ? 'psst' : '诶，等一下'}</span>
            <h3 className="mt-2 text-2xl font-bold text-ink">{t('home.subscribeTitle')}</h3>
            <p className="mt-2 text-sm text-inksoft">{t('home.subscribeText')}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/rss.xml`} className="btn-primary">
                <Rss className="w-4 h-4" /> RSS
              </Link>
              <Link href={`/${locale}/about`} className="btn-outline">
                <BookOpen className="w-4 h-4" /> {t('nav.about')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
