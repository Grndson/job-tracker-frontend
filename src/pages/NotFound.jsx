import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative text-center animate-fade-in max-w-md">
        {/* 404 number */}
        <div className="relative mb-6">
          <p className="font-sora font-bold text-[120px] md:text-[160px] leading-none text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-600 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-surface2 border border-slate-800 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="font-sora font-bold text-2xl text-white mb-3">
          Page not found
        </h1>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Go Back
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}