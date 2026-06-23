import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { images } from '../data/assets'
import { hero } from '../data/content'

const SPOTLIGHT_R = 260

export default function SpotlightHero() {
  const revealRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = revealRef.current
    if (!el) return

    // 聚光是核心交互，始终启用；reduce-motion 只去掉缓动（直接跟随，不做平滑）
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = reduce ? 1 : 0.12

    const pos = { x: -999, y: -999 }
    const target = { x: -999, y: -999 }
    // quickSetter 显式带 'px' 单位 —— 杜绝 CSS 变量单位歧义；GPU 合成、无 toDataURL
    const setX = gsap.quickSetter(el, '--mx', 'px')
    const setY = gsap.quickSetter(el, '--my', 'px')

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      pos.x += (target.x - pos.x) * ease
      pos.y += (target.y - pos.y) * ease
      setX(pos.x)
      setY(pos.y)
    }
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden h-screen bg-[#e9e6e1]"
      style={{ height: '100dvh' }}
    >
      {/* Base image (z-10) — 浅色裸岩，缩小占比、上下留白 */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat z-10 hero-zoom"
        style={{ backgroundImage: `url("${images.base}")`, backgroundSize: 'cover' }}
      />

      {/* Reveal layer (z-30) — CSS mask radial-gradient, GPU 合成 */}
      <div
        ref={revealRef}
        className="reveal-layer absolute inset-0 bg-center bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url("${images.reveal}")`,
          backgroundSize: 'cover',
          ['--r' as string]: `${SPOTLIGHT_R}px`,
        }}
      />

      {/* Heading (z-50) — 深色文字适配浅底 */}
      <div className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
        <h1 className="text-gray-900 leading-[0.95]">
          <span
            className="block font-light text-2xl sm:text-3xl md:text-4xl mb-3 text-gray-700 hero-anim hero-reveal"
            style={{ letterSpacing: '0.04em', animationDelay: '0.25s' }}
          >
            {hero.headingLine1}
          </span>
          <span
            className="block font-bold text-5xl sm:text-6xl md:text-7xl hero-anim hero-reveal"
            style={{ letterSpacing: '0.04em', animationDelay: '0.42s' }}
          >
            {hero.headingLine2}
          </span>
        </h1>
      </div>

      {/* Bottom-left paragraph (z-50) */}
      <div
        className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="text-sm text-gray-600 leading-relaxed">{hero.leftParagraph}</p>
      </div>

    </section>
  )
}
