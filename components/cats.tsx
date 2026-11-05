import type { CSSProperties, ReactNode } from 'react'
import { siteConfig, type CatArtworkSlot } from '@/lib/site-config'

/**
 * 全站猫咪插画库 —— EveOneCat / motions.cat 风格。
 *
 * 画法要点（照着 motions.cat 的猫重画的，不是原来那种精致矢量贴纸）：
 *   - 米杏／淡奶黄的平涂，深紫褐色手绘粗描边，圆头圆角、轮廓故意不对称
 *   - 脸上只有两个小点眼和一个 ω 小嘴，没有腮红、虎斑、大眼高光、蝴蝶结
 *   - 身体是一坨软塌塌的「液体猫」，四肢是圆钝的小突起
 *   - 循环动画见 globals.css（呼吸挤压、偶尔抖毛、尾巴摆、眨眼），hover 会炸毛
 *
 * 默认全部是内联 SVG，不联网、不加载字体、不依赖图片；明暗主题由 --cat-* 变量切换。
 * .cat-pupils 由 CatCompanion 写入的 --cat-eye-x/y 驱动，所以猫会一起盯着鼠标。
 *
 * 想换成自己的猫（照片 / GIF / 另一套插画）：打开 lib/site-config.ts 里
 * cat.artwork.enabled，下面的 customArt() 会让所有姿势改渲染图片，无需改本文件。
 * 见 README「二、换猫」。
 *
 * 用法：<CatSitting className="w-40" /> 或 <CatFace style={{ width: 64 }} />
 */

type CatProps = {
  className?: string
  style?: CSSProperties
  /** 眨眼动画错开，避免一页的猫整齐划一地眨眼 */
  blinkDelay?: string
  /** 睡着的猫把眼睛画成两条弧线 */
  sleepy?: boolean
}

/* ---------- 自定义猫图片通道（默认关闭，见 site-config.ts 的 cat.artwork） ---------- */

/** 每个位置的占位比例，跟内置 SVG 的 viewBox 一致，换图后页面布局不会跳动。 */
const ART_RATIO: Record<CatArtworkSlot, string> = {
  face: '100 / 92',
  sitting: '170 / 190',
  loaf: '170 / 120',
  sleep: '190 / 140',
  peek: '120 / 100',
  box: '200 / 190',
  walk: '130 / 90',
  card: '170 / 190',
}

/**
 * 用 background-image 而不是 <img> / SVG <image>：
 * GIF 动图能正常循环播放（SVG <image> 在部分浏览器只显示首帧），
 * 也不走 next/image 的优化链路，public/ 下的图直接可用。
 * 外层保留 .cat-svg 类名，所以 :has() 彩蛋和鼠标互动层都不会失效。
 */
function CustomCat({
  slot,
  light,
  dark,
  alt,
  className,
  style,
}: {
  slot: CatArtworkSlot
  light: string
  dark: string
  alt: string
  className?: string
  style?: CSSProperties
}) {
  const hasDark = dark !== light
  return (
    <span
      className={`cat-svg cat-art ${className ?? ''}`}
      style={{ aspectRatio: ART_RATIO[slot], ...style }}
      data-cat-art={slot}
      data-cat-dark={hasDark ? 'true' : 'false'}
      role="img"
      aria-label={alt}
    >
      <span className="cat-art-layer cat-art-light" style={{ backgroundImage: `url("${light}")` }} />
      {hasDark && (
        <span className="cat-art-layer cat-art-dark" style={{ backgroundImage: `url("${dark}")` }} />
      )}
    </span>
  )
}

/** 每个姿势的统一入口：没开启自定义图时返回 null，继续画内置 SVG。 */
function customArt(slot: CatArtworkSlot, className?: string, style?: CSSProperties) {
  const art = siteConfig.cat.artwork
  if (!art.enabled) return null
  const light = art.variants[slot] || art.src
  if (!light) return null
  const dark = art.darkVariants[slot] || art.darkSrc || light
  return <CustomCat slot={slot} light={light} dark={dark} alt={art.alt} className={className} style={style} />
}

