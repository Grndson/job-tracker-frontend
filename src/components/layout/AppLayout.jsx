import { useState, useEffect } from 'react'
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
    
    <Sidebar
      mobileOpen={mobileOpen}
      onMobileClose={() => setMobileOpen(false)}
      collapsed={collapsed}
      onCollapse={setCollapsed}
    />

    {/* MAIN CONTENT WRAPPER */}
    <div
      className={`
        flex-1 flex flex-col min-w-0 transition-all duration-300
        ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}
    >
      
      {/* Mobile topbar */}
      <header className="lg:hidden sticky top-0 z-20 bg-surface1 border-b border-slate-800 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-sora font-bold text-white text-sm">JobTracker</span>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 md:py-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
)
}