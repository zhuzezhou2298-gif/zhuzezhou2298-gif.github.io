import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { service } from '../data/content'

export default function MethodPage() {
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
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center font-sans selection:bg-white/20 selection:text-white px-5 py-28 cursor-pointer"
    >
      {/* 点击提示 */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] tracking-[0.3em] text-white/55 uppercase pointer-events-none">
        点击画面任意位置 · {open ? '收起' : '展开'}
      </div>

      {/* 沉浸视频背景 */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="/method-bg.mp4"
        poster="/method-bg-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 z-[1] bg-black/35 pointer-events-none" />

      {/* 居中玻璃卡 · 服务体系六层全链路 */}
      <div ref={ref} className="glass-card relative z-10 w-full max-w-4xl rounded-3xl p-8 sm:p-10 text-white/80">
        <p className="font-mono text-[11px] tracking-[0.3em] text-white/55 uppercase mb-3">{service.num} — SERVICE SYSTEM</p>
        <h2 className="text-white text-2xl sm:text-4xl font-medium tracking-tight leading-tight">
          {service.title}
          <span className="text-white/55 font-light"> · {service.subtitle}</span>
        </h2>
        <p className="mt-4 text-white/65 text-sm leading-relaxed max-w-2xl">{service.intro}</p>

        {/* 六层 */}
        <div className="mt-7 grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {service.layers.map((l) => (
            <div key={l.n} className="flex gap-3">
              <span className="text-white/35 text-lg leading-none pt-0.5 shrink-0">{l.n}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-medium text-sm">{l.t}</span>
                  {l.star && (
                    <span className="text-[10px] font-medium tracking-wider text-[#1a2230] bg-white/85 rounded-full px-2 py-0.5">
                      ★ {l.star}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-white/60 text-xs leading-relaxed">{l.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 收尾 */}
        <p className="mt-7 pt-5 border-t border-white/10 text-white/75 text-sm">{service.closing}</p>
      </div>
    </main>
  )
}
