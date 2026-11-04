import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { locales } from '@/lib/i18n'
import { getPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, '')
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: `${base}/en`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ]

  for (const locale of locales) {
    if (locale !== siteConfig.defaultLocale) {
      entries.push({ url: `${base}/${locale}`, lastModified: now, changeFrequency: 'weekly', priority: 1 })
    }
    entries.push(
      { url: `${base}/${locale}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${base}/${locale}/tags`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${base}/${locale}/about`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    )
    for (const post of getPosts(locale)) {
      entries.push({
        url: `${base}${post.url}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: Object.fromEntries(locales.map((loc) => [loc, `${base}/${loc}/blog/${post.slug}`])) },
      })
    }
  }

  return entries
}
