import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { X } from 'lucide-react'

type Status = 'idle' | 'sending' | 'ok' | 'err'

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (backdropRef.current) gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    if (cardRef.current) gsap.fromTo(cardRef.current, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const data = new FormData(e.currentTarget)
    try {
      const res = await fetch('https://formsubmit.co/ajax/425343499@qq.com', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  const field = 'w-full bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors'

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div ref={backdropRef} className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()}
        className="glass-card relative w-full max-w-md rounded-3xl p-7 sm:p-9 text-white/80"
      >
        <button onClick={onClose} aria-label="关闭" className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors">
          <X size={22} />
        </button>

        <p className="font-mono text-[11px] tracking-[0.3em] text-white/55 uppercase mb-2">Let's build together</p>
        <h2 className="text-white text-2xl sm:text-3xl font-medium tracking-tight">合作咨询</h2>
        <p className="mt-2 text-white/65 text-sm">留下邮箱或电话，我们会尽快联系你。</p>

        {status === 'ok' ? (
          <div className="mt-7 py-4">
            <div className="text-white text-lg font-medium">已收到，谢谢！</div>
            <p className="mt-2 text-white/65 text-sm leading-relaxed">我们会尽快与你联系。</p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input type="hidden" name="_subject" value="光合官网 · 新的合作咨询" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input className={field} type="text" name="邮箱或电话" placeholder="邮箱或电话" required autoFocus />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-white text-gray-900 rounded-xl py-3 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-60"
            >
              {status === 'sending' ? '提交中…' : '提交'}
            </button>
            {status === 'err' && <p className="text-red-300 text-xs">提交失败，请稍后重试。</p>}
          </form>
        )}
      </div>
    </div>
  )
}
