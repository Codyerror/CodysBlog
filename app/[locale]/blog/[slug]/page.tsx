import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Hash } from 'lucide-react'
import { MDXRenderer } from '@/components/mdx-renderer'
import { Giscus } from '@/components/giscus'
import { ReadingProgress } from '@/components/reading-progress'
import { TableOfContents } from '@/components/table-of-contents'
import { CodeCopy } from '@/components/code-copy'
import { CopyLink } from '@/components/copy-link'
import { PostCat } from '@/components/post-cat'
import { CatPaw } from '@/components/cats'
import { getMessage } from '@/lib/i18n'
import { formatDate } from '@/lib/utils'
import { getPost, getPosts, getAdjacentPosts } from '@/lib/posts'
import { siteConfig } from '@/lib/site-config'

type Params = { params: { locale: string; slug: string } }

export function generateStaticParams() {
  return getPosts().map((post) => ({ locale: post.locale, slug: post.slug }))
}

export function generateMetadata({ params: { locale, slug } }: Params): Metadata {
  const post = getPost(locale, slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: { canonical: post.url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.summary,
      url: post.url,
      publishedTime: post.date,
      tags: post.tags,
      ...(post.cover ? { images: [{ url: post.cover }] } : {}),
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.summary },
  }
}

export default function PostPage({ params: { locale, slug } }: Params) {
  const t = (key: string) => getMessage(locale, key)
  const post = getPost(locale, slug)
  if (!post || post.draft) return notFound()

  const { newer, older } = getAdjacentPosts(post)
  const minutes = post.readingTime?.minutes
  const readLabel = minutes
    ? locale === 'zh-CN'
      ? `约 ${Math.max(1, Math.round(minutes))} 分钟`
      : `${Math.max(1, Math.round(minutes))} min read`
    : post.readingTime?.text

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    author: { '@type': 'Person', name: siteConfig.author },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteConfig.siteUrl}${post.url}` },
    keywords: (post.tags ?? []).join(', '),
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto">
        <Link href={`/${locale}/blog`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-brand transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> {t('post.backToBlog')}
        </Link>

        <div className="grid xl:grid-cols-[minmax(0,1fr)_210px] gap-12">
          <article className="min-w-0">
            <header className="mb-10 fade-up">
              <span className="eyebrow !text-sm mb-4">{locale === 'zh-CN' ? '一篇笔记' : 'a note'}</span>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted font-mono">
                <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" />{formatDate(post.date, locale)}</span>
                <span className="w-1 h-1 rounded-full bg-line" />
                <span className="inline-flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5" />{readLabel}</span>
                {post.wordCount ? (
                  <>
                    <span className="w-1 h-1 rounded-full bg-line" />
                    <span>{post.wordCount.toLocaleString()} {t('post.words')}</span>
                  </>
                ) : null}
              </div>

              <h1 className="mt-5 text-3xl md:text-[2.6rem] leading-tight font-bold text-ink tracking-tight">
                {post.title}
              </h1>
              {post.summary && (
                <p className="mt-4 text-base md:text-lg leading-relaxed text-inksoft border-l-2 border-brand/60 pl-4">
                  {post.summary}
                </p>
              )}

              {(post.tags ?? []).length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {(post.tags ?? []).map((tag) => (
                    <Link key={tag} href={`/${locale}/tags#tag-${encodeURIComponent(tag)}`} className="chip hover:-translate-y-0.5">
                      <Hash className="w-3 h-3" />{tag}
                    </Link>
                  ))}
                </div>
              )}

              {post.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover} alt={post.title} className="mt-8 w-full rounded-2xl shadow-lg object-cover max-h-80" />
              )}
            </header>

            <div className="prose-cody">
              <MDXRenderer code={post.body.code} />
            </div>
            <CodeCopy />

            <div className="mt-10 pt-5 border-t-2 border-dashed border-line flex flex-wrap items-center justify-between gap-4">
              <CopyLink locale={locale} />
              <Link href={`/${locale}/tags`} className="text-xs text-muted hover:text-brandstrong inline-flex items-center gap-1">
                {t('nav.tags')} <CatPaw className="w-3 text-brand" />
              </Link>
            </div>

            {/* 上下篇 */}
            <nav className="mt-10 grid sm:grid-cols-2 gap-4">
              {older ? (
                <Link href={`/${locale}/blog/${older.slug}`} className="glass-card group p-4 hover:-translate-y-1 hover:border-brand">
                  <span className="text-[11px] text-muted inline-flex items-center gap-1"><ArrowLeft className="w-3 h-3" />{t('post.prev')}</span>
                  <div className="mt-1.5 text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2">{older.title}</div>
                </Link>
              ) : <span className="hidden sm:block" />}
              {newer && (
                <Link href={`/${locale}/blog/${newer.slug}`} className="glass-card group p-4 text-right hover:-translate-y-1 hover:border-brand sm:col-start-2">
                  <span className="text-[11px] text-muted inline-flex items-center gap-1 justify-end">{t('post.next')}<ArrowRight className="w-3 h-3" /></span>
                  <div className="mt-1.5 text-sm font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2">{newer.title}</div>
                </Link>
              )}
            </nav>

            <PostCat locale={locale} />

            <Giscus locale={locale} />
          </article>

          <TableOfContents locale={locale} />
        </div>
      </div>
    </div>
  )
}
