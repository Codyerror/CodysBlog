import { allPosts } from '@/lib/contentlayer'
import Link from 'next/link'
import { PostCard } from '@/components/post-card'
import { getMessage } from '@/lib/i18n'

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = (key: string) => getMessage(locale, key)
  const posts = allPosts
    .filter((post: any) => post.locale === locale)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4">CodyInsight</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">知山数说</p>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          山高有径，数海有光
        </p>
      </section>
      <section>
        <h2 className="text-3xl font-bold mb-8">{t('post.readMore')}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard key={post._id} post={post} locale={locale} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href={`/${locale}/blog`}
            className="text-primary hover:underline font-semibold"
          >
            {t('nav.blog')} →
          </Link>
        </div>
      </section>
    </div>
  )
}
