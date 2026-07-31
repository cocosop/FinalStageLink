import { Link } from 'react-router-dom'
import type { Internship } from '../lib/supabase'
import { MapPin, Clock, Briefcase, Wifi, Users } from 'lucide-react'
import { badge, classByStatus, labelByStatus, labelByType, formatDate, initials } from '../lib/utils'

export function InternshipCard({ internship }: { internship: Internship }) {
  const company = internship.company
  return (
    <Link to={`/internships/${internship.id}`} className="card p-5 group hover:shadow-card transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 font-semibold text-sm">
            {company?.logo_url ? <img src={company.logo_url} alt="" className="h-11 w-11 rounded-xl object-cover" /> : initials(company?.name ?? '?')}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ink-500 truncate">{company?.name ?? 'Entreprise'}</p>
            <span className={badge('bg-brand-50 text-brand-700')}>{labelByType(internship.type)}</span>
          </div>
        </div>
        <span className={badge(classByStatus(internship.status))}>{labelByStatus(internship.status)}</span>
      </div>

      <h3 className="mt-4 font-display font-semibold text-ink-900 group-hover:text-brand-700 transition line-clamp-2">{internship.title}</h3>
      <p className="mt-1.5 text-sm text-ink-500 line-clamp-2">{internship.description}</p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-500">
        {internship.field && <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{internship.field}</span>}
        {internship.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{internship.location}</span>}
        {internship.duration_weeks && <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{internship.duration_weeks} sem.</span>}
        {internship.remote && <span className="inline-flex items-center gap-1"><Wifi className="h-3.5 w-3.5" />Télétravail</span>}
        {internship.spots && <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{internship.spots} place(s)</span>}
      </div>

      <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between text-xs text-ink-400">
        <span>Publié {formatDate(internship.created_at)}</span>
        <span className="text-brand-600 font-medium group-hover:translate-x-0.5 transition">Voir l'offre →</span>
      </div>
    </Link>
  )
}
