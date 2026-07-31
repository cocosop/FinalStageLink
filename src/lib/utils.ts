export function badge(cls: string): string {
  return `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function timeAgo(iso: string | null): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "à l'instant"
  if (mins < 60) return `il y a ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `il y a ${hrs} h`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `il y a ${days} j`
  return formatDate(iso)
}

export function initials(name: string | null | undefined): string {
  if (!name) return '?'
  return name.split(' ').map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

export function classByStatus(status: string): string {
  switch (status) {
    case 'open': case 'accepted': case 'verified': return 'bg-accent-100 text-accent-700'
    case 'reviewing': return 'bg-amber-100 text-amber-700'
    case 'submitted': return 'bg-brand-100 text-brand-700'
    case 'draft': return 'bg-ink-100 text-ink-600'
    case 'closed': case 'rejected': return 'bg-red-100 text-red-700'
    default: return 'bg-ink-100 text-ink-600'
  }
}

export function labelByStatus(status: string): string {
  switch (status) {
    case 'open': return 'Ouvert'
    case 'closed': return 'Fermé'
    case 'draft': return 'Brouillon'
    case 'submitted': return 'Envoyée'
    case 'reviewing': return 'En revue'
    case 'accepted': return 'Acceptée'
    case 'rejected': return 'Refusée'
    case 'verified': return 'Vérifiée'
    default: return status
  }
}

export function labelByType(type: string): string {
  switch (type) {
    case 'academic': return 'Académique'
    case 'professional': return 'Professionnel'
    case 'both': return 'Académique & Pro'
    default: return type
  }
}
