import { useEffect, useState, type FormEvent } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { supabase, type Company, type Internship, type Application } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import DashboardLayout from '../components/DashboardLayout'
import { StatCard, PageLoader, EmptyState, ErrorBanner, Spinner, Avatar } from '../components/ui'
import { badge, classByStatus, labelByStatus, labelByType, formatDate, initials } from '../lib/utils'
import { LayoutDashboard, Briefcase, FileText, Building2, Plus, Pencil, Trash2, MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react'

const nav = [
  { to: '/company', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { to: '/company/internships', label: 'Mes offres', icon: <Briefcase className="h-4 w-4" /> },
  { to: '/company/applications', label: 'Candidatures', icon: <FileText className="h-4 w-4" /> },
  { to: '/company/profile', label: 'Profil entreprise', icon: <Building2 className="h-4 w-4" /> },
]

export default function CompanyDashboard() {
  return (
    <DashboardLayout title="Espace entreprise" nav={nav}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="internships" element={<Internships />} />
        <Route path="applications" element={<Applications />} />
        <Route path="profile" element={<CompanyProfile />} />
      </Routes>
    </DashboardLayout>
  )
}

function useCompany() {
  const { profile } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      if (!profile) return
      const { data } = await supabase.from('companies').select('*').eq('owner_id', profile.id).maybeSingle()
      setCompany(data as Company | null)
      setLoading(false)
    })()
  }, [profile])

  return { company, setCompany, loading, profile }
}

