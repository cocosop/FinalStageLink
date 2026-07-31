import { useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { supabase, type Application, type Internship } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import DashboardLayout from '../components/DashboardLayout'
import { StatCard, PageLoader, EmptyState, Avatar } from '../components/ui'
import { InternshipCard } from '../components/InternshipCard'
import { badge, classByStatus, labelByStatus, labelByType, formatDate, timeAgo } from '../lib/utils'
import { LayoutDashboard, FileText, User, Briefcase, Search, Clock } from 'lucide-react'

const nav = [
  { to: '/student', label: 'Vue d\'ensemble', icon: <LayoutDashboard className="h-4 w-4" />, end: true },
  { to: '/student/applications', label: 'Mes candidatures', icon: <FileText className="h-4 w-4" /> },
  { to: '/student/browse', label: 'Parcourir les offres', icon: <Search className="h-4 w-4" /> },
  { to: '/student/profile', label: 'Mon profil', icon: <User className="h-4 w-4" /> },
]

export default function StudentDashboard() {
  return (
    <DashboardLayout title="Espace étudiant" nav={nav}>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="applications" element={<Applications />} />
        <Route path="browse" element={<Browse />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  )
}

function Overview() {
  const { profile } = useAuth()
  const [apps, setApps] = useState<Application[]>([])
  const [recommended, setRecommended] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      if (!profile) return
      const [appsRes, recRes] = await Promise.all([
        supabase.from('applications').select('*, internship:internships(id, title, location, type)').eq('student_id', profile.id).order('created_at', { ascending: false }),
        supabase.from('internships').select('*, company:companies(id, name, logo_url, location)').eq('status', 'open').order('created_at', { ascending: false }).limit(3),
      ])
      setApps((appsRes.data ?? []) as unknown as Application[])
      setRecommended((recRes.data ?? []) as unknown as Internship[])
      setLoading(false)
    })()
  }, [profile])

  if (loading) return <PageLoader />

  const stats = {
    total: apps.length,
    reviewing: apps.filter((a) => a.status === 'reviewing').length,
    accepted: apps.filter((a) => a.status === 'accepted').length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-ink-900">Bonjour, {profile?.full_name?.split(' ')[0] ?? ''} 👋</h2>
        <p className="text-ink-500 mt-1">Voici un aperçu de votre recherche de stage.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Candidatures envoyées" value={stats.total} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="En cours de revue" value={stats.reviewing} icon={<Clock className="h-4 w-4" />} />
        <StatCard label="Acceptées" value={stats.accepted} icon={<Briefcase className="h-4 w-4" />} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-ink-900">Candidatures récentes</h3>
          <Link to="/student/applications" className="text-sm text-brand-600 hover:text-brand-700">Tout voir</Link>
        </div>
        {apps.length === 0 ? (
          <EmptyState icon={<FileText className="h-6 w-6" />} title="Aucune candidature pour le moment"
            description="Parcourez les offres et postulez pour commencer."
            action={<Link to="/student/browse" className="btn-primary">Parcourir les offres</Link>} />
        ) : (
          <div className="card divide-y divide-ink-100">
            {apps.slice(0, 5).map((a) => (
              <div key={a.id} className="p-4 flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-700"><FileText className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <Link to={`/internships/${a.internship_id}`} className="font-medium text-ink-900 hover:text-brand-700 truncate block">{a.internship?.title ?? 'Offre'}</Link>
                  <p className="text-xs text-ink-500">{a.internship?.location ?? ''} · {timeAgo(a.created_at)}</p>
                </div>
                <span className={badge(classByStatus(a.status))}>{labelByStatus(a.status)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-ink-900">Offres recommandées</h3>
          <Link to="/student/browse" className="text-sm text-brand-600 hover:text-brand-700">Tout voir</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((it) => <InternshipCard key={it.id} internship={it} />)}
        </div>
      </div>
    </div>
  )
}

function Applications() {
  const { profile } = useAuth()
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      if (!profile) return
      const { data } = await supabase
        .from('applications')
        .select('*, internship:internships(id, title, location, type)')
        .eq('student_id', profile.id)
        .order('created_at', { ascending: false })
      setApps((data ?? []) as unknown as Application[])
      setLoading(false)
    })()
  }, [profile])

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink-900">Mes candidatures</h2>
      {apps.length === 0 ? (
        <EmptyState icon={<FileText className="h-6 w-6" />} title="Aucune candidature"
          description="Vous n'avez pas encore postulé à une offre."
          action={<Link to="/student/browse" className="btn-primary">Parcourir les offres</Link>} />
      ) : (
        <div className="card divide-y divide-ink-100">
          {apps.map((a) => (
            <div key={a.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"><FileText className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <Link to={`/internships/${a.internship_id}`} className="font-medium text-ink-900 hover:text-brand-700">{a.internship?.title ?? 'Offre'}</Link>
                <p className="text-xs text-ink-500 mt-0.5">
                  {a.internship?.location ?? 'Lieu non précisé'} · {labelByType(a.internship?.type ?? '')} · Postulée le {formatDate(a.created_at)}
                </p>
              </div>
              <span className={badge(classByStatus(a.status))}>{labelByStatus(a.status)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Browse() {
  const [items, setItems] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('internships')
        .select('*, company:companies(id, name, logo_url, location)')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
      setItems((data ?? []) as unknown as Internship[])
      setLoading(false)
    })()
  }, [])

  const filtered = items.filter((it) => {
    if (!q) return true
    const hay = `${it.title} ${it.description} ${it.field} ${it.location ?? ''} ${it.company?.name ?? ''}`.toLowerCase()
    return hay.includes(q.toLowerCase())
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold text-ink-900">Parcourir les offres</h2>
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="input pl-10" />
        </div>
      </div>
      {loading ? <PageLoader /> : filtered.length === 0 ? (
        <EmptyState icon={<Search className="h-6 w-6" />} title="Aucune offre" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((it) => <InternshipCard key={it.id} internship={it} />)}
        </div>
      )}
    </div>
  )
}

function Profile() {
  const { profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save() {
    if (!profile) return
    setSaving(true)
    setSaved(false)
    await supabase.from('profiles').update({ full_name: fullName, phone, bio }).eq('id', profile.id)
    await refreshProfile()
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display text-2xl font-bold text-ink-900">Mon profil</h2>
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar name={profile?.full_name} size={64} />
          <div>
            <p className="font-medium text-ink-900">{profile?.email}</p>
            <span className={badge('bg-brand-50 text-brand-700')}>Étudiant</span>
          </div>
        </div>
        <div>
          <label className="label">Nom complet</label>
          <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="label">Téléphone</label>
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+33 …" />
        </div>
        <div>
          <label className="label">Bio / présentation</label>
          <textarea className="input resize-none" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Décrivez votre parcours, vos centres d'intérêt…" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn-primary">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
          {saved && <span className="text-sm text-accent-600">Enregistré ✓</span>}
        </div>
      </div>
    </div>
  )
}
