import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { CardCat, CatPeek, CatPaw } from './cats'
import { formatDate } from '@/lib/utils'
import { getMessage } from '@/lib/i18n'

/** 传给客户端列表的精简文章数据（不携带 MDX 编译后的大字符串）。 */
export type PostCardData = {
  _id: string
  title: string
  date: string
  summary?: string
  tags?: string[]
  slug: string
  cover?: string
  draft?: boolean
  readingTime?: { text: string; minutes?: number }
  wordCount?: number
}

/** 每张卡片的猫咪背景换一个颜色，避免整页一模一样。 */
const tints = [
  'bg-brandsoft/55',
  'bg-surface2',
  'bg-accent/10',
  'bg-violet/10',
]

export function PostCard({ post, locale, index = 0 }: { post: PostCardData; locale: string; index?: number }) {
  const t = (key: string) => getMessage(locale, key)
  const tint = tints[index % tints.length]
  const minutes = post.readingTime?.minutes
  const readLabel = minutes
    ? locale === 'zh-CN'
      ? `约 ${Math.max(1, Math.round(minutes))} 分钟`
      : `${Math.max(1, Math.round(minutes))} min read`
    : post.readingTime?.text

  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="block group h-full">
      <article className="post-card glass-card !rounded-[16px] h-full flex flex-col">
        {post.cover ? (
          <div className="h-40 overflow-hidden rounded-t-[14px] border-b-2 border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        ) : (
          <div className={`relative h-36 ${tint} overflow-hidden rounded-t-[14px] border-b-2 border-line`}>
            <CatPaw className="absolute right-5 top-4 w-6 text-brand opacity-25 rotate-12" />
            <CatPaw className="absolute left-6 top-9 w-4 text-brand opacity-20 -rotate-12" />
            <span className="absolute left-4 bottom-3 hand text-[11px] text-brandstrong opacity-80">
              no.{String(index + 1).padStart(2, '0')}
            </span>
            <CardCat
              variant={index}
              className="card-art absolute bottom-0 left-1/2 -translate-x-1/2 w-[132px]"
            />
            <CatPeek className="card-peek text-brand" blinkDelay={`${index * 0.4}s`} />
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs text-muted mb-3">
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            <span className="w-1 h-1 rounded-full bg-line" />
            <span className="inline-flex items-center gap-1">
              <Clock3 className="w-3 h-3" />
              {readLabel ?? `~${Math.max(1, Math.round((post.wordCount ?? 0) / 400))} min`}
            </span>
            {post.draft && <span className="chip !py-0 !px-2 !text-[10px] ml-auto text-brandstrong">{t('post.draft')}</span>}
          </div>

          <h2 className="text-lg font-bold text-ink leading-snug mb-2 group-hover:text-brandstrong transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">{post.summary}</p>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {(post.tags ?? []).slice(0, 3).map((tag) => (
                <span key={tag} className="chip !text-[11px] !py-0.5">#{tag}</span>
              ))}
            </div>
            <ArrowUpRight className="card-arrow w-4 h-4 shrink-0 text-muted group-hover:text-brandstrong" />
          </div>
        </div>
      </article>
    </Link>
  )
}