function Overview() {
  const { company, loading } = useCompany()
  const [internships, setInternships] = useState<Internship[]>([])
  const [apps, setApps] = useState<Application[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    (async () => {
      if (!company) { setLoadingStats(false); return }
      const [iRes, aRes] = await Promise.all([
        supabase.from('internships').select('*').eq('company_id', company.id).order('created_at', { ascending: false }),
        supabase.from('applications').select('*, internship:internships(id, title, company_id, location, type)').order('created_at', { ascending: false }),
      ])
      const allApps = (aRes.data ?? []) as unknown as Application[]
      const myApps = allApps.filter((a) => a.internship?.company_id === company.id)
      setInternships((iRes.data ?? []) as Internship[])
      setApps(myApps)
      setLoadingStats(false)
    })()
  }, [company])

  if (loading || loadingStats) return <PageLoader />

  if (!company) {
    return (
      <EmptyState icon={<Building2 className="h-6 w-6" />} title="Créez la fiche de votre entreprise"
        description="Avant de publier des offres, complétez le profil de votre entreprise."
        action={<Link to="/company/profile" className="btn-primary">Créer la fiche entreprise</Link>} />
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">{company.name}</h2>
        <p className="text-ink-500 mt-1">Bienvenue dans votre espace de gestion.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Offres publiées" value={internships.length} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Offres ouvertes" value={internships.filter((i) => i.status === 'open').length} icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Candidatures reçues" value={apps.length} icon={<FileText className="h-4 w-4" />} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-ink-900">Offres récentes</h3>
          <Link to="/company/internships" className="text-sm text-brand-600 hover:text-brand-700">Gérer mes offres</Link>
        </div>
        {internships.length === 0 ? (
          <EmptyState icon={<Briefcase className="h-6 w-6" />} title="Aucune offre publiée"
            action={<Link to="/company/internships" className="btn-primary"><Plus className="h-4 w-4" /> Publier une offre</Link>} />
        ) : (
          <div className="card divide-y divide-ink-100">
            {internships.slice(0, 5).map((it) => (
              <div key={it.id} className="p-4 flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700"><Briefcase className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink-900 truncate">{it.title}</p>
                  <p className="text-xs text-ink-500">{labelByType(it.type)} · {formatDate(it.created_at)}</p>
                </div>
                <span className={badge(classByStatus(it.status))}>{labelByStatus(it.status)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const emptyInternship: Partial<Internship> = {
  title: '', description: '', type: 'professional', field: '', location: '', remote: false,
  duration_weeks: null, start_date: null, compensation: '', requirements: '', status: 'open', spots: 1,
}

function Internships() {
  const { company, loading } = useCompany()
  const [items, setItems] = useState<Internship[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Internship | null>(null)
  const [form, setForm] = useState<Partial<Internship>>(emptyInternship)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [loadingList, setLoadingList] = useState(true)

  async function load() {
    if (!company) { setLoadingList(false); return }
    const { data } = await supabase.from('internships').select('*').eq('company_id', company.id).order('created_at', { ascending: false })
    setItems((data ?? []) as Internship[])
    setLoadingList(false)
  }

  useEffect(() => { load() }, [company])

  function openNew() { setEditing(null); setForm(emptyInternship); setShowForm(true) }
  function openEdit(it: Internship) {
    setEditing(it)
    setForm({ ...it })
    setShowForm(true)
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!company) return
    setError(null)
    setSaving(true)
    const payload = {
      company_id: company.id,
      title: form.title,
      description: form.description,
      type: form.type,
      field: form.field,
      location: form.location || null,
      remote: !!form.remote,
      duration_weeks: form.duration_weeks ? Number(form.duration_weeks) : null,
      start_date: form.start_date || null,
      compensation: form.compensation || null,
      requirements: form.requirements || null,
      status: form.status,
      spots: form.spots ? Number(form.spots) : null,
    }
    const { error } = editing
      ? await supabase.from('internships').update(payload).eq('id', editing.id)
      : await supabase.from('internships').insert(payload)
    setSaving(false)
    if (error) { setError('Erreur lors de l\'enregistrement.'); return }
    setShowForm(false)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cette offre ? Les candidatures associées seront aussi supprimées.')) return
    await supabase.from('internships').delete().eq('id', id)
    load()
  }

  async function setStatus(it: Internship, status: Internship['status']) {
    await supabase.from('internships').update({ status }).eq('id', it.id)
    load()
  }

  if (loading) return <PageLoader />
  if (!company) {
    return <EmptyState icon={<Building2 className="h-6 w-6" />} title="Créez d'abord votre fiche entreprise"
      action={<Link to="/company/profile" className="btn-primary">Créer la fiche</Link>} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-ink-900">Mes offres</h2>
        <button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Nouvelle offre</button>
      </div>

      {showForm && (
        <form onSubmit={save} className="card p-6 space-y-4 animate-fade-in">
          <h3 className="font-display font-semibold text-ink-900">{editing ? 'Modifier l\'offre' : 'Nouvelle offre'}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Titre du stage *</label>
              <input className="input" required value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Internship['type'] })}>
                <option value="professional">Professionnel</option>
                <option value="academic">Académique</option>
                <option value="both">Académique & Pro</option>
              </select>
            </div>
            <div>
              <label className="label">Domaine</label>
              <input className="input" value={form.field ?? ''} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="Informatique, Marketing…" />
            </div>
            <div>
              <label className="label">Lieu</label>
              <input className="input" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="label">Durée (semaines)</label>
              <input type="number" className="input" value={form.duration_weeks ?? ''} onChange={(e) => setForm({ ...form, duration_weeks: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div>
              <label className="label">Date de début</label>
              <input type="date" className="input" value={form.start_date ?? ''} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label className="label">Places</label>
              <input type="number" className="input" value={form.spots ?? ''} onChange={(e) => setForm({ ...form, spots: e.target.value ? Number(e.target.value) : null })} />
            </div>
            <div>
              <label className="label">Indemnisation</label>
              <input className="input" value={form.compensation ?? ''} onChange={(e) => setForm({ ...form, compensation: e.target.value })} placeholder="600 €/mois" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description *</label>
              <textarea required className="input resize-none" rows={4} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Prérequis</label>
              <textarea className="input resize-none" rows={3} value={form.requirements ?? ''} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
            </div>
            <div>
              <label className="label">Statut</label>
              <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Internship['status'] })}>
                <option value="open">Ouvert</option>
                <option value="draft">Brouillon</option>
                <option value="closed">Fermé</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={!!form.remote} onChange={(e) => setForm({ ...form, remote: e.target.checked })} className="h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-500" />
                <span className="text-sm text-ink-700">Télétravail possible</span>
              </label>
            </div>
          </div>
          {error && <ErrorBanner message={error} />}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">{saving ? <Spinner /> : 'Enregistrer'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
          </div>
        </form>
      )}

      {loadingList ? <PageLoader /> : items.length === 0 ? (
        <EmptyState icon={<Briefcase className="h-6 w-6" />} title="Aucune offre"
          description="Publiez votre première offre pour recevoir des candidatures."
          action={<button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Publier une offre</button>} />
      ) : (
        <div className="grid gap-4">
          {items.map((it) => (
            <div key={it.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-ink-900">{it.title}</h3>
                    <span className={badge(classByStatus(it.status))}>{labelByStatus(it.status)}</span>
                    <span className={badge('bg-brand-50 text-brand-700')}>{labelByType(it.type)}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-500 line-clamp-2">{it.description}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    {it.field && <span>{it.field}</span>}
                    {it.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{it.location}</span>}
                    {it.duration_weeks && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{it.duration_weeks} sem.</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => openEdit(it)} className="btn-ghost p-2"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(it.id)} className="btn-ghost p-2 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-ink-100 flex items-center gap-2">
                {it.status !== 'open' && <button onClick={() => setStatus(it, 'open')} className="btn-ghost text-xs">Ouvrir</button>}
                {it.status === 'open' && <button onClick={() => setStatus(it, 'closed')} className="btn-ghost text-xs">Fermer</button>}
                <Link to={`/internships/${it.id}`} className="btn-ghost text-xs">Voir</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Applications() {
  const { company, loading } = useCompany()
  const [apps, setApps] = useState<Application[]>([])
  const [loadingApps, setLoadingApps] = useState(true)

  async function load() {
    if (!company) { setLoadingApps(false); return }
    const { data } = await supabase
      .from('applications')
      .select('*, internship:internships(id, title, company_id), student:profiles(id, full_name, email, phone)')
      .order('created_at', { ascending: false })
    const all = (data ?? []) as unknown as Application[]
    setApps(all.filter((a) => a.internship?.company_id === company.id))
    setLoadingApps(false)
  }

  useEffect(() => { load() }, [company])

  async function setStatus(app: Application, status: Application['status']) {
    await supabase.from('applications').update({ status }).eq('id', app.id)
    load()
  }

  if (loading || loadingApps) return <PageLoader />
  if (!company) return <EmptyState icon={<Building2 className="h-6 w-6" />} title="Créez votre fiche entreprise" action={<Link to="/company/profile" className="btn-primary">Créer</Link>} />

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink-900">Candidatures reçues</h2>
      {apps.length === 0 ? (
        <EmptyState icon={<FileText className="h-6 w-6" />} title="Aucune candidature"
          description="Les candidatures reçues sur vos offres apparaîtront ici." />
      ) : (
        <div className="grid gap-4">
          {apps.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar name={a.student?.full_name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-ink-900">{a.student?.full_name ?? 'Candidat'}</p>
                  <p className="text-xs text-ink-500">{a.student?.email}{a.student?.phone ? ` · ${a.student.phone}` : ''}</p>
                  <p className="text-xs text-ink-500 mt-0.5">Pour : <Link to={`/internships/${a.internship_id}`} className="text-brand-600 hover:underline">{a.internship?.title}</Link> · {formatDate(a.created_at)}</p>
                </div>
                <span className={badge(classByStatus(a.status))}>{labelByStatus(a.status)}</span>
              </div>
              {a.cover_letter && (
                <div className="mt-3 pt-3 border-t border-ink-100">
                  <p className="text-xs text-ink-400 mb-1">Lettre de motivation</p>
                  <p className="text-sm text-ink-600 whitespace-pre-line line-clamp-4">{a.cover_letter}</p>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => setStatus(a, 'reviewing')} className="btn-ghost text-xs">Marquer en revue</button>
                <button onClick={() => setStatus(a, 'accepted')} className="btn-ghost text-xs text-accent-600"><CheckCircle2 className="h-3.5 w-3.5" /> Accepter</button>
                <button onClick={() => setStatus(a, 'rejected')} className="btn-ghost text-xs text-red-600"><XCircle className="h-3.5 w-3.5" /> Refuser</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CompanyProfile() {
  const { profile } = useAuth()
  const { company, setCompany, loading } = useCompany()
  const [form, setForm] = useState<Partial<Company>>({ name: '', description: '', sector: '', website: '', location: '', size: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (company) setForm({ ...company })
  }, [company])

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!profile) return
    setError(null)
    setSaving(true)
    const payload = {
      owner_id: profile.id,
      name: form.name,
      description: form.description || null,
      sector: form.sector || null,
      website: form.website || null,
      location: form.location || null,
      size: form.size || null,
    }
    const { data, error } = company
      ? await supabase.from('companies').update(payload).eq('id', company.id).select('*').maybeSingle()
      : await supabase.from('companies').insert(payload).select('*').maybeSingle()
    setSaving(false)
    if (error) { setError('Erreur lors de l\'enregistrement.'); return }
    setCompany(data as Company | null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <PageLoader />

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink-900">Profil entreprise</h2>
      <form onSubmit={save} className="card p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-brand-700 font-display font-bold text-xl">{initials(form.name ?? '?')}</div>
          <div>
            <p className="font-medium text-ink-900">{form.name || 'Nouvelle entreprise'}</p>
            {company?.verified ? <span className={badge('bg-accent-100 text-accent-700')}>Vérifiée</span> : <span className={badge('bg-amber-100 text-amber-700')}>Non vérifiée</span>}
          </div>
        </div>
        <div>
          <label className="label">Nom de l'entreprise *</label>
          <input className="input" required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Secteur</label>
            <input className="input" value={form.sector ?? ''} onChange={(e) => setForm({ ...form, sector: e.target.value })} placeholder="Technologie, Finance…" />
          </div>
          <div>
            <label className="label">Taille</label>
            <input className="input" value={form.size ?? ''} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="50-200 employés" />
          </div>
          <div>
            <label className="label">Lieu</label>
            <input className="input" value={form.location ?? ''} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label">Site web</label>
            <input className="input" value={form.website ?? ''} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
          </div>
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input resize-none" rows={4} value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        {error && <ErrorBanner message={error} />}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? <Spinner /> : 'Enregistrer'}</button>
          {saved && <span className="text-sm text-accent-600">Enregistré ✓</span>}
        </div>
      </form>
    </div>
  )
}