function CatSvg({
  viewBox,
  className,
  style,
  children,
}: {
  viewBox: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <svg
      viewBox={viewBox}
      className={`cat-svg ${className ?? ''}`}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

const LINE = 'var(--cat-line)'
const FUR = 'var(--cat-fur)'
const SHADE = 'var(--cat-fur-2)'
const INNER = 'var(--cat-inner)'
const BELLY = 'var(--cat-belly)'

/** 被子上／身上那种黑色小弯钩爪印，motions.cat 里到处都是。 */
function Hooks({ coords }: { coords: [number, number][] }) {
  return (
    <g fill="none" stroke={LINE} strokeWidth="2.5" strokeLinecap="round" opacity=".72">
      {coords.map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y} q1 -5 5 -5 q3 0 3 3 q0 2 -3 2`}
          transform={i % 2 ? `rotate(14 ${x} ${y})` : undefined}
        />
      ))}
    </g>
  )
}

/** 一根有描边的粗尾巴：外圈深色、内圈毛色，比叠 stroke 干净。 */
function Tail({ d, width = 15 }: { d: string; width?: number }) {
  return (
    <g className="cat-tail">
      <path d={d} fill="none" stroke={LINE} strokeWidth={width + 5} strokeLinecap="round" />
      <path d={d} fill="none" stroke={FUR} strokeWidth={width} strokeLinecap="round" />
    </g>
  )
}

/** 可复用的猫头，坐标固定 0-100，供其它姿势通过 transform 摆放。 */
function CatHead({
  sleepy = false,
  blinkDelay = '0s',
  x = 0,
  y = 0,
  scale = 1,
}: {
  sleepy?: boolean
  blinkDelay?: string
  x?: number
  y?: number
  scale?: number
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="cat-head">
      <g className="cat-head-turn">
      {/* 耳朵先画，压在头下面 */}
      <path d="M22 34 C18 21 19 11 25 9 C31 11 38 18 42 26 Z" fill={FUR} stroke={LINE} strokeWidth="3.4" strokeLinejoin="round" />
      <path d="M58 26 C62 18 69 11 75 9 C81 11 82 21 78 34 Z" fill={FUR} stroke={LINE} strokeWidth="3.4" strokeLinejoin="round" />
      <path d="M27 27 C24 20 24 16 27 14 C30 15 34 20 36 26 Z" fill={INNER} opacity=".8" />
      <path d="M73 27 C76 20 76 16 73 14 C70 15 66 20 64 26 Z" fill={INNER} opacity=".8" />

      {/* 一张圆面包脸，左右故意不对称 */}
      <path
        d="M15 47 C13 29 26 21 50 21 C74 21 87 29 85 47 C84 68 71 79 49 79 C28 79 16 68 15 47 Z"
        fill={FUR}
        stroke={LINE}
        strokeWidth="3.6"
        strokeLinejoin="round"
      />

      {sleepy ? (
        <g fill="none" stroke={LINE} strokeWidth="2.8" strokeLinecap="round">
          <path d="M30 47 q6 6 12 0" />
          <path d="M58 47 q6 6 12 0" />
        </g>
      ) : (
        <g className="cat-eyes" style={{ animationDelay: blinkDelay }}>
          <g className="cat-pupils" fill={LINE}>
            <ellipse cx="37" cy="46" rx="3" ry="4.2" />
            <ellipse cx="63" cy="46" rx="3" ry="4.2" />
            <circle cx="36" cy="44.6" r="1" fill="var(--cat-spark)" />
            <circle cx="62" cy="44.6" r="1" fill="var(--cat-spark)" />
          </g>
        </g>
      )}

      {/* ω 小嘴：EveOneCat 的招牌，没有鼻子、没有腮红 */}
      <path d="M43 58 q3.5 4.6 7 0 q3.5 4.6 7 0" fill="none" stroke={LINE} strokeWidth="2.7" strokeLinecap="round" />

      {/* 两撇短短的胡须 */}
      <g fill="none" stroke={LINE} strokeWidth="2" strokeLinecap="round" opacity=".55">
        <path d="M21 55 L11 52 M21 60 L12 61" />
        <path d="M79 55 L89 52 M79 60 L88 61" />
      </g>
      </g>
    </g>
  )
}

/** 只有一张脸。适合 logo、小图标、目录角标。 */
export function CatFace({ className, style, blinkDelay = '0s', sleepy }: CatProps) {
  const custom = customArt('face', className, style)
  if (custom) return custom
  return (
    <CatSvg viewBox="0 0 100 92" className={className} style={style}>
      <g className="cat-body">
        <CatHead sleepy={sleepy} blinkDelay={blinkDelay} />
      </g>
    </CatSvg>
  )
}

/** 端坐的一坨猫。Hero 主角，会呼吸、偶尔抖毛、尾巴摇。 */
export function CatSitting({ className, style, blinkDelay = '.8s' }: CatProps) {
  const custom = customArt('sitting', className, style)
  if (custom) return custom
  return (
    <CatSvg viewBox="0 0 170 190" className={className} style={style}>
      <Tail d="M126 162 C160 170 164 122 143 108" width={15} />
      <g className="cat-body">
        {/* 一整坨软身体：填充铺满，但只描左右和底边，顶部留白让头压住 —— 不做成「两个球叠起来」 */}
        <path
          d="M84 82 C51 82 35 121 37 153 C38 172 52 180 85 180 C118 180 133 171 134 152 C135 121 117 82 84 82 Z"
          fill={FUR}
        />
        <path
          d="M37 116 C35 138 36 170 52 178 C74 184 104 184 124 176 C133 170 135 140 134 116"
          fill="none"
          stroke={LINE}
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* 肚子上一块淡淡的浅色 */}
        <path d="M62 128 C55 146 57 165 85 168 C113 165 115 146 108 128 C96 136 74 136 62 128 Z" fill={BELLY} opacity=".55" />
        <Hooks coords={[[56, 150], [100, 152]]} />

        {/* 两只圆钝的前爪，没有趾线 */}
        <ellipse cx="62" cy="176" rx="14" ry="8" fill={BELLY} stroke={LINE} strokeWidth="3" />
        <ellipse cx="108" cy="176" rx="14" ry="8" fill={BELLY} stroke={LINE} strokeWidth="3" />

        {/* 头压在身体上，连成一坨 */}
        <CatHead x={35} y={18} scale={1} blinkDelay={blinkDelay} />
      </g>
    </CatSvg>
  )
}

/** 面包猫（loaf）：一整条软面包，爪子全收起来。 */
export function CatLoaf({ className, style, blinkDelay = '2.1s', sleepy }: CatProps) {
  const custom = customArt('loaf', className, style)
  if (custom) return custom
  return (
    <CatSvg viewBox="0 0 170 120" className={className} style={style}>
      <Tail d="M147 92 C166 90 166 70 153 67" width={12} />
      <g className="cat-noodle">
        <path
          d="M18 100 C14 69 35 52 86 52 C136 52 154 69 150 100 C110 112 58 112 18 100 Z"
          fill={FUR}
          stroke={LINE}
          strokeWidth="3.6"
          strokeLinejoin="round"
        />
        <Hooks coords={[[42, 84], [112, 82], [128, 95]]} />
        <ellipse cx="52" cy="104" rx="13" ry="6" fill={BELLY} stroke={LINE} strokeWidth="2.8" />
        <ellipse cx="116" cy="104" rx="13" ry="6" fill={BELLY} stroke={LINE} strokeWidth="2.8" />
        <CatHead x={35} y={-6} scale={0.86} blinkDelay={blinkDelay} sleepy={sleepy} />
      </g>
    </CatSvg>
  )
}

/** 蜷成一团睡觉的猫，配 zzz。空结果 / 页脚用。像 motions.cat 那床被子。 */
export function CatSleep({ className, style }: CatProps) {
  const custom = customArt('sleep', className, style)
  if (custom) return custom
  return (
    <CatSvg viewBox="0 0 190 140" className={className} style={style}>
      <g className="cat-noodle">
        <Tail d="M160 100 C179 90 170 69 149 72" width={13} />
        <ellipse cx="98" cy="89" rx="76" ry="43" fill={FUR} stroke={LINE} strokeWidth="3.6" />
        <path d="M31 92 C46 64 82 57 120 64" fill="none" stroke={SHADE} strokeWidth="3.2" strokeLinecap="round" opacity=".7" />
        <path d="M46 108 C82 122 138 116 160 96" fill="none" stroke={SHADE} strokeWidth="2.8" strokeLinecap="round" opacity=".55" />
        <Hooks coords={[[62, 88], [88, 76], [116, 90], [78, 106], [128, 106]]} />
        <CatHead x={18} y={36} scale={0.72} sleepy />
      </g>
      <g className="cat-zzz" fill="var(--brand)" style={{ fontFamily: 'var(--font-hand)', fontWeight: 700 }}>
        <text x="104" y="34" fontSize="17">z</text>
        <text x="120" y="22" fontSize="22">Z</text>
        <text x="140" y="12" fontSize="28">Z</text>
      </g>
    </CatSvg>
  )
}

/** 从下边缘探出头 + 两只爪子。父容器设 overflow-hidden，靠 CSS 上下滑动。 */
export function CatPeek({ className, style, blinkDelay = '1.4s' }: CatProps) {
  const custom = customArt('peek', className, style)
  if (custom) return custom
  return (
    <CatSvg viewBox="0 0 120 100" className={className} style={style}>
      <g className="cat-body">
        <CatHead x={10} y={2} blinkDelay={blinkDelay} />
        <g className="cat-paws" fill={BELLY} stroke={LINE} strokeWidth="3">
          <ellipse cx="32" cy="92" rx="13" ry="9" />
          <ellipse cx="88" cy="92" rx="13" ry="9" />
        </g>
      </g>
    </CatSvg>
  )
}

/** 猫爪印。用于光标、点击涟漪、装饰；用 currentColor 跟随外部文字色。 */
export function CatPaw({ className, style }: CatProps) {
  return (
    <CatSvg viewBox="0 0 64 64" className={className} style={style}>
      <g fill="currentColor">
        <path d="M17 40 C15 31 22 26 32 26 C42 26 49 32 48 41 C47 51 41 56 32 56 C23 56 18 50 17 40 Z" />
        <ellipse cx="13" cy="24" rx="6.4" ry="8.6" transform="rotate(-17 13 24)" />
        <ellipse cx="26" cy="16" rx="6.4" ry="9" transform="rotate(-5 26 16)" />
        <ellipse cx="42" cy="16" rx="6.4" ry="9" transform="rotate(9 42 16)" />
        <ellipse cx="53" cy="25" rx="6.4" ry="8.6" transform="rotate(19 53 25)" />
      </g>
    </CatSvg>
  )
}

/** 卡通小老鼠光标：代替系统鼠标，猫会盯着它看。手写粗线、圆耳粉鼻、尾巴摆。 */
export function MouseCursor({ className, style }: CatProps) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={`cat-svg ${className ?? ''}`}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g className="mouse-tail">
        <path d="M30 30 C40 31 43 22 38 17" fill="none" stroke="var(--mouse-line)" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <ellipse cx="22" cy="28" rx="13" ry="11" fill="var(--mouse-fur)" stroke="var(--mouse-line)" strokeWidth="3" />
      <circle cx="12" cy="15" r="6.5" fill="var(--mouse-fur)" stroke="var(--mouse-line)" strokeWidth="3" />
      <circle cx="32" cy="15" r="6.5" fill="var(--mouse-fur)" stroke="var(--mouse-line)" strokeWidth="3" />
      <circle cx="12" cy="15" r="3.1" fill="var(--mouse-pink)" />
      <circle cx="32" cy="15" r="3.1" fill="var(--mouse-pink)" />
      <g fill="var(--mouse-line)">
        <circle cx="17" cy="25" r="1.9" />
        <circle cx="27" cy="25" r="1.9" />
      </g>
      <circle cx="22" cy="29.5" r="2.2" fill="var(--mouse-pink)" />
      <g fill="none" stroke="var(--mouse-line)" strokeWidth="1.6" strokeLinecap="round" opacity=".55">
        <path d="M14 30 L6 28 M14 32 L6 33" />
        <path d="M30 30 L38 28 M30 32 L38 33" />
      </g>
      <g fill="var(--mouse-fur)" stroke="var(--mouse-line)" strokeWidth="2.4">
        <ellipse cx="16" cy="38" rx="3.2" ry="2.2" />
        <ellipse cx="28" cy="38" rx="3.2" ry="2.2" />
      </g>
    </svg>
  )
}

/** 小鱼干。摸猫 / 彩蛋奖励。 */
export function CatFish({ className, style }: CatProps) {
  return (
    <CatSvg viewBox="0 0 90 50" className={className} style={style}>
      <g className="cat-fish-wiggle">
        <path d="M24 25 C35 9 58 9 72 25 C58 41 35 41 24 25 Z" fill="var(--cat-fish)" stroke={LINE} strokeWidth="3.2" strokeLinejoin="round" />
        <path d="M24 25 L7 12 L10 25 L7 38 Z" fill="var(--cat-fish)" stroke={LINE} strokeWidth="3.2" strokeLinejoin="round" />
        <circle cx="61" cy="22" r="2.6" fill={LINE} />
        <path d="M39 16 q7 9 0 18 M49 15 q7 10 0 20" fill="none" stroke={LINE} strokeWidth="1.8" strokeLinecap="round" opacity=".45" />
      </g>
    </CatSvg>
  )
}

/** 纸箱里的猫。404 页用。 */
export function CatBox({ className, style, blinkDelay = '3s' }: CatProps) {
  const custom = customArt('box', className, style)
  if (custom) return custom
  return (
    <CatSvg viewBox="0 0 200 190" className={className} style={style}>
      <g className="cat-body">
        <CatHead x={50} y={10} scale={1} blinkDelay={blinkDelay} />
        {/* 箱子：前板 + 顶盖 + 右侧面 */}
        <path d="M28 96 L172 96 L162 176 L38 176 Z" fill="var(--cat-box)" stroke={LINE} strokeWidth="3.4" strokeLinejoin="round" />
        <path d="M28 96 L62 78 L172 78 L172 96 Z" fill="var(--cat-box-2)" stroke={LINE} strokeWidth="3.2" strokeLinejoin="round" />
        <path d="M172 96 L172 78 L190 88 L182 176 L162 176 Z" fill="var(--cat-box-2)" stroke={LINE} strokeWidth="3.2" strokeLinejoin="round" />
        <path d="M100 98 L100 174" stroke={LINE} strokeWidth="2.2" opacity=".3" strokeDasharray="8 8" />
        <ellipse cx="76" cy="96" rx="13" ry="7" fill={BELLY} stroke={LINE} strokeWidth="3" />
        <ellipse cx="126" cy="96" rx="13" ry="7" fill={BELLY} stroke={LINE} strokeWidth="3" />
        <g style={{ fontFamily: 'var(--font-hand)' }} fill={LINE} opacity=".72">
          <text x="46" y="150" fontSize="18" transform="rotate(-6 46 150)">if it fits,</text>
          <text x="52" y="168" fontSize="18" transform="rotate(-6 52 168)">I sits</text>
        </g>
      </g>
    </CatSvg>
  )
}

/** 侧面走路的小猫，页脚分割线上用。正面脸配侧身是故意的沙雕感。 */
export function CatWalk({ className, style }: CatProps) {
  const custom = customArt('walk', className, style)
  if (custom) return custom
  return (
    <CatSvg viewBox="0 0 130 90" className={className} style={style}>
      <Tail d="M96 60 C118 62 118 32 104 28" width={11} />
      <g className="cat-bob">
        <path
          d="M28 46 C28 30 44 26 70 26 C96 26 104 34 104 52 C104 68 90 74 65 74 C40 74 28 66 28 46 Z"
          fill={FUR}
          stroke={LINE}
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
        <Hooks coords={[[62, 46], [86, 54]]} />
        <g fill={BELLY} stroke={LINE} strokeWidth="2.8">
          <ellipse cx="40" cy="76" rx="10" ry="6" />
          <ellipse cx="64" cy="76" rx="10" ry="6" />
          <ellipse cx="90" cy="76" rx="10" ry="6" />
        </g>
        <CatHead x={-8} y={4} scale={0.54} blinkDelay="1.8s" />
      </g>
    </CatSvg>
  )
}

/** 文章卡片无封面时的插画，按序号轮换姿势。 */
export function CardCat({ variant = 0, className, style }: { variant?: number; className?: string; style?: CSSProperties }) {
  const custom = customArt('card', className, style)
  if (custom) return custom
  const pick = ((variant % 4) + 4) % 4
  if (pick === 1) return <CatLoaf className={className} style={style} blinkDelay="1.7s" sleepy />
  if (pick === 2) return <CatSleep className={className} style={style} />
  if (pick === 3) return <CatBox className={className} style={style} blinkDelay="2.4s" />
  return <CatSitting className={className} style={style} blinkDelay=".4s" />
}
