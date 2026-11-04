'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X, RotateCcw } from 'lucide-react'
import { PostCard, type PostCardData } from './post-card'
import { CatPaw, CatSleep, CatFace } from './cats'
import { getMessage } from '@/lib/i18n'

type TagInfo = { tag: string; count: number }

export function BlogExplorer({
  locale,
  posts,
  tags,
}: {
  locale: string
  posts: PostCardData[]
  tags: TagInfo[]
}) {
  const t = (key: string, vars?: Record<string, string | number>) => getMessage(locale, key, vars)
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const years = useMemo(
    () => [...new Set(posts.map((p) => new Date(p.date).getFullYear()))].sort((a, b) => b - a),
    [posts],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable
      if (event.key === '/' && !typing) {
        event.preventDefault()
        inputRef.current?.focus()
      }
      if (event.key === 'Escape') {
        if (document.activeElement === inputRef.current) inputRef.current?.blur()
        setQuery('')
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (activeTag && !(post.tags ?? []).includes(activeTag)) return false
      if (activeYear && new Date(post.date).getFullYear() !== activeYear) return false
      if (!needle) return true
      const haystack = [post.title, post.summary ?? '', ...(post.tags ?? [])].join(' ').toLowerCase()
      return haystack.includes(needle)
    })
  }, [posts, query, activeTag, activeYear])

  const grouped = useMemo(() => {
    const map = new Map<number, PostCardData[]>()
    for (const post of filtered) {
      const year = new Date(post.date).getFullYear()
      if (!map.has(year)) map.set(year, [])
      map.get(year)!.push(post)
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0])
  }, [filtered])

  const hasFilter = Boolean(query || activeTag || activeYear)
  const reset = () => { setQuery(''); setActiveTag(null); setActiveYear(null) }

  return (
    <div>
      {/* 搜索框：放大镜换成猫爪 */}
      <div className="relative">
        <CatPaw className="absolute left-4 top-1/2 -translate-y-1/2 w-4 text-brand pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('blog.search')}
          className="w-full pl-11 pr-11 py-3 rounded-xl border-2 border-line bg-surface text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:shadow-[3px_3px_0_var(--sticker)] transition-all"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-brandstrong" aria-label="Clear">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 标签 */}
      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button className="chip" data-active={activeTag === null} onClick={() => setActiveTag(null)}>
            {t('blog.allTags')} <span className="opacity-60">{posts.length}</span>
          </button>
          {tags.map(({ tag, count }) => (
            <button key={tag} className="chip" data-active={activeTag === tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}>
              #{tag} <span className="opacity-60">{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* 年份 */}
      {years.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted mr-1">{t('blog.allYears')}:</span>
          <button className="chip" data-active={activeYear === null} onClick={() => setActiveYear(null)}>
            {t('blog.allTags')}
          </button>
          {years.map((year) => (
            <button key={year} className="chip font-mono" data-active={activeYear === year} onClick={() => setActiveYear(activeYear === year ? null : year)}>
              {year}
            </button>
          ))}
        </div>
      )}

      {/* 结果计数 */}
      <div className="mt-8 mb-5 flex items-center justify-between">
        <span className="text-xs text-muted font-mono inline-flex items-center gap-1.5">
          <CatPaw className="w-3 text-brand" /> {t('blog.resultCount', { count: filtered.length })}
        </span>
        {hasFilter && (
          <button onClick={reset} className="inline-flex items-center gap-1 text-xs text-muted hover:text-brandstrong transition-colors">
            <RotateCcw className="w-3 h-3" /> {t('blog.reset')}
          </button>
        )}
      </div>

      {/* 卡片 */}
      {grouped.length === 0 ? (
        <div className="glass-card py-10 text-center fade-up">
          <CatSleep className="w-48 mx-auto" />
          <p className="mt-2 text-inksoft hand text-lg">{t('blog.noResult')}</p>
          <button onClick={reset} className="btn-outline mt-4 !py-2 !px-4 !text-xs">{t('blog.reset')}</button>
        </div>
      ) : (
        <div className="space-y-12">
          {grouped.map(([year, items]) => (
            <section key={year}>
              <div className="flex items-center gap-4 mb-5">
                <h2 className="font-mono text-2xl font-bold text-brandstrong">{year}</h2>
                <CatFace className="w-8 shrink-0" blinkDelay={`${year % 3}s`} />
                <span className="h-[2px] flex-1 border-t-2 border-dashed border-line" />
                <span className="text-xs text-muted font-mono">{String(items.length).padStart(2, '0')}</span>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((post, i) => (
                  <PostCard key={post._id} post={post} locale={locale} index={i} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
