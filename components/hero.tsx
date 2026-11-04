'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Shuffle, Rss } from 'lucide-react'
import { CatSitting, CatFish, CatPaw } from './cats'
import { getMessage } from '@/lib/i18n'
import { siteConfig } from '@/lib/site-config'

type Stats = { posts: number; tags: number; words: number }
type Heart = { id: number; left: number; top: number }

export function Hero({ locale, stats, slugs }: { locale: string; stats: Stats; slugs: string[] }) {
  const router = useRouter()
  const t = (key: string, vars?: Record<string, string | number>) => getMessage(locale, key, vars)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [pets, setPets] = useState(0)
  const [hearts, setHearts] = useState<Heart[]>([])
  const [treat, setTreat] = useState(false)
  const [purr, setPurr] = useState(false)

  const en = locale === 'en'

  useEffect(() => {
    const onTreat = () => {
      setTreat(true)
      window.setTimeout(() => setTreat(false), 3200)
    }
    document.addEventListener('cat:treat', onTreat)
    return () => document.removeEventListener('cat:treat', onTreat)
  }, [])

  const randomPost = useCallback(() => {
    if (!slugs.length) {
      router.push(`/${locale}/blog`)
      return
    }
    router.push(`/${locale}/blog/${slugs[Math.floor(Math.random() * slugs.length)]}`)
  }, [locale, router, slugs])

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTilt({
      x: ((event.clientY - rect.top) / rect.height - 0.5) * -5,
      y: ((event.clientX - rect.left) / rect.width - 0.5) * 5,
    })
  }

  /** 摸猫：冒爱心 + 呼噜一声，同时累加到全站彩蛋计数器。 */
  const petTheCat = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const originX = Math.round(event.clientX - rect.left)
    const originY = Math.round(event.clientY - rect.top)
    const batch: Heart[] = Array.from({ length: 3 }, (_, i) => ({
      id: Date.now() + i,
      left: originX + (i - 1) * 22,
      top: originY - 10,
    }))
    setHearts((prev) => [...prev, ...batch])
    setPets((count) => count + 1)
    setPurr(true)
    window.setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => !batch.some((item) => item.id === heart.id)))
    }, 1250)
    window.setTimeout(() => setPurr(false), 1400)
    document.dispatchEvent(
      new CustomEvent('cat:pet', { detail: { x: event.clientX, y: event.clientY } }),
    )
  }

  const compactWords = useMemo(
    () => (stats.words >= 10000 ? `${(stats.words / 10000).toFixed(1)}w` : stats.words.toLocaleString()),
    [stats.words],
  )

  return (
    <section className="mx-auto max-w-6xl px-5 pt-12 pb-4 md:pt-20 md:pb-8">
      <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-14 items-center">
        {/* 左：一句普通的话，不要大词 */}
        <div>
          <span className="eyebrow fade-up">{t('home.kicker')}</span>

          <h1 className="fade-up delay-1 mt-5 text-[2.7rem] leading-[1.16] sm:text-[3.5rem] font-extrabold tracking-tight text-ink">
            {t('home.hello')}
            <br />
            <span className="hand gradient-text">{en ? 'this is my notebook.' : '这是我的笔记本。'}</span>
          </h1>

          <p className="fade-up delay-2 mt-6 max-w-lg text-[1.05rem] leading-relaxed text-inksoft">
            {t('home.lede')}
          </p>

          <div className="fade-up delay-3 mt-8 flex flex-wrap items-center gap-3">
            <Link href={`/${locale}/blog`} className="btn-primary">
              {t('home.explore')} <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={randomPost} className="btn-outline" disabled={!slugs.length}>
              <Shuffle className="w-4 h-4" /> {t('home.surprise')}
            </button>
          </div>

          <div className="fade-up delay-4 mt-11 tape-note max-w-md px-5 py-4">
            <p className="hand text-sm text-brandstrong mb-2">{t('home.soFar')}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { value: stats.posts, label: t('home.statPosts') },
                { value: stats.tags, label: t('home.statTags') },
                { value: compactWords, label: t('home.statWords') },
              ].map((item) => (
                <div key={item.label} className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-ink">{item.value}</span>
                  <span className="text-xs text-muted">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右：猫，站在窗台上盯着你的鼠标 */}
        <div
          className="fade-up delay-2 relative"
          onMouseMove={onMove}
          onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          style={{ perspective: '900px' }}
        >
          <div
            className="glass-card relative px-6 pt-6 pb-5 cat-pettable transition-transform duration-200 ease-out"
            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
          >
            {/* 名牌 */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="hand text-base text-brandstrong leading-tight">{t('home.catCaption')}</p>
                <p className="mt-1 text-[11px] text-muted">{siteConfig.cat.name} · {siteConfig.cat.title}</p>
              </div>
              <CatFish className="w-14 mt-1 -rotate-12 shrink-0" />
            </div>

            {/* 猫本体：悬停/点击都会被撸 */}
            <div
              className="relative mt-2 flex justify-center"
              onMouseEnter={petTheCat}
              onClick={petTheCat}
              data-cat-target
              role="button"
              tabIndex={0}
              aria-label={`${siteConfig.cat.name}, ${t('post.petMe')}`}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  setPets((count) => count + 1)
                  setPurr(true)
                  window.setTimeout(() => setPurr(false), 1400)
                }
              }}
            >
              <div className="relative w-[230px] sm:w-[260px] cursor-pointer">
                <CatSitting className="w-full" blinkDelay="1.2s" />
                {/* 窗台横线 */}
                <div className="absolute -bottom-1 left-[-10%] right-[-10%] h-[3px] rounded-full bg-line" />
              </div>

              {hearts.map((heart) => (
                <span
                  key={heart.id}
                  className="pet-heart"
                  style={{ left: heart.left, top: heart.top }}
                >
                  ♥
                </span>
              ))}

              {(purr || treat) && (
                <span className="absolute -top-3 right-1 z-10 rounded-xl rounded-br-sm border-2 border-line bg-surface px-3 py-1.5 text-xs hand text-brandstrong shadow-[3px_3px_0_var(--sticker)] fade-up whitespace-nowrap">
                  {treat ? t('home.catTreat') : t('home.catPurr')}
                </span>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-line pt-3">
              <p className="text-[11px] text-muted flex items-center gap-1.5">
                <CatPaw className="w-3.5 text-brand" /> {t('home.catHint')}
              </p>
              {pets > 0 && (
                <span className="chip !text-[10px] !py-0.5">{t('home.petCount', { count: pets })}</span>
              )}
            </div>
          </div>

          <Link
            href={`/${locale}/rss.xml`}
            className="absolute -bottom-4 -right-2 hidden sm:inline-flex items-center gap-1.5 rounded-xl border-2 border-line bg-surface px-3 py-1.5 text-[11px] text-muted rotate-6 shadow-[2px_3px_0_var(--sticker)] hover:text-brandstrong hover:border-brand transition-colors"
          >
            <Rss className="w-3 h-3" /> rss
          </Link>
        </div>
      </div>
    </section>
  )
}
