const variants = {
  primary: 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20',
  secondary: 'bg-surface3 border border-slate-700 hover:border-slate-500 text-slate-200',
  ghost: 'bg-transparent hover:bg-white/5 text-slate-400 hover:text-white',
  danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      )}
      {children}
    </button>
  )
}