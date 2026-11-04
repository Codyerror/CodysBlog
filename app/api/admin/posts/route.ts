import { NextRequest, NextResponse } from 'next/server'
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '@/lib/post-manager'

/**
 * 这个 API 直接改写仓库里的 .mdx 文件，没有账号体系。
 * 线上环境（文件系统只读）默认关闭，只有本地 `npm run dev` 可用。
 * 需要线上开放时设置 ENABLE_ADMIN=true，并务必自行补上鉴权。
 */
function guard(): NextResponse | null {
  if (process.env.NODE_ENV === 'production' && process.env.ENABLE_ADMIN !== 'true') {
    return NextResponse.json(
      { error: 'Admin API is only available in local development.' },
      { status: 403 },
    )
  }
  return null
}

export async function GET(request: NextRequest) {
  const blocked = guard()
  if (blocked) return blocked
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')
    const slug = searchParams.get('slug')

    if (locale && slug) {
      const post = getPostBySlug(locale, slug)
      if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      return NextResponse.json(post)
    }
    return NextResponse.json(getAllPosts())
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  const blocked = guard()
  if (blocked) return blocked
  try {
    const { title, date, summary, tags, locale, content, slug } = await request.json()
    if (!title || !date || !locale || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const createdSlug = createPost({ title, date, summary, tags: tags || [], locale, content, slug })
    return NextResponse.json({ success: true, slug: createdSlug })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  const blocked = guard()
  if (blocked) return blocked
  try {
    const { locale, slug, ...data } = await request.json()
    if (!locale || !slug) {
      return NextResponse.json({ error: 'Missing locale or slug' }, { status: 400 })
    }
    updatePost(locale, slug, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const blocked = guard()
  if (blocked) return blocked
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')
    const slug = searchParams.get('slug')
    if (!locale || !slug) {
      return NextResponse.json({ error: 'Missing locale or slug' }, { status: 400 })
    }
    const success = deletePost(locale, slug)
    if (!success) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 400 })
  }
}
