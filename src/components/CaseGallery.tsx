import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// ── 案例展厅原型 ──────────────────────────────────────────────
// 几个「空间场景」横向切换浏览，每个空间里有真实产品热点，点击弹出案例。
// 热点坐标 = 原图百分比（图像坐标系）。背景用 <img object-cover>，
// 渲染时按 cover 裁切几何把原图%换算到屏幕位置 —— 任意窗口大小都不跑偏，
// 圈点时直接量「产品在原图里的 x%/y%」填进去即可。

type Hotspot = { x: number; y: number; label: string; caseId: string } // x,y = 原图百分比
type Space = { id: string; name: string; src: string; hotspots: Hotspot[] }

const SPACES: Space[] = [
  {
    id: 's1',
    name: '空间 01 · 家庭客厅',
    src: '/space-living.webp',
    hotspots: [{ x: 24, y: 92, label: '扫地机器人', caseId: 'robot' }],
  },
  {
    id: 's3',
    name: '空间 02 · 梳妆间',
    src: '/space-vanity.webp',
    hotspots: [
      { x: 45, y: 64, label: '护肤品', caseId: 'skin' },
      { x: 38, y: 63, label: '化妆品', caseId: 'makeup' },
    ],
  },
  {
    id: 's4',
    name: '空间 03 · 车库',
    src: '/space-garage.png',
    hotspots: [{ x: 75, y: 60, label: '汽车', caseId: 'car' }],
  },
]

const CASES: Record<string, { title: string; tag: string; desc: string; video?: string; poster?: string; still?: string }> = {
  robot: { title: '扫地机器人 · 案例', tag: 'ROBOT VACUUM', desc: '纯 AI 生成的扫地机器人产品视频。', video: '/video-robot.mp4', poster: '/video-robot-poster.jpg', still: '/still-robot.webp' },
  skin: { title: '护肤品 · 案例', tag: 'SKINCARE', desc: '纯 AI 生成的护肤品产品视频。', video: '/video-skin.mp4', poster: '/video-skin-poster.jpg', still: '/still-skin.webp' },
  makeup: { title: '化妆品 · 案例', tag: 'COSMETICS', desc: '纯 AI 生成的口红 / 美妆产品视频。', video: '/video-makeup.mp4', poster: '/video-makeup-poster.jpg', still: '/still-makeup.webp' },
  car: { title: '汽车 · 案例', tag: 'AUTOMOTIVE', desc: '纯 AI 生成的汽车产品视频。', video: '/video-car.mp4', poster: '/video-car-poster.jpg', still: '/still-car.webp' },
}

