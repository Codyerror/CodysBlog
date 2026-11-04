import RSS from 'rss'
import { siteConfig } from '@/lib/site-config'
import { getPosts } from '@/lib/posts'
import { locales } from '@/lib/i18n'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export function GET(_request: Request, { params }: { params: { locale: string } }) {
  const locale = locales.find((item) => item === params.locale) ?? siteConfig.defaultLocale
  const base = siteConfig.siteUrl.replace(/\/$/, '')

  const feed = new RSS({
    title: `${siteConfig.name} · ${siteConfig.subtitle}`,
    description: siteConfig.description,
    feed_url: `${base}/${locale}/rss.xml`,
    site_url: `${base}/${locale}`,
    language: locale === 'zh-CN' ? 'zh-CN' : 'en',
    pubDate: new Date(),
    ttl: 60,
    custom_namespaces: { content: 'http://purl.org/rss/1.0/modules/content/' },
  })

  for (const post of getPosts(locale)) {
    feed.item({
      title: post.title,
      description: post.summary ?? '',
      url: `${base}${post.url}`,
      guid: `${base}${post.url}`,
      date: post.date,
      categories: post.tags ?? [],
    })
  }

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
