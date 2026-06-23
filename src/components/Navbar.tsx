import { useState } from 'react'
import { Menu } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import { nav, ROUTES } from '../data/content'
import PhotosynLogo from './PhotosynLogo'
import ContactModal from './ContactModal'

// 始终深底（浅色导航）的页面
const DARK_BG_ROUTES = new Set(['/cases', '/solutions', '/team', '/method'])

export default function Navbar() {
  const { pathname } = useLocation()
  const [contactOpen, setContactOpen] = useState(false)

  // 解析当前导航主题：light = 浅色字（深底），dark = 深色字（浅底）
  const light = DARK_BG_ROUTES.has(pathname)

  const logoColor = light ? 'text-white' : 'text-gray-900'
  const pillWrap = light ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'
  const ctaCls = light
    ? 'bg-white text-gray-900 hover:bg-white/90'
    : 'bg-gray-900 text-white hover:bg-gray-800'
  const menuCls = light ? 'text-white' : 'text-gray-900'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        {/* Left: 光合 PHOTOSYN logo → 首页 */}
        <NavLink to="/" aria-label="光合 PHOTOSYN 首页">
          <PhotosynLogo className={`h-7 sm:h-9 w-auto transition-colors duration-500 ${logoColor}`} />
        </NavLink>

        {/* Center pill: 路由导航 */}
        <div
          className={`hidden md:flex absolute left-1/2 -translate-x-1/2 backdrop-blur-md border rounded-full px-2 py-2 items-center gap-1 transition-colors duration-500 ${pillWrap}`}
        >
          {ROUTES.map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              end={r.path === '/'}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? light
                      ? 'bg-white text-gray-900'
                      : 'bg-gray-900 text-white'
                    : light
                      ? 'text-white/75 hover:bg-white/10 hover:text-white'
                      : 'text-gray-600 hover:bg-black/5 hover:text-gray-900'
                }`
              }
            >
              {r.label}
            </NavLink>
          ))}
        </div>

        {/* Right: CTA + 移动端菜单 → 打开合作咨询弹窗 */}
        <button
          onClick={() => setContactOpen(true)}
          className={`hidden md:block text-sm font-semibold px-6 py-2.5 rounded-full transition-colors duration-500 ${ctaCls}`}
        >
          {nav.cta}
        </button>
        <button
          onClick={() => setContactOpen(true)}
          className={`md:hidden transition-colors duration-500 ${menuCls}`}
          aria-label="合作咨询"
        >
          <Menu size={24} />
        </button>
      </nav>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  )
}
