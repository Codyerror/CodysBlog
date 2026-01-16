import { allPosts } from '@/lib/contentlayer'
import { PostCard } from '@/components/post-card'
import { getMessage } from '@/lib/i18n'

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const t = (key: string) => getMessage(locale, key)
  const posts = allPosts
    .filter((post: any) => post.locale === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{t('nav.blog')}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post: any) => (
          <PostCard key={post._id} post={post} locale={locale} />
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-center text-gray-500 py-12">{t('post.noPosts')}</p>
      )}
    </div>
  )
}
