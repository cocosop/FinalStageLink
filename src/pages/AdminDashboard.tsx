import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase, type Profile, type Company, type Internship, type Application } from '../lib/supabase'
import DashboardLayout from '../components/DashboardLayout'
import { StatCard, PageLoader, EmptyState, Avatar } from '../components/ui'
import { badge, classByStatus, labelByStatus, labelByType, formatDate, timeAgo, initials } from '../lib/utils'
import { LayoutDashboard, Users, Building2, Briefcase, FileText, ShieldCheck, CircleCheck as CheckCircle2, Circle as XCircle, Activity } from 'lucide-react'

const nav = [
  { to: '/admin', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { to: '/admin/users', label: 'Utilisateurs', icon: <Users className="h-4 w-4" /> },
  { to: '/admin/companies', label: 'Entreprises', icon: <Building2 className="h-4 w-4" /> },
  { to: '/admin/internships', label: 'Offres', icon: <Briefcase className="h-4 w-4" /> },
  { to: '/admin/applications', label: 'Candidatures', icon: <FileText className="h-4 w-4" /> },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Administration" nav={nav}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="internships" element={<InternshipsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
      </Routes>
    </DashboardLayout>
  )
}

function useCounts() {
  const [counts, setCounts] = useState({ users: 0, companies: 0, internships: 0, applications: 0, open: 0, verified: 0 })
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    (async () => {
      const [u, c, i, a] = await Promise.all([
        supabase.from('profiles').select('id, role', { count: 'exact', head: false }),
        supabase.from('companies').select('id, verified', { count: 'exact', head: false }),
        supabase.from('internships').select('id, status', { count: 'exact', head: false }),
        supabase.from('applications').select('id', { count: 'exact', head: true }),
      ])
      setCounts({
        users: (u.data ?? []).length,
        companies: (c.data ?? []).length,
        verified: (c.data ?? []).filter((x) => x.verified).length,
        internships: (i.data ?? []).length,
        open: (i.data ?? []).filter((x) => x.status === 'open').length,
        applications: a.count ?? 0,
      })
      setLoading(false)
    })()
  }, [])
  return { counts, loading }
}

