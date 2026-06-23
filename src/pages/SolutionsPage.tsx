import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { solutions, method } from '../data/content'

export default function SolutionsPage() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (leftRef.current) gsap.set(leftRef.current, { opacity: 0, x: -40 })
    if (rightRef.current) gsap.set(rightRef.current, { opacity: 0, x: 40 })
  }, [])

  useEffect(() => {
    const l = leftRef.current
    const r = rightRef.current
    if (l) {
      gsap.killTweensOf(l)
      gsap.to(l, open ? { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' } : { opacity: 0, x: -40, duration: 0.4, ease: 'power2.in' })
    }
    if (r) {
      gsap.killTweensOf(r)
      gsap.to(r, open ? { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.08 } : { opacity: 0, x: 40, duration: 0.4, ease: 'power2.in' })
    }
  }, [open])

  return (
    <main
      onClick={() => setOpen((o) => !o)}
      className="relative w-full min-h-[100dvh] overflow-hidden font-sans selection:bg-white/20 selection:text-white cursor-pointer"
    >
      {/* 点击提示 */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-20 font-mono text-[10px] tracking-[0.3em] text-white/55 uppercase pointer-events-none">
        点击画面任意位置 · {open ? '收起' : '展开'}
      </div>

      {/* 沉浸视频背景 */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="/footer-bg.mp4"
        poster="/footer-bg-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 z-[1] bg-black/30 pointer-events-none" />

      {/* 左右两侧玻璃卡 */}
      <div className="relative z-10 min-h-[100dvh] w-full max-w-[1520px] mx-auto px-5 sm:px-8 pt-24 pb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* 左卡 · 如何为品牌赋能 */}
        <div ref={leftRef} className="glass-card rounded-3xl p-7 sm:p-9 w-full lg:w-[40%] text-white/80">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/55 uppercase mb-3">{solutions.num} — SOLUTIONS</p>
          <h2 className="text-white text-2xl sm:text-3xl font-medium tracking-tight leading-tight mb-6">
            AI 时代，我们如何为品牌赋能
          </h2>
          <ul className="space-y-4">
            {solutions.items.map((it, i) => {
              const [lead, ...rest] = it.split('：')
              const desc = rest.join('：')
              return (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[11px] text-white/40 pt-1 shrink-0">0{i + 1}</span>
                  <p className="text-sm leading-relaxed">
                    <span className="text-white font-medium">{lead}</span>
                    <span className="text-white/65">：{desc}</span>
                  </p>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 右卡 · 每个环节如何融合 AI */}
        <div ref={rightRef} className="glass-card rounded-3xl p-7 sm:p-9 w-full lg:w-[56%] text-white/75">
          <h2 className="text-white text-2xl sm:text-3xl font-medium tracking-tight leading-tight mb-6">
            每个环节如何融合 AI，为品牌定制
          </h2>
          {/* 表头 */}
          <div className="grid grid-cols-[70px_1fr_1fr] gap-3 sm:gap-4 pb-3 font-mono text-[10px] tracking-wider uppercase text-white/45">
            <div>环节</div>
            <div>融合 AI 的方式</div>
            <div>为品牌定制</div>
          </div>
          {/* 表体 */}
          <div className="divide-y divide-white/10 border-t border-white/10">
            {method.rows.map((r) => (
              <div key={r.phase} className="grid grid-cols-[70px_1fr_1fr] gap-3 sm:gap-4 py-3 items-start">
                <div className="text-white font-medium text-xs">{r.phase}</div>
                <div className="text-white/65 text-xs leading-relaxed">{r.ai}</div>
                <div className="text-white/85 text-xs leading-relaxed">{r.custom}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
