import type { Metadata } from 'next'
import Link from 'next/link'
import { Hash, ArrowUpRight } from 'lucide-react'
import { CatPaw, CatSleep } from '@/components/cats'
import { getMessage } from '@/lib/i18n'
import { getPosts, getTags } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return {
    title: getMessage(locale, 'tags.title'),
    description: getMessage(locale, 'tags.subtitle'),
    alternates: { canonical: `/${locale}/tags` },
  }
}

export default function TagsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = (key: string, vars?: Record<string, string | number>) => getMessage(locale, key, vars)
  const tags = getTags(locale)
  const posts = getPosts(locale)
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
      <header className="mb-10 fade-up">
        <span className="eyebrow">{en ? 'things I keep coming back to' : '老是绕回来的几件事'}</span>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold text-ink">
          {t('tags.title')}
          <CatPaw className="inline-block w-8 ml-2 text-brand align-[-6px] -rotate-12" />
        </h1>
        <p className="mt-3 text-inksoft">{t('tags.subtitle')}</p>
      </header>

      {tags.length === 0 ? (
        <div className="glass-card py-10 text-center">
          <CatSleep className="w-44 mx-auto" />
          <p className="mt-2 text-muted hand text-lg">{t('tags.empty')}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2.5 mb-12">
            {tags.map(({ tag, count }) => (
              <a
                key={tag}
                href={`#tag-${encodeURIComponent(tag)}`}
                className="chip !text-sm !px-3.5 !py-1.5"
                style={{ fontSize: `${0.82 + Math.min(count, 5) * 0.045}rem` }}
              >
                <Hash className="w-3.5 h-3.5" /> {tag}
                <span className="opacity-60 ml-1">{count}</span>
              </a>
            ))}
          </div>

          <div className="space-y-10">
            {tags.map(({ tag, count }) => {
              const related = posts.filter((post) => (post.tags ?? []).includes(tag))
              return (
                <section key={tag} id={`tag-${encodeURIComponent(tag)}`} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xl font-bold text-ink">#{tag}</h2>
                    <span className="chip !text-[11px]">{t('tags.count', { count })}</span>
                    <CatPaw className="w-4 text-brand opacity-60" />
                    <span className="h-[2px] flex-1 border-t-2 border-dashed border-line" />
                  </div>
                  <div className="glass-card divide-y-2 divide-line overflow-hidden">
                    {related.map((post) => (
                      <Link
                        key={post._id}
                        href={`/${locale}/blog/${post.slug}`}
                        className="group flex items-center gap-4 px-5 py-3.5 hover:bg-brandsoft/50 transition-colors"
                      >
                        <span className="font-mono text-xs text-muted shrink-0 w-24">
                          {formatDate(post.date, locale)}
                        </span>
                        <span className="flex-1 text-sm font-medium text-ink group-hover:text-brandstrong transition-colors">
                          {post.title}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-brandstrong transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
