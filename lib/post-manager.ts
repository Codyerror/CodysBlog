import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content/posts')

export interface PostData {
  title: string
  date: string
  summary: string
  tags: string[]
  locale: string
  content: string
  slug?: string
}

function formatFrontmatter(data: PostData): string {
  const frontmatter = `---
title: "${data.title}"
date: "${data.date}"
summary: "${data.summary || ''}"
tags: [${data.tags.map(tag => `"${tag}"`).join(', ')}]
locale: "${data.locale}"
---
`
  return frontmatter
}

function parseFrontmatter(content: string): { frontmatter: any; body: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { frontmatter: {}, body: content }
  }
  
  const frontmatterStr = match[1]
  const body = match[2]
  
  const frontmatter: any = {}
  const lines = frontmatterStr.split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = line.slice(0, colonIndex).trim()
    let value: any = line.slice(colonIndex + 1).trim()
    
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1)
    } else if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((item: string) => item.trim().replace(/"/g, ''))
    }
    
    frontmatter[key] = value
  }
  
  return { frontmatter, body }
}

export function getAllPosts(): any[] {
  const posts: any[] = []
  const locales = fs.readdirSync(CONTENT_DIR)
  
  for (const locale of locales) {
    const localeDir = path.join(CONTENT_DIR, locale)
    if (!fs.statSync(localeDir).isDirectory()) continue
    
    const files = fs.readdirSync(localeDir)
    for (const file of files) {
      if (!file.endsWith('.mdx')) continue
      
      const filePath = path.join(localeDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      const { frontmatter, body } = parseFrontmatter(content)
      const slug = file.replace('.mdx', '')
      
      posts.push({
        ...frontmatter,
        slug,
        content: body,
        filePath
      })
    }
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(locale: string, slug: string): PostData | null {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) return null
  
  const content = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter, body } = parseFrontmatter(content)
  
  return {
    title: frontmatter.title || '',
    date: frontmatter.date || '',
    summary: frontmatter.summary || '',
    tags: frontmatter.tags || [],
    locale: frontmatter.locale || locale,
    content: body,
    slug
  }
}

export function createPost(data: PostData): void {
  const localeDir = path.join(CONTENT_DIR, data.locale)
  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true })
  }
  
  const slug = data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
  const filePath = path.join(localeDir, `${slug}.mdx`)
  
  const fullContent = formatFrontmatter(data) + data.content
  fs.writeFileSync(filePath, fullContent, 'utf-8')
}

export function updatePost(locale: string, slug: string, data: Partial<PostData>): void {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) return
  
  const existingContent = fs.readFileSync(filePath, 'utf-8')
  const { frontmatter: existingFrontmatter } = parseFrontmatter(existingContent)
  
  const updatedData = {
    title: data.title || existingFrontmatter.title,
    date: data.date || existingFrontmatter.date,
    summary: data.summary !== undefined ? data.summary : existingFrontmatter.summary,
    tags: data.tags || existingFrontmatter.tags,
    locale: data.locale || existingFrontmatter.locale,
    content: data.content !== undefined ? data.content : existingContent.split('---\n').slice(2).join('---\n')
  }
  
  const fullContent = formatFrontmatter(updatedData) + updatedData.content
  fs.writeFileSync(filePath, fullContent, 'utf-8')
}

export function deletePost(locale: string, slug: string): boolean {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) return false
  
  fs.unlinkSync(filePath)
  return true
}
