'use client'

import { useState } from 'react'
import { CatLoaf, CatPaw } from './cats'
import { getMessage } from '@/lib/i18n'

/** 文章读到底之后的一只猫。按一下撒小鱼干。 */
export function PostCat({ locale }: { locale: string }) {
  const [petted, setPetted] = useState(false)
  const t = (key: string) => getMessage(locale, key)

  const pet = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPetted(true)
    window.setTimeout(() => setPetted(false), 1800)
    document.dispatchEvent(
      new CustomEvent('cat:party', { detail: { x: event.clientX, y: event.clientY } }),
    )
  }

  return (
    <section className="glass-card tape-note cat-pettable relative mt-14 overflow-hidden p-6 md:p-7">
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <CatLoaf className="w-36 sm:w-40 shrink-0" sleepy />
        <div className="text-center sm:text-left">
          <span className="eyebrow">{t('post.endNote')}</span>
          <p className="mt-1 text-sm text-inksoft">{t('post.endHint')}</p>
          <button onClick={pet} className="btn-outline mt-4 !py-2 !px-4 !text-xs">
            <CatPaw className="w-3.5 text-brand" />
            {petted ? t('post.petted') : t('post.petMe')}
          </button>
        </div>
      </div>
      <CatPaw className="absolute right-5 top-4 w-6 text-brand opacity-20 rotate-12" />
    </section>
  )
}
