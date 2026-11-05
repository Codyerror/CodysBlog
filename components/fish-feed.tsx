'use client'

import { useRef, useState } from 'react'
import { CatFish } from './cats'

/**
 * 主页右上角可拖拽的小鱼：拖到猫身上松手 → 被「吃掉」（缩小消失）+ 猫冒爱心，
 * 然后鱼回到原位，可以反复玩。纯前端互动，不依赖任何库。
 *
 * - 用 Pointer Events，鼠标 / 触屏都能拖（touch-action:none 防止拖动时页面滚动）
 * - 落入判定：松手时小鱼中心离 [data-cat-target]（主页那只可撸的猫）中心 < 150px
 * - 拖动时给猫加高亮提示（is-near），松手不在范围内则弹回原位
 */
const FEED_RADIUS = 150

export function FishFeed() {
  const fishRef = useRef<HTMLButtonElement>(null)
  const grab = useRef({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [near, setNear] = useState(false)
  const [eating, setEating] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [tried, setTried] = useState(false)

  const catCenter = () => {
    const el = document.querySelector<HTMLElement>('[data-cat-target]')
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }

  const onPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (eating) return
    event.stopPropagation()
    setTried(true)
    const r = fishRef.current!.getBoundingClientRect()
    grab.current = { x: event.clientX - r.left, y: event.clientY - r.top }
    setPos({ x: event.clientX, y: event.clientY })
    setDragging(true)
    fishRef.current!.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return
    setPos({ x: event.clientX - grab.current.x, y: event.clientY - grab.current.y })
    const c = catCenter()
    if (c) {
      const d = Math.hypot(event.clientX - c.x, event.clientY - c.y)
      setNear(d < FEED_RADIUS)
    }
  }

  const onPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return
    event.stopPropagation()
    try {
      fishRef.current!.releasePointerCapture(event.pointerId)
    } catch {
      /* 指针可能已释放 */
    }
    setDragging(false)

    const c = catCenter()
    if (c && Math.hypot(event.clientX - c.x, event.clientY - c.y) < FEED_RADIUS) {
      feed(c)
      return
    }
    // 没喂到：弹回原位
    setNear(false)
    setPos(null)
  }

  const feed = (c: { x: number; y: number }) => {
    setNear(false)
    // 小鱼飞向猫嘴，然后被吃掉
    setPos({ x: c.x, y: c.y })
    setEating(true)
    document.dispatchEvent(
      new CustomEvent('cat:pet', { detail: { x: c.x, y: c.y } }),
    )
    window.setTimeout(() => setHidden(true), 460)
    window.setTimeout(() => {
      setHidden(false)
      setEating(false)
      setPos(null)
    }, 1500)
  }

  return (
    <button
      ref={fishRef}
      type="button"
      aria-label="Drag the fish onto the cat to feed it"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={[
        'fish-feed',
        dragging ? 'is-dragging' : '',
        near ? 'is-near' : '',
        eating ? 'is-eating' : '',
        hidden ? 'is-hidden' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={
        pos
          ? { position: 'fixed', left: pos.x, top: pos.y }
          : undefined
      }
    >
      {!tried && !eating && <span className="fish-tip">drag me</span>}
      <CatFish className="w-14" />
    </button>
  )
}
