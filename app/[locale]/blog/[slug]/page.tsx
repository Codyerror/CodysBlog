import { allPosts } from '@/lib/contentlayer'
import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { formatDate } from '@/lib/utils'
import { Giscus } from '@/components/giscus'
import { useMDXComponents } from '@/components/mdx-components'

export default function PostPage({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string }
}) {
  const t = useTranslations()
  const post = allPosts.find(
    (p: any) => p.locale === locale && p.slug === slug
  )

  if (!post) return notFound()

  const MDXContent = (post as any).body.code.default
  const mdxComponents = useMDXComponents({})

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <time>{formatDate(post.date)}</time>
          <span>•</span>
          <span>{post.readingTime.text}</span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MDXContent components={mdxComponents} />
      </div>
      <Giscus />
    </article>
  )
}
