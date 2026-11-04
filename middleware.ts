import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['en', 'zh-CN']
const DEFAULT_LOCALE = 'en'

/** 这些是 App Router 的元数据资源路由，不带语言前缀，不能被重定向。 */
const META_ROUTES = ['/opengraph-image', '/twitter-image', '/icon', '/apple-icon']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (META_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}`, request.url))
  }

  const segments = pathname.split('/').filter(Boolean)
  const first = segments[0]

  // 没带语言前缀的页面统一补默认语言，例如 /blog -> /en/blog
  if (first && !LOCALES.includes(first)) {
    return NextResponse.redirect(new URL(`/${DEFAULT_LOCALE}${pathname}`, request.url))
  }

  /**
   * 后台会直接读写本地 .mdx 文件，且目前没有账号体系。
   * 线上（Vercel 等）文件系统是只读的，写操作不会生效，暴露出来还有安全风险，
   * 因此默认只在本地开发环境开放。确需线上开放时设置 ENABLE_ADMIN=true 并自行加鉴权。
   */
  if (
    segments[1] === 'admin' &&
    process.env.NODE_ENV === 'production' &&
    process.env.ENABLE_ADMIN !== 'true'
  ) {
    return new NextResponse('Not found', { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!api|_next|.*\\..*).*)'],
}
