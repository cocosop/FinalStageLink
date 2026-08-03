import { useEffect, useMemo, useState } from 'react'
import { supabase, type Internship } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { InternshipCard } from '../components/InternshipCard'
import { PageLoader, EmptyState } from '../components/ui'
import { Search, SlidersHorizontal, Briefcase, X } from 'lucide-react'

type Filter = { q: string; type: string; field: string; remote: boolean }

export default function Browse() {
  const [items, setItems] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState<string[]>([])
  const [filter, setFilter] = useState<Filter>({ q: '', type: 'all', field: 'all', remote: false })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('internships')
        .select('*, company:companies(id, name, logo_url, location)')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
      const rows = (data ?? []) as unknown as Internship[]
      setItems(rows)
      const f = Array.from(new Set(rows.map((r) => r.field).filter(Boolean))) as string[]
      setFields(f)
      setLoading(false)
    })()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filter.type !== 'all' && it.type !== filter.type && it.type !== 'both') return false
      if (filter.field !== 'all' && it.field !== filter.field) return false
      if (filter.remote && !it.remote) return false
      if (filter.q) {
        const q = filter.q.toLowerCase()
        const hay = `${it.title} ${it.description} ${it.field} ${it.location ?? ''} ${it.company?.name ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [items, filter])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="bg-gradient-to-b from-ink-50 to-white border-b border-ink-200">
        <div className="container-page py-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">Offres de stage</h1>
          <p className="mt-2 text-ink-500">Parcourez les stages académiques et professionnels publiés par les entreprises vérifiées.</p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                value={filter.q}
                onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
                placeholder="Rechercher par mot-clé, entreprise, lieu…"
                className="input pl-10 py-3"
              />
            </div>
            <button onClick={() => setShowFilters((s) => !s)} className="btn-secondary py-3">
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 card p-4 grid gap-4 sm:grid-cols-3 animate-fade-in">
              <div>
                <label className="label">Type de stage</label>
                <select className="input" value={filter.type} onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}>
                  <option value="all">Tous</option>
                  <option value="academic">Académique</option>
                  <option value="professional">Professionnel</option>
                  <option value="both">Académique & Pro</option>
                </select>
              </div>
              <div>
                <label className="label">Domaine</label>
                <select className="input" value={filter.field} onChange={(e) => setFilter((f) => ({ ...f, field: e.target.value }))}>
                  <option value="all">Tous</option>
                  {fields.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" checked={filter.remote}
                    onChange={(e) => setFilter((f) => ({ ...f, remote: e.target.checked }))}
                    className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
                  <span className="text-sm text-ink-700">Télétravail uniquement</span>
                </label>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-ink-500">
            <span>{loading ? '…' : `${filtered.length} offre(s)`}</span>
            {(filter.q || filter.type !== 'all' || filter.field !== 'all' || filter.remote) && (
              <button onClick={() => setFilter({ q: '', type: 'all', field: 'all', remote: false })} className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700">
                <X className="h-3.5 w-3.5" /> Réinitialiser
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="container-page py-10 flex-1">
        {loading ? <PageLoader /> : filtered.length === 0 ? (
          <EmptyState icon={<Briefcase className="h-6 w-6" />} title="Aucune offre ne correspond"
            description="Essayez d'élargir vos critères ou revenez plus tard." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => <InternshipCard key={it.id} internship={it} />)}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
