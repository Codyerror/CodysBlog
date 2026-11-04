'use client'

import { useEffect, useState } from 'react'
import { CatPaw } from './cats'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-surface border-2 border-line shadow-[3px_3px_0_var(--sticker)] flex items-center justify-center text-inksoft transition-all duration-300 hover:text-brandstrong hover:border-brand hover:-translate-y-1 hover:rotate-6 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="Back to top"
      title="Back to top"
    >
      <CatPaw className="w-5 -rotate-45" />
    </button>
  )
}
