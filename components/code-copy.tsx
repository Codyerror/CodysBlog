'use client'

import { useEffect } from 'react'

/** 给正文里每个代码块注入一个复制按钮（不改 MDX 编译产物，纯 DOM 增强）。 */
export function CodeCopy() {
  useEffect(() => {
    const buttons: HTMLButtonElement[] = []
    const pres = document.querySelectorAll<HTMLElement>('.prose-cody pre')

    pres.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'code-copy-btn'
      button.setAttribute('aria-label', 'Copy code')
      button.textContent = 'Copy'

      button.addEventListener('click', async () => {
        const code = pre.querySelector('code')?.textContent ?? ''
        try {
          await navigator.clipboard.writeText(code)
        } catch {
          const textarea = document.createElement('textarea')
          textarea.value = code
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand('copy')
          textarea.remove()
        }
        button.textContent = 'Copied ✓'
        setTimeout(() => { button.textContent = 'Copy' }, 1600)
      })

      pre.appendChild(button)
      buttons.push(button)
    })

    return () => buttons.forEach((button) => button.remove())
  }, [])

  return null
}
