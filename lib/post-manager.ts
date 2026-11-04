import fs from 'fs'
import path from 'path'
import { slugify } from '@/lib/utils'

const CONTENT_DIR = path.join(process.cwd(), 'content/posts')
const VALID_LOCALES = ['zh-CN', 'en']

export interface PostData {
  title: string
  date: string
  summary: string
  tags: string[]
  locale: string
  content: string
  slug?: string
}

export interface AdminPost extends PostData {
  slug: string
  filePath: string
}

type FrontmatterValue = string | string[]
type Frontmatter = Record<string, FrontmatterValue | undefined>

const asString = (value: FrontmatterValue | undefined): string =>
  typeof value === 'string' ? value : ''
const asTags = (value: FrontmatterValue | undefined): string[] =>
  Array.isArray(value) ? value : typeof value === 'string' && value ? [value] : []

/** 防止 slug / locale 里夹带 ../ 之类的路径。 */
function assertSafe(locale: string, slug: string) {
  if (!VALID_LOCALES.includes(locale)) throw new Error('Unsupported locale')
  if (!slug || slug !== path.basename(slug) || /[\\/]/.test(slug) || slug.startsWith('.')) {
    throw new Error('Invalid slug')
  }
}

function yamlString(value: string) {
  return JSON.stringify(value ?? '')
}

function formatFrontmatter(data: PostData): string {
  return `---
title: ${yamlString(data.title)}
date: ${yamlString(data.date)}
summary: ${yamlString(data.summary || '')}
tags: [${(data.tags ?? []).map((tag) => yamlString(tag)).join(', ')}]
locale: ${yamlString(data.locale)}
---
`
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: content }

  const frontmatter: Frontmatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    const key = line.slice(0, colonIndex).trim()
    const raw = line.slice(colonIndex + 1).trim()

    if (raw.startsWith('[') && raw.endsWith(']')) {
      frontmatter[key] = raw
        .slice(1, -1)
        .split(',')
        .map((item) => item.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else {
      let value: FrontmatterValue
      try {
        const parsed: unknown = JSON.parse(raw)
        value = typeof parsed === 'string' ? parsed : raw
      } catch {
        value = raw.replace(/^["']|["']$/g, '')
      }
      frontmatter[key] = value
    }
  }
  return { frontmatter, body: match[2] }
}

export function getAllPosts(): AdminPost[] {
  const posts: AdminPost[] = []
  if (!fs.existsSync(CONTENT_DIR)) return posts

  for (const locale of fs.readdirSync(CONTENT_DIR)) {
    const localeDir = path.join(CONTENT_DIR, locale)
    if (!fs.statSync(localeDir).isDirectory()) continue

    for (const file of fs.readdirSync(localeDir)) {
      if (!file.endsWith('.mdx')) continue
      const filePath = path.join(localeDir, file)
      const { frontmatter, body } = parseFrontmatter(fs.readFileSync(filePath, 'utf-8'))
      posts.push({
        title: asString(frontmatter.title),
        date: asString(frontmatter.date),
        summary: asString(frontmatter.summary),
        tags: asTags(frontmatter.tags),
        locale: asString(frontmatter.locale) || locale,
        content: body,
        slug: file.replace(/\.mdx$/, ''),
        filePath,
      })
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(locale: string, slug: string): PostData | null {
  assertSafe(locale, slug)
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const { frontmatter, body } = parseFrontmatter(fs.readFileSync(filePath, 'utf-8'))
  return {
    title: asString(frontmatter.title),
    date: asString(frontmatter.date),
    summary: asString(frontmatter.summary),
    tags: asTags(frontmatter.tags),
    locale: asString(frontmatter.locale) || locale,
    content: body,
    slug,
  }
}

export function createPost(data: PostData): string {
  const slug = data.slug?.trim() || slugify(data.title) || `post-${Date.now()}`
  assertSafe(data.locale, slug)

  const localeDir = path.join(CONTENT_DIR, data.locale)
  if (!fs.existsSync(localeDir)) fs.mkdirSync(localeDir, { recursive: true })

  const filePath = path.join(localeDir, `${slug}.mdx`)
  if (fs.existsSync(filePath)) throw new Error('A post with this slug already exists')

  fs.writeFileSync(filePath, formatFrontmatter(data) + data.content, 'utf-8')
  return slug
}

export function updatePost(locale: string, slug: string, data: Partial<PostData>): void {
  assertSafe(locale, slug)
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return

  const { frontmatter, body } = parseFrontmatter(fs.readFileSync(filePath, 'utf-8'))
  const updated: PostData = {
    title: data.title ?? asString(frontmatter.title),
    date: data.date ?? asString(frontmatter.date),
    summary: data.summary ?? asString(frontmatter.summary),
    tags: data.tags ?? asTags(frontmatter.tags),
    locale: data.locale ?? asString(frontmatter.locale) ?? locale,
    content: data.content ?? body,
  }

  fs.writeFileSync(filePath, formatFrontmatter(updated) + updated.content, 'utf-8')
}

export function deletePost(locale: string, slug: string): boolean {
  assertSafe(locale, slug)
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return false
  fs.unlinkSync(filePath)
  return true
}
