import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApplications, deleteApplication, getApplication } from '../../api/applications'
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge'
import { SkeletonRow } from '../../components/ui/Skeleton'
import Button from '../../components/ui/Button'
import ApplicationDrawer from '../../components/applications/ApplicationDrawer'

const STATUSES  = ['wishlist', 'applied', 'interview', 'offer', 'rejected']
const PRIORITIES = ['low', 'medium', 'high']
const SORTS = [
  { value: '',               label: 'Newest First' },
  { value: 'company_name',   label: 'Company Name' },
  { value: 'applied_date',   label: 'Applied Date' },
  { value: 'follow_up_date', label: 'Follow-up Date' },
]

function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center px-4">
      <div className="w-16 h-16 md:w-20 md:h-20 bg-surface3 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
        <svg className="w-8 h-8 md:w-10 md:h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="font-sora font-semibold text-white text-lg mb-2">No applications found</h3>
      <p className="text-slate-400 text-sm max-w-xs mb-6">
        Start tracking your job search by adding your first application.
      </p>
      <Button onClick={onAdd}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Application
      </Button>
    </div>
  )
}

function ApplicationCard({ app, onEdit, onDelete }) {
  return (
    <div className="bg-surface2 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-indigo-400 font-sora font-bold text-sm">
              {app.company_name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium text-sm truncate">{app.company_name}</p>
            <p className="text-slate-400 text-xs truncate">{app.job_title}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {app.job_url && (
            <a
              href={app.job_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          <button
            onClick={() => onEdit(app)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(app)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge status={app.status} />
        <PriorityBadge priority={app.priority} />
        {app.location && (
          <span className="text-xs text-slate-500">{app.location}</span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        {app.salary_min ? (
          <span className="font-mono">
            ${(app.salary_min / 1000).toFixed(0)}k
            {app.salary_max ? ` – $${(app.salary_max / 1000).toFixed(0)}k` : '+'}
          </span>
        ) : <span />}
        {app.applied_date && (
          <span>{new Date(app.applied_date).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  )
}

export default function Applications() {
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const [drawerOpen, setDrawerOpen]           = useState(searchParams.get('new') === 'true' || !!searchParams.get('edit'))
  const [editApplication, setEditApplication] = useState(null)
  const [deleteConfirm, setDeleteConfirm]     = useState(null)
  const [selected, setSelected]               = useState([])

  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('')
  const [priority, setPriority] = useState('')
  const [sort,     setSort]     = useState('')
  const [page,     setPage]     = useState(1)

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId) {
        getApplication(editId)
        .then(res => {
            setEditApplication(res.data.data)
        })
        .catch(() => {})
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // empty deps — only runs once on mount

  const { data, isLoading } = useQuery({
    queryKey: ['applications', { search, status, priority, sort, page }],
    queryFn: () => getApplications({
      ...(search   && { search }),
      ...(status   && { status }),
      ...(priority && { priority }),
      ...(sort     && { sort }),
      page,
    }).then(r => r.data),
    keepPreviousData: true,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Application deleted')
      setDeleteConfirm(null)
      setSelected([])
    },
    onError: () => toast.error('Failed to delete application'),
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids) => {
      for (const id of ids) await deleteApplication(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Applications deleted')
      setSelected([])
    },
    onError: () => toast.error('Failed to delete applications'),
  })

  const applications = data?.data ?? []
  const meta         = data?.meta ?? {}

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

  const toggleSelectAll = () =>
    setSelected(selected.length === applications.length ? [] : applications.map(a => a.id))

  const openEdit = (app) => { setEditApplication(app); setDrawerOpen(true) }
  const closeDrawer = () => { setDrawerOpen(false); setEditApplication(null) }

  return (
    <div className="space-y-4 md:space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-sora font-bold text-xl md:text-2xl text-white">Applications</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {meta.total ?? 0} total application{meta.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setDrawerOpen(true)} size="sm" className="md:size-md flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-surface2 border border-slate-800 rounded-xl p-3 md:p-4 space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search company or job title..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full bg-surface3 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1) }}
            className="flex-1 min-w-[130px] bg-surface3 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary transition-all"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>

          <select
            value={priority}
            onChange={e => { setPriority(e.target.value); setPage(1) }}
            className="flex-1 min-w-[130px] bg-surface3 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary transition-all"
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1) }}
            className="flex-1 min-w-[130px] bg-surface3 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-primary transition-all"
          >
            {SORTS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          {(search || status || priority || sort) && (
            <button
              onClick={() => { setSearch(''); setStatus(''); setPriority(''); setSort(''); setPage(1) }}
              className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-slate-700 whitespace-nowrap"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
          <p className="text-indigo-300 text-sm font-medium">
            {selected.length} selected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelected([])}
              className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-white/5"
            >
              Deselect all
            </button>
            <Button
              variant="danger"
              size="sm"
              loading={bulkDeleteMutation.isPending}
              onClick={() => bulkDeleteMutation.mutate(selected)}
            >
              Delete {selected.length}
            </Button>
          </div>
        </div>
      )}

      {/* MOBILE: Card list (hidden on md+) */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-surface2 border border-slate-800 rounded-xl p-4 space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-surface3" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-surface3 rounded w-1/2" />
                  <div className="h-3 bg-surface3 rounded w-1/3" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-5 bg-surface3 rounded-full w-16" />
                <div className="h-5 bg-surface3 rounded-full w-12" />
              </div>
            </div>
          ))
        ) : applications.length === 0 ? (
          <EmptyState onAdd={() => setDrawerOpen(true)} />
        ) : (
          applications.map(app => (
            <ApplicationCard
              key={app.id}
              app={app}
              onEdit={openEdit}
              onDelete={setDeleteConfirm}
            />
          ))
        )}
      </div>

      {/* DESKTOP: Table (hidden on mobile) */}
      <div className="hidden md:block bg-surface2 border border-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-slate-800 bg-surface1">
          <input
            type="checkbox"
            checked={selected.length === applications.length && applications.length > 0}
            onChange={toggleSelectAll}
            className="rounded border-slate-600 bg-surface3 text-primary focus:ring-primary/30"
          />
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Company</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Role</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Status</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Priority</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Applied</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</span>
        </div>

        {isLoading ? (
          Array(8).fill(0).map((_, i) => <SkeletonRow key={i} />)
        ) : applications.length === 0 ? (
          <EmptyState onAdd={() => setDrawerOpen(true)} />
        ) : (
          applications.map((app, i) => (
            <div
              key={app.id}
              className={`
                grid grid-cols-[auto_1fr_1fr_auto_auto_auto_auto] gap-4 items-center
                px-6 py-4 border-b border-slate-800/50 last:border-0
                transition-all duration-150 border-l-2
                ${selected.includes(app.id)
                  ? 'border-l-primary bg-primary/5'
                  : 'border-l-transparent hover:border-l-primary/50 hover:bg-surface3/50'
                }
                ${i % 2 === 1 ? 'bg-surface3/20' : ''}
              `}
            >
              <input
                type="checkbox"
                checked={selected.includes(app.id)}
                onChange={() => toggleSelect(app.id)}
                className="rounded border-slate-600 bg-surface3 text-primary focus:ring-primary/30"
              />

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-400 font-sora font-bold text-xs">
                    {app.company_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{app.company_name}</p>
                  {app.location && (
                    <p className="text-slate-500 text-xs truncate">{app.location}</p>
                  )}
                </div>
              </div>

              <div className="min-w-0">
                <p className="text-slate-300 text-sm truncate">{app.job_title}</p>
                {app.salary_min && (
                  <p className="text-slate-500 text-xs font-mono">
                    ${(app.salary_min / 1000).toFixed(0)}k
                    {app.salary_max ? ` – $${(app.salary_max / 1000).toFixed(0)}k` : '+'}
                  </p>
                )}
              </div>

              <StatusBadge status={app.status} />
              <PriorityBadge priority={app.priority} />

              <p className="text-slate-500 text-xs font-mono">
                {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : '—'}
              </p>

              <div className="flex items-center gap-1">
                {app.job_url && (
                  <a
                    href={app.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
                <button
                  onClick={() => openEdit(app)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteConfirm(app)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-slate-400 text-sm">
            Page {meta.current_page} of {meta.last_page}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" disabled={meta.current_page === 1} onClick={() => setPage(p => p - 1)}>
              ← Prev
            </Button>
            <Button variant="secondary" size="sm" disabled={meta.current_page === meta.last_page} onClick={() => setPage(p => p + 1)}>
              Next →
            </Button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <ApplicationDrawer open={drawerOpen} onClose={closeDrawer} application={editApplication} />

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setDeleteConfirm(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-surface2 border border-slate-700 rounded-2xl p-6 w-full max-w-sm animate-fade-in shadow-2xl">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="font-sora font-bold text-white text-lg mb-1">Delete Application</h3>
              <p className="text-slate-400 text-sm mb-6">
                Are you sure you want to delete{' '}
                <span className="text-white font-medium">{deleteConfirm.company_name}</span>?
                This cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                <Button variant="danger" className="flex-1" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteConfirm.id)}>Delete</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
