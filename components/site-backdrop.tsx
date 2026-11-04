import { CatPaw } from './cats'

/** 纸张底纹 + 几枚很淡的猫爪印，纯装饰。刻意不用渐变光晕和网格。 */
const paws: { left: string; top: string; rotate: number; size: number }[] = [
  { left: '4%', top: '14%', rotate: -22, size: 54 },
  { left: '11%', top: '26%', rotate: -12, size: 42 },
  { left: '88%', top: '12%', rotate: 28, size: 58 },
  { left: '93%', top: '31%', rotate: 16, size: 40 },
  { left: '7%', top: '72%', rotate: 34, size: 48 },
  { left: '82%', top: '78%', rotate: -28, size: 52 },
  { left: '46%', top: '92%', rotate: 8, size: 36 },
]

export function SiteBackdrop() {
  return (
    <div className="site-backdrop" aria-hidden="true">
      {paws.map((paw, i) => (
        <CatPaw
          key={i}
          className="backdrop-paw"
          style={{
            left: paw.left,
            top: paw.top,
            width: paw.size,
            transform: `rotate(${paw.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
