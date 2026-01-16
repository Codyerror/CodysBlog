// @ts-ignore
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
// @ts-ignore
import type { Post } from '@/lib/contentlayer'

export function PostCard({ post, locale }: { post: Post; locale: string }) {
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="block group">
      <article className="border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all duration-300">
        <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {post.summary}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <time>{formatDate(post.date)}</time>
          <span>{post.readingTime.text}</span>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  )
}
