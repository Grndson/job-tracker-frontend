const statusConfig = {
  wishlist:  { label: 'Wishlist',  classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  applied:   { label: 'Applied',   classes: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  interview: { label: 'Interview', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  offer:     { label: 'Offer',     classes: 'bg-green-500/15 text-green-400 border-green-500/30' },
  rejected:  { label: 'Rejected',  classes: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

const priorityConfig = {
  low:    { label: 'Low',    classes: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
  medium: { label: 'Medium', classes: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  high:   { label: 'High',   classes: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
}

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.applied
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}>
      {config.label}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.medium
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.classes}`}>
      {config.label}
    </span>
  )
}