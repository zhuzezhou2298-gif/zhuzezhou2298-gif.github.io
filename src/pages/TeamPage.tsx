import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { team } from '../data/content'

export default function TeamPage() {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (ref.current) gsap.set(ref.current, { opacity: 0, y: 40 })
  }, [])

  useEffect(() => {
    if (!ref.current) return
    gsap.killTweensOf(ref.current)
    gsap.to(ref.current, open
      ? { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      : { opacity: 0, y: 40, duration: 0.4, ease: 'power2.in' })
  }, [open])

  return (
    <main
      onClick={() => setOpen((o) => !o)}
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-start font-sans selection:bg-white/20 selection:text-white px-5 sm:px-10 lg:px-16 py-28 cursor-pointer"
    >
      {/* 点击提示 */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] tracking-[0.3em] text-white/55 uppercase pointer-events-none">
        点击画面任意位置 · {open ? '收起' : '展开'}
      </div>

      {/* 沉浸视频背景 */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="/team-bg.mp4"
        poster="/team-bg-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 z-[1] bg-black/35 pointer-events-none" />

      {/* 居中玻璃框 · 团队介绍 */}
      <div ref={ref} className="glass-card relative z-10 w-full max-w-md rounded-3xl p-7 sm:p-9 text-white/80">
        <p className="font-mono text-[11px] tracking-[0.3em] text-white/55 uppercase mb-4">{team.num} — TEAM</p>
        <h1 className="text-white text-4xl sm:text-6xl font-medium tracking-tight leading-none mb-3">{team.title}</h1>
        <p className="text-white/65 text-sm sm:text-base mb-7">{team.subtitle}</p>
        <p className="text-white/80 text-sm sm:text-[15px] leading-[1.9]">{team.intro}</p>
      </div>
    </main>
  )
}
