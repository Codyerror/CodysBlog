'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2, Edit, Plus } from 'lucide-react'

interface Post {
  title: string
  date: string
  summary: string
  tags: string[]
  locale: string
  slug: string
}

export default function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/posts')
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (postLocale: string, slug: string) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    setDeleting(slug)
    try {
      const res = await fetch(`/api/admin/posts?locale=${postLocale}&slug=${slug}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        setPosts(posts.filter(p => !(p.locale === postLocale && p.slug === slug)))
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('删除失败')
    } finally {
      setDeleting(null)
    }
  }

  const filteredPosts = posts.filter(p => p.locale === locale)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">文章管理</h1>
        <Link
          href={`/${locale}/admin/new`}
          className="flex items-center gap-2 bg-brand text-white dark:text-[#06201c] px-4 py-2 rounded-lg hover:opacity-90"
        >
          <Plus size={20} />
          新建文章
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无文章</div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{post.summary}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.date}</span>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                      {post.locale}
                    </span>
                    {post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title="查看文章"
                  >
                    👁️
                  </Link>
                  <Link
                    href={`/${locale}/admin/edit/${post.slug}`}
                    className="p-2 text-gray-600 hover:text-blue-600"
                    title="编辑"
                  >
                    <Edit size={20} />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.locale, post.slug)}
                    disabled={deleting === post.slug}
                    className="p-2 text-gray-600 hover:text-red-600 disabled:opacity-50"
                    title="删除"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