function Overview() {
  const { counts, loading } = useCounts()
  const [recentApps, setRecentApps] = useState<Application[]>([])
  const [recentUsers, setRecentUsers] = useState<Profile[]>([])

  useEffect(() => {
    (async () => {
      const [a, u] = await Promise.all([
        supabase.from('applications').select('*, internship:internships(id, title), student:profiles(id, full_name)').order('created_at', { ascending: false }).limit(6),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(6),
      ])
      setRecentApps((a.data ?? []) as unknown as Application[])
      setRecentUsers((u.data ?? []) as Profile[])
    })()
  }, [])

  if (loading) return <PageLoader />

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Tableau de bord administrateur</h2>
        <p className="text-ink-500 mt-1">Pilotez la plateforme Stagelink.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Utilisateurs" value={counts.users} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Entreprises" value={counts.companies} hint={`${counts.verified} vérifiées`} icon={<Building2 className="h-4 w-4" />} />
        <StatCard label="Offres de stage" value={counts.internships} hint={`${counts.open} ouvertes`} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label="Candidatures" value={counts.applications} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Entreprises vérifiées" value={counts.verified} icon={<ShieldCheck className="h-4 w-4" />} />
        <StatCard label="Offres ouvertes" value={counts.open} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="font-display font-semibold text-ink-900 mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-ink-400" /> Candidatures récentes</h3>
          {recentApps.length === 0 ? (
            <div className="card p-6 text-sm text-ink-500">Aucune candidature.</div>
          ) : (
            <div className="card divide-y divide-ink-100">
              {recentApps.map((a) => (
                <div key={a.id} className="p-4 flex items-center gap-3">
                  <Avatar name={a.student?.full_name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900 truncate">{a.student?.full_name ?? 'Candidat'}</p>
                    <p className="text-xs text-ink-500 truncate">{a.internship?.title ?? 'Offre'} · {timeAgo(a.created_at)}</p>
                  </div>
                  <span className={badge(classByStatus(a.status))}>{labelByStatus(a.status)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-display font-semibold text-ink-900 mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-ink-400" /> Nouveaux utilisateurs</h3>
          {recentUsers.length === 0 ? (
            <div className="card p-6 text-sm text-ink-500">Aucun utilisateur.</div>
          ) : (
            <div className="card divide-y divide-ink-100">
              {recentUsers.map((u) => (
                <div key={u.id} className="p-4 flex items-center gap-3">
                  <Avatar name={u.full_name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900 truncate">{u.full_name ?? 'Utilisateur'}</p>
                    <p className="text-xs text-ink-500 truncate">{u.email} · {timeAgo(u.created_at)}</p>
                  </div>
                  <span className={roleBadge(u.role)}>{roleLabel(u.role)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers((data ?? []) as Profile[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function setRole(u: Profile, role: Profile['role']) {
    await supabase.from('profiles').update({ role }).eq('id', u.id)
    load()
  }

  const filtered = users.filter((u) => !q || `${u.full_name ?? ''} ${u.email}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-ink-900">Utilisateurs</h2>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="input sm:w-72" />
      </div>
      {loading ? <PageLoader /> : filtered.length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6" />} title="Aucun utilisateur" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 border-b border-ink-100">
                <th className="px-4 py-3 font-medium">Utilisateur</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">Inscrit le</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.full_name} size={36} />
                      <div className="min-w-0">
                        <p className="font-medium text-ink-900 truncate">{u.full_name ?? 'Utilisateur'}</p>
                        <p className="text-xs text-ink-500 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={roleBadge(u.role)}>{roleLabel(u.role)}</span></td>
                  <td className="px-4 py-3 text-ink-500">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => setRole(u, e.target.value as Profile['role'])}
                      className="input py-1.5 text-xs w-auto inline-block"
                    >
                      <option value="student">Étudiant</option>
                      <option value="company">Entreprise</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('companies').select('*').order('created_at', { ascending: false })
    setCompanies((data ?? []) as Company[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function toggleVerified(c: Company) {
    await supabase.from('companies').update({ verified: !c.verified }).eq('id', c.id)
    load()
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink-900">Entreprises</h2>
      {loading ? <PageLoader /> : companies.length === 0 ? (
        <EmptyState icon={<Building2 className="h-6 w-6" />} title="Aucune entreprise" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {companies.map((c) => (
            <div key={c.id} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700 font-display font-bold">{initials(c.name)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-ink-900">{c.name}</h3>
                    {c.verified
                      ? <span className={badge('bg-accent-100 text-accent-700')}>Vérifiée</span>
                      : <span className={badge('bg-amber-100 text-amber-700')}>Non vérifiée</span>}
                  </div>
                  <p className="text-xs text-ink-500 mt-0.5">{c.sector ?? '—'} · {c.location ?? '—'}</p>
                  {c.description && <p className="text-sm text-ink-600 mt-2 line-clamp-2">{c.description}</p>}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between">
                <span className="text-xs text-ink-400">Créée {formatDate(c.created_at)}</span>
                <button onClick={() => toggleVerified(c)} className="btn-ghost text-xs">
                  {c.verified ? <><XCircle className="h-3.5 w-3.5" /> Retirer la vérification</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Vérifier</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InternshipsPage() {
  const [items, setItems] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase.from('internships').select('*, company:companies(id, name)').order('created_at', { ascending: false })
    setItems((data ?? []) as unknown as Internship[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function setStatus(it: Internship, status: Internship['status']) {
    await supabase.from('internships').update({ status }).eq('id', it.id)
    load()
  }
  async function remove(id: string) {
    if (!confirm('Supprimer cette offre ?')) return
    await supabase.from('internships').delete().eq('id', id)
    load()
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink-900">Offres de stage</h2>
      {loading ? <PageLoader /> : items.length === 0 ? (
        <EmptyState icon={<Briefcase className="h-6 w-6" />} title="Aucune offre" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 border-b border-ink-100">
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Entreprise</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-ink-50/50">
                  <td className="px-4 py-3 font-medium text-ink-900 max-w-xs truncate">{it.title}</td>
                  <td className="px-4 py-3 text-ink-600">{it.company?.name ?? '—'}</td>
                  <td className="px-4 py-3"><span className={badge('bg-brand-50 text-brand-700')}>{labelByType(it.type)}</span></td>
                  <td className="px-4 py-3"><span className={badge(classByStatus(it.status))}>{labelByStatus(it.status)}</span></td>
                  <td className="px-4 py-3 text-right">
                    <select value={it.status} onChange={(e) => setStatus(it, e.target.value as Internship['status'])} className="input py-1.5 text-xs w-auto inline-block mr-2">
                      <option value="draft">Brouillon</option>
                      <option value="open">Ouvert</option>
                      <option value="closed">Fermé</option>
                    </select>
                    <button onClick={() => remove(it.id)} className="btn-ghost p-1.5 text-red-500 hover:bg-red-50"><XCircle className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const { data } = await supabase
      .from('applications')
      .select('*, internship:internships(id, title), student:profiles(id, full_name, email), company:companies(id, name)')
      .order('created_at', { ascending: false })
    setApps((data ?? []) as unknown as Application[])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function setStatus(a: Application, status: Application['status']) {
    await supabase.from('applications').update({ status }).eq('id', a.id)
    load()
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink-900">Candidatures</h2>
      {loading ? <PageLoader /> : apps.length === 0 ? (
        <EmptyState icon={<FileText className="h-6 w-6" />} title="Aucune candidature" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 border-b border-ink-100">
                <th className="px-4 py-3 font-medium">Candidat</th>
                <th className="px-4 py-3 font-medium">Offre</th>
                <th className="px-4 py-3 font-medium">Entreprise</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Changer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-ink-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{a.student?.full_name ?? '—'}</p>
                    <p className="text-xs text-ink-500">{a.student?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-600 max-w-xs truncate">{a.internship?.title ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-600">{a.company?.name ?? '—'}</td>
                  <td className="px-4 py-3"><span className={badge(classByStatus(a.status))}>{labelByStatus(a.status)}</span></td>
                  <td className="px-4 py-3 text-right">
                    <select value={a.status} onChange={(e) => setStatus(a, e.target.value as Application['status'])} className="input py-1.5 text-xs w-auto inline-block">
                      <option value="submitted">Envoyée</option>
                      <option value="reviewing">En revue</option>
                      <option value="accepted">Acceptée</option>
                      <option value="rejected">Refusée</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function roleLabel(role: string): string {
  return role === 'admin' ? 'Admin' : role === 'company' ? 'Entreprise' : 'Étudiant'
}
function roleBadge(role: string): string {
  return badge(role === 'admin' ? 'bg-ink-800 text-white' : role === 'company' ? 'bg-accent-100 text-accent-700' : 'bg-brand-100 text-brand-700')
}
