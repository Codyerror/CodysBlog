'use client'

import { useEffect, useState } from 'react'
import { CatLoaf, CatPaw } from './cats'
import { getMessage } from '@/lib/i18n'

type Item = { id: string; text: string; level: number }

export function TableOfContents({ locale }: { locale: string }) {
  const [items, setItems] = useState<Item[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('.prose-cody h2, .prose-cody h3'),
    )
    setItems(
      headings
        .filter((node) => node.id)
        .map((node) => ({
          id: node.id,
          text: node.textContent?.replace(/^#/, '').trim() ?? '',
          level: node.tagName === 'H2' ? 2 : 3,
        })),
    )

    const onScroll = () => {
      let current = ''
      for (const node of headings) {
        if (node.getBoundingClientRect().top <= 140) current = node.id
      }
      setActiveId(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (items.length < 2) return null

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
        <CatLoaf className="w-24 -mb-1 ml-1" sleepy />
        <span className="eyebrow !text-sm mb-3 flex">{getMessage(locale, 'post.toc')}</span>
        <nav className="border-l-2 border-dashed border-line space-y-0.5">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`block -ml-[2px] border-l-2 py-1.5 text-xs leading-relaxed transition-all ${
                item.level === 3 ? 'pl-7' : 'pl-3.5'
              } ${
                activeId === item.id
                  ? 'border-brand text-brandstrong font-semibold'
                  : 'border-transparent text-muted hover:text-ink hover:border-line'
              }`}
            >
              {activeId === item.id && <CatPaw className="inline w-3 mr-1 text-brand align-[-2px]" />}
              {item.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}
