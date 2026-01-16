'use client'
import GiscusComponent from '@giscus/react'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'

export function Giscus() {
  const { resolvedTheme } = useTheme()
  const locale = useLocale()

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      <GiscusComponent
        repo="Codyerror/blog-comments"
        repoId="R_kgDOQ7C2FQ"
        category="Announcements"
        categoryId="DIC_kwDOQ7C2Fc4C1B8W"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        theme="transparent_dark"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
