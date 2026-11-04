import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site-config'

/**
 * 必须用 Edge 运行时：@vercel/og 的 Node 版本在 Windows 上静态预渲染时
 * 会因 fileURLToPath 拿到盘符路径而抛 "Invalid URL"。
 * 猫脸用纯 div 拼（Satori 对内联 SVG 支持有限），且只用英文，避免缺中文字体。
 */
export const runtime = 'edge'
export const alt = `${siteConfig.name} · ${siteConfig.subtitle}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * OG 卡片里的猫头：和站内的 EveOneCat 风保持一致 —— 淡奶黄平涂、
 * 深紫褐粗描边、两个小点眼、一个 ω 嘴，没有腮红/虎斑/大眼/领结。
 * Satori 对内联 SVG 支持有限，所以用绝对定位的 div 拼。
 */
function CatFace() {
  const ink = '#4b3a43'
  const fur = '#f2e6b6'
  const ear = {
    position: 'absolute' as const,
    top: 6,
    width: 76,
    height: 76,
    background: fur,
    border: `6px solid ${ink}`,
    borderRadius: 14,
    transform: 'rotate(45deg)',
    display: 'flex',
  }
  const whisker = {
    position: 'absolute' as const,
    width: 34,
    height: 4,
    borderRadius: 4,
    background: ink,
    opacity: 0.55,
    display: 'flex',
  }
  return (
    <div style={{ position: 'relative', width: 280, height: 270, display: 'flex' }}>
      <div style={{ ...ear, left: 26 }} />
      <div style={{ ...ear, right: 26 }} />
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 46,
          width: 264,
          height: 214,
          borderRadius: 132,
          background: fur,
          border: `6px solid ${ink}`,
          display: 'flex',
        }}
      >
        {/* 两个小点眼 + 一点高光 */}
        <div style={{ position: 'absolute', left: 60, top: 84, width: 16, height: 22, borderRadius: 10, background: ink, display: 'flex' }} />
        <div style={{ position: 'absolute', left: 188, top: 84, width: 16, height: 22, borderRadius: 10, background: ink, display: 'flex' }} />
        <div style={{ position: 'absolute', left: 63, top: 88, width: 5, height: 5, borderRadius: 3, background: '#fff4dd', display: 'flex' }} />
        <div style={{ position: 'absolute', left: 191, top: 88, width: 5, height: 5, borderRadius: 3, background: '#fff4dd', display: 'flex' }} />
        {/* ω 小嘴 */}
        <div style={{ position: 'absolute', left: 108, top: 118, fontSize: 52, lineHeight: 1, color: ink, display: 'flex' }}>ω</div>
        {/* 两撇短胡须 */}
        <div style={{ ...whisker, left: -18, top: 112, transform: 'rotate(12deg)' }} />
        <div style={{ ...whisker, left: -18, top: 132, transform: 'rotate(-8deg)' }} />
        <div style={{ ...whisker, right: -18, top: 112, transform: 'rotate(-12deg)' }} />
        <div style={{ ...whisker, right: -18, top: 132, transform: 'rotate(8deg)' }} />
      </div>
    </div>
  )
}

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          background: '#fbf7ee',
          color: '#2e2923',
          fontFamily: 'sans-serif',
          border: '18px solid #ded1b9',
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 16, height: 16, borderRadius: 16, background: '#df7a3c', display: 'flex' }} />
          <div style={{ fontSize: 24, color: '#8d8273', letterSpacing: 2 }}>{siteConfig.subtitle}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 104, fontWeight: 800, letterSpacing: -4, lineHeight: 1.05 }}>{siteConfig.name}</div>
          <div style={{ fontSize: 32, color: '#b45525', marginTop: 20 }}>{siteConfig.tagline}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 22, color: '#8d8273' }}>
          <div style={{ display: 'flex' }}>{siteConfig.siteUrl.replace(/^https?:\/\//, '')} · by {siteConfig.author}</div>
          <div style={{ display: 'flex', color: '#b45525' }}>meow.</div>
        </div>

        <div style={{ position: 'absolute', right: 92, bottom: 90, display: 'flex', transform: 'rotate(-6deg)' }}>
          <CatFace />
        </div>
      </div>
    ),
    size,
  )
}