export default function CaseGallery() {
  const [index, setIndex] = useState(0)
  const [active, setActive] = useState<string | null>(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [nat, setNat] = useState<Record<string, { w: number; h: number }>>({})
  const sectionRef = useRef<HTMLElement>(null)
  const spaceRefs = useRef<(HTMLDivElement | null)[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const stillRef = useRef<HTMLDivElement>(null)

  // 收回弹窗：淡出 + 缩回后卸载
  const closeModal = () => {
    const p = panelRef.current
    const b = backdropRef.current
    if (p && b) {
      gsap.to(b, { opacity: 0, duration: 0.28, ease: 'power2.in' })
      gsap.to(p, { scale: 0.95, opacity: 0, y: 10, duration: 0.28, ease: 'power2.in', onComplete: () => setActive(null) })
    } else {
      setActive(null)
    }
  }

  // 量容器尺寸（随窗口变化）
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // 把原图百分比 → 容器内屏幕位置（复刻 object-fit:cover 的居中裁切几何）
  const project = (sp: Space, h: Hotspot): { left: string; top: string } => {
    const n = nat[sp.id]
    const { w: cw, h: ch } = box
    if (!n || !cw || !ch) return { left: `${h.x}%`, top: `${h.y}%` } // 图未加载时先用原值占位
    const scale = Math.max(cw / n.w, ch / n.h)
    const dw = n.w * scale
    const dh = n.h * scale
    const ox = (cw - dw) / 2
    const oy = (ch - dh) / 2
    const px = ox + (h.x / 100) * dw
    const py = oy + (h.y / 100) * dh
    return { left: `${(px / cw) * 100}%`, top: `${(py / ch) * 100}%` }
  }

  // 空间切换：crossfade + 轻微推拉（电影感）
  useEffect(() => {
    spaceRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        autoAlpha: i === index ? 1 : 0,
        scale: i === index ? 1 : 1.08,
        duration: 1.1,
        ease: 'power3.out',
      })
    })
  }, [index])

  // 案例弹窗：居中放大淡入
  useEffect(() => {
    if (active && panelRef.current && backdropRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.fromTo(
        panelRef.current,
        { scale: 0.92, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      )
      // 首帧从视频后方弹出到左侧
      if (stillRef.current) {
        gsap.fromTo(
          stillRef.current,
          { x: 60, opacity: 0, scale: 0.9 },
          { x: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'power3.out', delay: 0.28 },
        )
      }
    }
  }, [active])

  // ESC 关闭
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const go = (dir: number) => {
    setActive(null)
    setIndex((i) => (i + dir + SPACES.length) % SPACES.length)
  }

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden bg-black" style={{ height: '100dvh' }}>
      {/* 空间场景层 */}
      {SPACES.map((space, i) => (
        <div
          key={space.id}
          ref={(el) => (spaceRefs.current[i] = el)}
          className="absolute inset-0"
          style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }}
        >
          {/* 背景图：object-cover 铺满 */}
          <img
            src={space.src}
            alt={space.name}
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
            onLoad={(e) => {
              const im = e.currentTarget
              setNat((p) => (p[space.id] ? p : { ...p, [space.id]: { w: im.naturalWidth, h: im.naturalHeight } }))
            }}
          />

          {/* 噪点/暗角，模拟空间纵深 */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 100% at 50% 32%, rgba(0,0,0,.12) 25%, rgba(0,0,0,.6)), linear-gradient(to top, rgba(0,0,0,.6), transparent 42%)' }} />

          {/* 产品热点 */}
          {space.hotspots.map((h) => {
            const pos = project(space, h)
            return (
              <button
                key={h.caseId}
                onClick={() => setActive(h.caseId)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: pos.left, top: pos.top }}
                aria-label={h.label}
              >
                <span className="block w-3.5 h-3.5 rounded-full bg-white ring-2 ring-black/30 shadow-[0_0_16px_rgba(0,0,0,0.55),0_0_0_7px_rgba(255,255,255,0.16)] animate-pulse group-hover:scale-125 transition-transform" />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[11px] tracking-wider text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                  {h.label} ↗
                </span>
              </button>
            )
          })}

          {/* 空间名 */}
          <div className="absolute top-28 right-10 text-right font-mono text-xs tracking-widest text-white/90" style={{ textShadow: '0 1px 10px rgba(0,0,0,.7)' }}>
            {space.name}
          </div>
        </div>
      ))}

      {/* 标题 · 移到左上，避免压住左下角产品热点 */}
      <div className="absolute top-28 left-10 z-20 pointer-events-none">
        <h2 className="text-white text-4xl sm:text-6xl font-bold tracking-tight" style={{ textShadow: '0 2px 16px rgba(0,0,0,.6)' }}>案例展厅</h2>
        <p className="text-white/80 mt-2 text-sm" style={{ textShadow: '0 1px 10px rgba(0,0,0,.6)' }}>转动空间，点亮每个真实存在的作品</p>
      </div>

      {/* 左右切换 + 指示 */}
      <div className="absolute bottom-10 right-10 z-20 flex items-center gap-4">
        <button onClick={() => go(-1)} className="w-11 h-11 rounded-full border border-white/30 text-white hover:bg-white/10 transition" aria-label="上一个空间">←</button>
        <span className="font-mono text-sm text-white/80 w-12 text-center">{String(index + 1).padStart(2, '0')} / {String(SPACES.length).padStart(2, '0')}</span>
        <button onClick={() => go(1)} className="w-11 h-11 rounded-full border border-white/30 text-white hover:bg-white/10 transition" aria-label="下一个空间">→</button>
      </div>

      {/* 案例弹窗 · 居中弹出，点遮罩/ESC 自动收回 */}
      {active && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-6" onClick={closeModal}>
          {/* 遮罩 */}
          <div ref={backdropRef} className="absolute inset-0 bg-black/55 backdrop-blur-md" />
          {/* 左侧竖构图首帧 · 独立钉在左侧边距，不与横版视频重叠 */}
          {CASES[active].video && CASES[active].still && (
            <div
              ref={stillRef}
              onClick={(e) => e.stopPropagation()}
              className="absolute z-20 left-5 top-1/2 -translate-y-1/2 hidden xl:block"
              style={{ width: 'clamp(170px, calc(50vw - 426px), 270px)' }}
            >
              <img src={CASES[active].still} alt="" className="w-full aspect-[9/16] rounded-2xl object-cover bg-black border border-white/15 shadow-[0_24px_60px_rgba(0,0,0,.6)]" />
              <div className="mt-2 pl-1 text-left font-mono text-[10px] tracking-widest text-white/50">首帧 · STILL</div>
            </div>
          )}

          {/* 中间主面板（点本身不收回）— 文案 + 16:9 视频 */}
          <div
            ref={panelRef}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[780px] text-center"
          >
            <button onClick={closeModal} className="absolute -top-9 right-0 text-white/60 hover:text-white text-2xl leading-none" aria-label="关闭">×</button>
            <div className="font-mono text-xs tracking-widest text-white/50">{CASES[active].tag}</div>
            <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-white">{CASES[active].title}</h3>
            <p className="mt-2 text-white/70 text-sm leading-relaxed">{CASES[active].desc}</p>
            {CASES[active].video ? (
              <div className="mt-6">
                {/* 原本视频 · 16:9 居中主体，保持不变 */}
                <video
                  src={CASES[active].video}
                  poster={CASES[active].poster}
                  className="w-full aspect-video rounded-2xl object-cover bg-black border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,.6)]"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
            ) : (
              <div className="mt-6 aspect-video rounded-2xl border border-dashed border-white/20 flex items-center justify-center text-white/40 text-sm">
                案例图 / 视频占位
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
