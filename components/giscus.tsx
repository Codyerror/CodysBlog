'use client'
import GiscusComponent from '@giscus/react'
import { useTheme } from 'next-themes'

export function Giscus() {
  const { resolvedTheme } = useTheme()

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      <GiscusComponent
        repo="Codyerror/CodysBlog"
        repoId="R_kgDOQ7pwOA"
        category="Announcements"
        categoryId="DIC_kwDOQ7pwOM4C1Eqm"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme === 'dark' ? 'dark_dimmed' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
