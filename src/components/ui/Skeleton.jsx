export function SkeletonLine({ className = '' }) {
  return (
    <div className={`animate-pulse bg-surface3 rounded ${className}`} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-surface2 border border-slate-800 rounded-xl p-6 space-y-4">
      <SkeletonLine className="h-4 w-1/3" />
      <SkeletonLine className="h-8 w-1/2" />
      <SkeletonLine className="h-3 w-1/4" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-800">
      <SkeletonLine className="h-4 w-1/4" />
      <SkeletonLine className="h-4 w-1/4" />
      <SkeletonLine className="h-6 w-20 rounded-full" />
      <SkeletonLine className="h-6 w-16 rounded-full" />
      <SkeletonLine className="h-4 w-1/6 ml-auto" />
    </div>
  )
}