import type { Metadata } from 'next'
import { BlogExplorer } from '@/components/blog-explorer'
import { CatPaw } from '@/components/cats'
import { getMessage } from '@/lib/i18n'
import { getPosts, getTags, toCardData } from '@/lib/posts'

export function generateMetadata({ params: { locale } }: { params: { locale: string } }): Metadata {
  return {
    title: getMessage(locale, 'blog.title'),
    description: getMessage(locale, 'blog.subtitle'),
    alternates: { canonical: `/${locale}/blog` },
  }
}

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = (key: string) => getMessage(locale, key)
  const posts = getPosts(locale).map(toCardData)
  const tags = getTags(locale)
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <header className="mb-9 fade-up">
        <span className="eyebrow">{en ? 'all of it' : '全部都在这儿'}</span>
        <h1 className="mt-2 text-4xl md:text-5xl font-bold text-ink">
          {t('blog.title')}
          <CatPaw className="inline-block w-8 ml-2 text-brand align-[-6px] rotate-12" />
        </h1>
        <p className="mt-3 text-inksoft">{t('blog.subtitle')}</p>
      </header>

      <BlogExplorer locale={locale} posts={posts} tags={tags} />
    </div>
  )
}
