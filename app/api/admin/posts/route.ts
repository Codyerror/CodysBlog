import { NextRequest, NextResponse } from 'next/server'
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost
} from '@/lib/post-manager'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')
    const slug = searchParams.get('slug')
    
    if (locale && slug) {
      const post = getPostBySlug(locale, slug)
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }
      return NextResponse.json(post)
    }
    
    const posts = getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, summary, tags, locale, content, slug } = body
    
    if (!title || !date || !locale || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    createPost({ title, date, summary, tags: tags || [], locale, content, slug })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { locale, slug, ...data } = body
    
    if (!locale || !slug) {
      return NextResponse.json({ error: 'Missing locale or slug' }, { status: 400 })
    }
    
    updatePost(locale, slug, data)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')
    const slug = searchParams.get('slug')
    
    if (!locale || !slug) {
      return NextResponse.json({ error: 'Missing locale or slug' }, { status: 400 })
    }
    
    const success = deletePost(locale, slug)
    
    if (!success) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
