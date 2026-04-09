export default function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-slate-300">{label}</label>
      )}
      <textarea
        className={`
          w-full bg-surface3 border rounded-lg px-4 py-2.5 text-slate-100
          placeholder-slate-500 text-sm transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none
          ${error
            ? 'border-red-500 focus:border-red-500'
            : 'border-slate-700 focus:border-primary'
          }
          ${className}
        `}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}