import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Sidebar from './Sidebar'
import useThemeStore from '../../store/themeStore'

export default function AppLayout() {
  const { token } = useAuthStore()
  const { theme } = useThemeStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  if (!token) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-canvas">

      
      {/* ── DEBUG PANEL ── remove after fixing ── */}
      <div style={{
        position: 'fixed', bottom: 16, right: 16,
        background: '#1e293b', color: '#e2e8f0',
        padding: '10px 14px', borderRadius: 8,
        fontSize: 12, zIndex: 9999,
        border: '1px solid #334155', lineHeight: 1.8
      }}>
        <div>mobileOpen: <b style={{color: mobileOpen ? '#4ade80' : '#f87171'}}>
          {String(mobileOpen)}</b></div>
        <div>collapsed: <b>{String(collapsed)}</b></div>
        <div>window.innerWidth: <b>{window.innerWidth}px</b></div>
      </div>
      
      {/* ── END DEBUG PANEL ── */}

      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onCollapse={setCollapsed}
      />

      <div className={`
        flex-1 flex flex-col min-w-0 transition-all duration-300
        ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>

        <header className="lg:hidden sticky top-0 z-20 bg-surface1
          border-b border-slate-800 px-4 py-3 flex items-center gap-3">

          <button
            onClick={() => {
              console.log('hamburger clicked — mobileOpen will be:', !mobileOpen)
              setMobileOpen(true)
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg
              text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="font-sora font-bold text-white text-sm">
            JobTracker
          </span>
        </header>

        <main className="flex-1 min-w-0 overflow-x-hidden">
          <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}