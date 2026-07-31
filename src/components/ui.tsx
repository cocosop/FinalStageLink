import type { ReactNode } from 'react'
import { Loader as Loader2 } from 'lucide-react'

export function Spinner({ className = '' }: { className?: string }) {
  return <Loader2 className={`h-4 w-4 animate-spin ${className}`} />
}

export function PageLoader({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="flex flex-col items-center gap-3 text-ink-500">
        <Spinner className="h-6 w-6" />
        <p className="text-sm">{label}</p>
      </div>
    </div>
  )
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="card p-10 text-center">
      {icon && <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-ink-100 text-ink-500">{icon}</div>}
      <h3 className="font-display font-semibold text-ink-800">{title}</h3>
      {description && <p className="mt-1.5 text-sm text-ink-500 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
      {message}
    </div>
  )
}

export function Avatar({ name, src, size = 40 }: { name: string | null | undefined; src?: string | null; size?: number }) {
  const init = (name ?? '?').split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'
  if (src) {
    return <img src={src} alt={name ?? ''} style={{ width: size, height: size }} className="rounded-full object-cover" />
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="grid place-items-center rounded-full bg-brand-100 text-brand-700 font-semibold"
    >
      {init}
    </div>
  )
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <p className="text-sm text-ink-500">{label}</p>
        {icon && <div className="text-ink-400">{icon}</div>}
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-ink-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  )
}
