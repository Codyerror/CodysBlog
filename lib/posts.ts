import { allPosts } from '@/lib/contentlayer'

/** Contentlayer 生成的 Post 结构很宽，这里统一收敛成一个宽松类型，避免各页面到处写 any。 */
export type BlogPost = {
  _id: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  locale: string
  slug: string
  url: string
  cover?: string
  draft?: boolean
  readingTime?: { text: string; minutes: number; words: number }
  wordCount?: number
  body: { raw: string; code: string }
}

const posts = allPosts as unknown as BlogPost[]

export function getPosts(locale?: string, includeDrafts = false): BlogPost[] {
  return posts
    .filter((post) => (locale ? post.locale === locale : true))
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(locale: string, slug: string): BlogPost | undefined {
  return getPosts(locale, true).find((post) => post.slug === slug)
}

/** 相邻文章：返回较新 / 较旧各一篇，用于文章页底部的上下篇导航。 */
export function getAdjacentPosts(post: BlogPost) {
  const list = getPosts(post.locale)
  const index = list.findIndex((item) => item._id === post._id)
  return {
    newer: index > 0 ? list[index - 1] : undefined,
    older: index >= 0 && index < list.length - 1 ? list[index + 1] : undefined,
  }
}

export function getTags(locale?: string): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const post of getPosts(locale)) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function groupByYear(list: BlogPost[]): { year: number; posts: BlogPost[] }[] {
  const groups = new Map<number, BlogPost[]>()
  for (const post of list) {
    const year = new Date(post.date).getFullYear()
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year)!.push(post)
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, items]) => ({ year, posts: items }))
}

/** 传给客户端列表组件前先瘦身，避免把 MDX 编译产物塞进页面 payload。 */
export function toCardData(post: BlogPost) {
  return {
    _id: post._id,
    title: post.title,
    date: post.date,
    summary: post.summary,
    tags: post.tags ?? [],
    slug: post.slug,
    cover: post.cover,
    draft: Boolean(post.draft),
    readingTime: post.readingTime
      ? { text: post.readingTime.text, minutes: post.readingTime.minutes }
      : undefined,
    wordCount: post.wordCount,
  }
}

export function getSiteStats(locale: string) {
  const list = getPosts(locale)
  return {
    posts: list.length,
    tags: getTags(locale).length,
    words: list.reduce((sum, post) => sum + (post.wordCount ?? 0), 0),
  }
}
