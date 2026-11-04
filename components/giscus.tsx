'use client'
import GiscusComponent from '@giscus/react'
import { useTheme } from 'next-themes'
import { MessageCircle } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export function Giscus({ locale }: { locale: string }) {
  const { resolvedTheme } = useTheme()

  return (
    <section className="mt-16 pt-8 border-t border-line">
      <h3 className="flex items-center gap-2 text-lg font-bold text-ink mb-5">
        <MessageCircle className="w-4.5 h-4.5 text-brand" />
        {locale === 'zh-CN' ? '聊聊' : 'Comments'}
      </h3>
      <div className="min-h-[180px]">
        <GiscusComponent
          repo={siteConfig.giscus.repo}
          repoId={siteConfig.giscus.repoId}
          category={siteConfig.giscus.category}
          categoryId={siteConfig.giscus.categoryId}
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={resolvedTheme === 'dark' ? 'dark_dimmed' : 'light'}
          lang={locale === 'zh-CN' ? 'zh-CN' : 'en'}
          loading="lazy"
        />
      </div>
      <p className="mt-4 text-xs text-muted">
        {locale === 'zh-CN' ? '评论托管在 GitHub Discussions，需要 GitHub 账号。' : 'Comments are powered by GitHub Discussions.'}
      </p>
    </section>
  )
}
