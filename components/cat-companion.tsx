'use client'

import { useEffect, useRef } from 'react'
import { MouseCursor } from './cats'

/**
 * 全站鼠标互动层，只在有鼠标、且用户没开「减少动态效果」时启用。
 *
 * 1. 把光标位置写成 --cat-eye-x/y，所有 .cat-pupils 一起看向鼠标
 * 2. 一枚带阻尼的猫爪光标，悬停到链接/按钮时放大成「抓抓」
 * 3. 点击时在原地留下淡出的猫爪印
 * 4. 监听 cat:pet / cat:party 自定义事件，集满次数撒小鱼干
 *
 * 不隐藏系统指针、不拦截点击，触屏与 reduced-motion 下完全安静。
 */
export function CatCompanion() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reduced) return

    const cursor = cursorRef.current
    if (!cursor) return

    const root = document.documentElement
    root.classList.add('mouse-cursor-on')
    const temporary: HTMLElement[] = []
    let frame = 0
    let targetX = -100
    let targetY = -100
    let x = -100
    let y = -100
    let lastPrint = 0
    let pets = 0
    let partyLock = false
    let typed = ''

    const animate = () => {
      x += (targetX - x) * 0.2
      y += (targetY - y) * 0.2
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)

    const onMove = (event: MouseEvent) => {
      // 以视口中心为原点的归一化坐标（-1 ~ 1）
      const nx = (event.clientX / window.innerWidth - 0.5) * 2
      const ny = (event.clientY / window.innerHeight - 0.5) * 2

      // 猫眼：瞳孔最多偏移 3px
      root.style.setProperty('--cat-eye-x', `${(nx * 3).toFixed(2)}px`)
      root.style.setProperty('--cat-eye-y', `${(ny * 2.5).toFixed(2)}px`)
      // 猫头：整体朝鼠标方向极轻微地转 / 歪
      root.style.setProperty('--cat-head-x', nx.toFixed(3))
      root.style.setProperty('--cat-head-y', ny.toFixed(3))
      // 背景：跟随鼠标的柔光位置（百分比）+ 网点视差偏移
      root.style.setProperty('--pointer-x', `${(event.clientX / window.innerWidth * 100).toFixed(2)}%`)
      root.style.setProperty('--pointer-y', `${(event.clientY / window.innerHeight * 100).toFixed(2)}%`)
      root.style.setProperty('--bg-ox', `${(nx * 7).toFixed(1)}px`)
      root.style.setProperty('--bg-oy', `${(ny * 7).toFixed(1)}px`)
      root.style.setProperty('--pointer-active', '1')

      targetX = event.clientX
      targetY = event.clientY
      cursor.dataset.hidden = 'false'
    }

    const onOver = (event: MouseEvent) => {
      const node = event.target as Element | null
      const interactive = node?.closest?.('a, button, input, textarea, select, [data-cat-target]')
      cursor.dataset.active = interactive ? 'true' : 'false'
    }

    const onLeave = (event: MouseEvent) => {
      // 只在鼠标真正离开窗口时收起（relatedTarget 为空）
      if (event.relatedTarget) return
      cursor.dataset.hidden = 'true'
      cursor.dataset.active = 'false'
      root.style.setProperty('--cat-eye-x', '0px')
      root.style.setProperty('--cat-eye-y', '0px')
      root.style.setProperty('--cat-head-x', '0')
      root.style.setProperty('--cat-head-y', '0')
      root.style.setProperty('--pointer-active', '0')
    }

    const spawnPrint = (clientX: number, clientY: number) => {
      for (let i = 0; i < 3; i++) {
        const print = document.createElement('div')
        print.className = 'cat-print'
        print.style.left = `${clientX + (i - 1) * 17 + (Math.random() * 8 - 4)}px`
        print.style.top = `${clientY + (i === 1 ? 10 : 2)}px`
        print.style.setProperty('--rot', `${(i - 1) * 26 + (Math.random() * 20 - 10)}deg`)
        print.innerHTML = '<svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true"><g fill="currentColor"><ellipse cx="32" cy="42" rx="16" ry="13"/><ellipse cx="14" cy="24" rx="6.5" ry="8.5" transform="rotate(-18 14 24)"/><ellipse cx="27" cy="16" rx="6.5" ry="9" transform="rotate(-6 27 16)"/><ellipse cx="42" cy="16" rx="6.5" ry="9" transform="rotate(8 42 16)"/><ellipse cx="53" cy="26" rx="6.5" ry="8.5" transform="rotate(20 53 26)"/></g></svg>'
        document.body.appendChild(print)
        temporary.push(print)
        window.setTimeout(() => {
          print.remove()
          const index = temporary.indexOf(print)
          if (index > -1) temporary.splice(index, 1)
        }, 1050)
      }
    }

    const onDown = (event: PointerEvent) => {
      const now = Date.now()
      if (now - lastPrint < 160) return
      lastPrint = now
      spawnPrint(event.clientX, event.clientY)
    }

    const party = (originX?: number, originY?: number) => {
      if (partyLock) return
      partyLock = true
      const cx = originX ?? window.innerWidth / 2
      const cy = originY ?? window.innerHeight / 2
      const treats = ['🐟', '♥', '🐾', '🐟', '♥', '🐾', '🐟', '♥', '🐟', '🐾']
      treats.forEach((treat, i) => {
        const node = document.createElement('span')
        node.className = 'cat-party'
        node.textContent = treat
        node.style.left = `${cx + (Math.random() - 0.5) * 260}px`
        node.style.top = `${cy + (Math.random() - 0.5) * 60}px`
        node.style.setProperty('--spin', `${Math.random() * 120 - 60}deg`)
        node.style.animationDelay = `${i * 70}ms`
        document.body.appendChild(node)
        temporary.push(node)
        window.setTimeout(() => {
          node.remove()
          const index = temporary.indexOf(node)
          if (index > -1) temporary.splice(index, 1)
        }, 3100)
      })
      window.setTimeout(() => { partyLock = false }, 3200)
      document.dispatchEvent(new CustomEvent('cat:treat'))
    }

    const onPet = (event: Event) => {
      pets += 1
      const detail = (event as CustomEvent<{ x?: number; y?: number }>).detail
      if (pets >= 5) {
        pets = 0
        party(detail?.x, detail?.y)
      }
    }

    const onParty = (event: Event) => {
      const detail = (event as CustomEvent<{ x?: number; y?: number }>).detail
      party(detail?.x, detail?.y)
    }

    // 敲出 cat 也能召唤小鱼干
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return
      typed = (typed + event.key.toLowerCase()).slice(-3)
      if (typed === 'cat') {
        typed = ''
        party()
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onLeave)
    window.addEventListener('pointerdown', onDown)
    document.addEventListener('cat:pet', onPet)
    document.addEventListener('cat:party', onParty)
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove('mouse-cursor-on')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onLeave)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('cat:pet', onPet)
      document.removeEventListener('cat:party', onParty)
      window.removeEventListener('keydown', onKey)
      for (const node of temporary) node.remove()
    }
  }, [])

  return (
    <div ref={cursorRef} className="mouse-cursor" data-hidden="true" data-active="false" aria-hidden="true">
      <div className="mouse-cursor-inner">
        <MouseCursor />
      </div>
    </div>
  )
}
