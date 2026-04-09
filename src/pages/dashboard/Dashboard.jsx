import { useQuery } from '@tanstack/react-query'
import { getStats, getApplications } from '../../api/applications'
import { SkeletonCard, SkeletonRow } from '../../components/ui/Skeleton'
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Button from '../../components/ui/Button'

const statCards = (stats) => [
  {
    label: 'Total Applications',
    value: stats?.total ?? 0,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
  },
  {
    label: 'Applied',
    value: stats?.by_status?.applied ?? 0,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    label: 'Interviews',
    value: stats?.by_status?.interview ?? 0,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    label: 'Offers',
    value: stats?.by_status?.offer ?? 0,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
  },
  {
    label: 'Rejected',
    value: stats?.by_status?.rejected ?? 0,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
]

function StatCard({ label, value, icon, color, bg, border }) {
  return (
    <div className={`
      bg-surface2 border ${border} rounded-xl p-6
      hover:-translate-y-1 hover:shadow-lg transition-all duration-200
      group cursor-default
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 ${bg} ${color} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <p className={`font-mono text-3xl font-bold ${color} mb-1 animate-count-up`}>
        {value}
      </p>
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats().then(r => r.data),
  })

  const { data: recentData, isLoading: recentLoading } = useQuery({
    queryKey: ['applications', 'recent'],
    queryFn: () => getApplications({ sort: 'created_at', per_page: 5 }).then(r => r.data),
  })

  const cards = statCards(statsData)
  const recent = recentData?.data ?? []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sora font-bold text-2xl text-white">
            Welcome back, {user?.name?.split(' ')[0]} 
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's what's happening with your job search
          </p>
        </div>
        <Button onClick={() => navigate('/applications?new=true')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </Button>
      </div>

      {/* Extra stats bar */}
      {!statsLoading && statsData && (
        <div className="bg-surface2 border border-slate-800 rounded-xl px-4 md:px-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:items-center gap-4 md:gap-6">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">This Month</p>
              <p className="font-mono font-bold text-white text-lg">{statsData.this_month}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Interview Rate</p>
              <p className="font-mono font-bold text-indigo-400 text-lg">{statsData.interview_rate}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Wishlist</p>
              <p className="font-mono font-bold text-white text-lg">{statsData.by_status?.wishlist}</p>
            </div>
            <div className="hidden md:block w-px h-8 bg-slate-800 flex-shrink-0" />
            <div className="col-span-2 sm:col-span-3 md:col-span-1 flex items-center gap-4 md:ml-auto flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                <span className="text-xs text-slate-400">High: <span className="text-white font-medium">{statsData.by_priority?.high}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                <span className="text-xs text-slate-400">Medium: <span className="text-white font-medium">{statsData.by_priority?.medium}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500 flex-shrink-0" />
                <span className="text-xs text-slate-400">Low: <span className="text-white font-medium">{statsData.by_priority?.low}</span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {statsLoading
          ? Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((card) => <StatCard key={card.label} {...card} />)
        }
      </div>

      {/* Recent Applications */}
      <div className="bg-surface2 border border-slate-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="font-sora font-semibold text-white">Recent Applications</h2>
          <button
            onClick={() => navigate('/applications')}
            className="text-sm text-primary hover:text-indigo-400 transition-colors"
          >
            View all →
          </button>
        </div>

        {recentLoading ? (
          <div>
            {Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-surface3 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No applications yet</p>
            <p className="text-slate-500 text-sm mt-1">Add your first application to get started</p>
            <Button className="mt-4" size="sm" onClick={() => navigate('/applications?new=true')}>
              Add Application
            </Button>
          </div>
        ) : (
          <div>
            {recent.map((app, i) => (
              <div
                key={app.id}
                onClick={() => navigate(`/applications?edit=${app.id}`)}
                className={`
                  flex items-center gap-4 px-6 py-4 cursor-pointer
                  hover:bg-surface3 transition-colors border-l-2 border-transparent
                  hover:border-primary
                  ${i % 2 === 1 ? 'bg-surface3/30' : ''}
                `}
              >
                {/* Company avatar */}
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-400 font-sora font-bold text-sm">
                    {app.company_name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{app.company_name}</p>
                  <p className="text-slate-400 text-xs truncate">{app.job_title}</p>
                </div>

                <StatusBadge status={app.status} />
                <PriorityBadge priority={app.priority} />

                {app.applied_date && (
                  <p className="text-slate-500 text-xs hidden md:block">
                    {new Date(app.applied_date).toLocaleDateString()}
                  </p>
                )}

                {/* Arrow indicator */}
                <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
