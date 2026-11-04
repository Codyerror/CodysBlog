'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Save } from 'lucide-react'

interface PostData {
  title: string
  date: string
  summary: string
  tags: string[]
  locale: string
  content: string
  slug: string
}

export default function EditPostPage({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter()
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    summary: '',
    tags: '',
    locale: '',
    content: '',
  })

  useEffect(() => {
    let cancelled = false

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts?locale=${locale}&slug=${slug}`)
        if (res.ok) {
          const data: PostData = await res.json()
          if (!cancelled) {
            setFormData({
              title: data.title,
              date: data.date,
              summary: data.summary,
              tags: data.tags.join(', '),
              locale: data.locale,
              content: data.content,
            })
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        if (!cancelled) alert('加载文章失败')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchPost()
    return () => { cancelled = true }
  }, [locale, slug])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)

      const res = await fetch('/api/admin/posts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locale: formData.locale,
          slug,
          title: formData.title,
          date: formData.date,
          summary: formData.summary,
          tags,
          content: formData.content,
        }),
      })

      if (res.ok) {
        router.push(`/${locale}/admin`)
      } else {
        alert('更新失败')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('更新失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">编辑文章</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            标题
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="输入文章标题"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2">
            发布日期
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium mb-2">
            摘要
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="输入文章摘要"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            标签（用逗号分隔）
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
            placeholder="例如: 博客, 技术, 教程"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            内容（Markdown）
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={20}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent font-mono"
            placeholder="输入 Markdown 内容..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand text-white dark:text-[#06201c] px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
