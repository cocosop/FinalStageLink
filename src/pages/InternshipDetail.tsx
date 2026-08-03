import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, type Internship, type Application } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { PageLoader, EmptyState, ErrorBanner, Spinner, Avatar } from '../components/ui'
import { badge, classByStatus, labelByStatus, labelByType, formatDate } from '../lib/utils'
import { ArrowLeft, MapPin, Clock, Briefcase, Wifi, Users, Calendar, Wallet, Building2, CircleCheck as CheckCircle2, FileText } from 'lucide-react'

export default function InternshipDetail() {
  const { id } = useParams()
  const { profile } = useAuth()
  const [internship, setInternship] = useState<Internship | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [cover, setCover] = useState('')
  const [existing, setExisting] = useState<Application | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!id) return
    (async () => {
      const { data } = await supabase
        .from('internships')
        .select('*, company:companies(id, name, logo_url, location, sector, description, website, verified)')
        .eq('id', id)
        .maybeSingle()
      setInternship(data as unknown as Internship | null)
      setLoading(false)
    })()
  }, [id])

  useEffect(() => {
    if (!id || !profile) return
    if (profile.role !== 'student') return
    (async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .eq('internship_id', id)
        .eq('student_id', profile.id)
        .maybeSingle()
      setExisting(data as Application | null)
    })()
  }, [id, profile])

  async function apply() {
    if (!profile || !internship) return
    setError(null)
    setSubmitting(true)
    const { data, error } = await supabase
      .from('applications')
      .insert({
        internship_id: internship.id,
        student_id: profile.id,
        cover_letter: cover || null,
      })
      .select('*')
      .single()
    setSubmitting(false)
    if (error) {
      setError(error.code === '23505' ? 'Vous avez déjà postulé à cette offre.' : 'Erreur lors de la candidature.')
      return
    }
    setExisting(data as Application)
    setSuccess(true)
    setApplying(false)
  }

  if (loading) return <div className="min-h-screen flex flex-col"><Navbar /><PageLoader /><Footer /></div>
  if (!internship) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-page py-16 flex-1">
        <EmptyState icon={<Briefcase className="h-6 w-6" />} title="Offre introuvable"
          description="Cette offre n'existe plus ou n'est plus disponible."
          action={<Link to="/browse" className="btn-primary">Voir les offres</Link>} />
      </section>
      <Footer />
    </div>
  )

  const company = internship.company
  const isStudent = profile?.role === 'student'
  const canApply = isStudent && internship.status === 'open'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-page py-8 flex-1">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 transition">
          <ArrowLeft className="h-4 w-4" /> Retour aux offres
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-ink-50 text-ink-700 font-semibold">
                  {company?.logo_url ? <img src={company.logo_url} alt="" className="h-14 w-14 rounded-2xl object-cover" /> : <Building2 className="h-6 w-6" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={badge('bg-accent-50 text-accent-700')}>{labelByType(internship.type)}</span>
                    <span className={badge(classByStatus(internship.status))}>{labelByStatus(internship.status)}</span>
                  </div>
                  <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink-900 text-balance">{internship.title}</h1>
                  <p className="mt-1 text-ink-500">{company?.name ?? 'Entreprise'}{company?.verified ? ' · Vérifiée' : ''}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {internship.field && <Meta icon={<Briefcase className="h-4 w-4" />} label="Domaine" value={internship.field} />}
                {internship.location && <Meta icon={<MapPin className="h-4 w-4" />} label="Lieu" value={internship.location} />}
                {internship.duration_weeks && <Meta icon={<Clock className="h-4 w-4" />} label="Durée" value={`${internship.duration_weeks} semaines`} />}
                {internship.start_date && <Meta icon={<Calendar className="h-4 w-4" />} label="Début" value={formatDate(internship.start_date)} />}
                {internship.compensation && <Meta icon={<Wallet className="h-4 w-4" />} label="Indemnisation" value={internship.compensation} />}
                {internship.spots != null && <Meta icon={<Users className="h-4 w-4" />} label="Places" value={`${internship.spots}`} />}
                {internship.remote && <Meta icon={<Wifi className="h-4 w-4" />} label="Télétravail" value="Possible" />}
              </div>

              <div className="mt-6">
                <h2 className="font-display font-semibold text-ink-900">Description</h2>
                <p className="mt-2 text-ink-600 whitespace-pre-line leading-relaxed">{internship.description}</p>
              </div>

              {internship.requirements && (
                <div className="mt-6">
                  <h2 className="font-display font-semibold text-ink-900">Prérequis</h2>
                  <p className="mt-2 text-ink-600 whitespace-pre-line leading-relaxed">{internship.requirements}</p>
                </div>
              )}
            </div>

            {applying && (
              <div className="card p-6 animate-fade-in">
                <h3 className="font-display font-semibold text-ink-900">Lettre de motivation</h3>
                <p className="mt-1 text-sm text-ink-500">Expliquez pourquoi vous êtes le candidat idéal (optionnel).</p>
                <textarea
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  rows={6}
                  className="input mt-3 resize-none"
                  placeholder="Bonjour, je souhaite postuler à cette offre car…"
                />
                {error && <div className="mt-3"><ErrorBanner message={error} /></div>}
                <div className="mt-4 flex gap-3">
                  <button onClick={apply} disabled={submitting} className="btn-accent">
                    {submitting ? <Spinner /> : <><CheckCircle2 className="h-4 w-4" /> Envoyer ma candidature</>}
                  </button>
                  <button onClick={() => setApplying(false)} className="btn-secondary">Annuler</button>
                </div>
              </div>
            )}

            {success && existing && (
              <div className="card p-6 border-accent-200 bg-accent-50/50 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-ink-900">Candidature envoyée !</p>
                    <p className="text-sm text-ink-600 mt-1">Vous pourrez suivre son statut depuis votre tableau de bord.</p>
                    <Link to="/student" className="btn-secondary mt-4">Suivre ma candidature</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="card p-6">
              {existing ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className={badge(classByStatus(existing.status))}>{labelByStatus(existing.status)}</span>
                  </div>
                  <p className="mt-3 font-display font-semibold text-ink-900">Vous avez postulé</p>
                  <p className="text-sm text-ink-500 mt-1">Candidature envoyée le {formatDate(existing.created_at)}.</p>
                  <Link to="/student" className="btn-secondary w-full mt-4">Voir mes candidatures</Link>
                </div>
              ) : canApply ? (
                <div>
                  <p className="text-sm text-ink-500">Vous êtes connecté en tant qu'étudiant.</p>
                  <button onClick={() => setApplying(true)} className="btn-accent w-full mt-3 py-3">
                    <FileText className="h-4 w-4" /> Postuler à cette offre
                  </button>
                </div>
              ) : !profile ? (
                <div>
                  <p className="text-sm text-ink-500">Connectez-vous pour postuler.</p>
                  <Link to="/signin" className="btn-accent w-full mt-3 py-3">Connexion</Link>
                  <Link to="/signup" className="btn-secondary w-full mt-2">Créer un compte</Link>
                </div>
              ) : profile.role === 'company' ? (
                <p className="text-sm text-ink-500">Connecté en tant qu'entreprise — vous ne pouvez pas postuler.</p>
              ) : (
                <p className="text-sm text-ink-500">Cette offre n'est plus ouverte aux candidatures.</p>
              )}
            </div>

            {company && (
              <div className="card p-6">
                <h3 className="font-display font-semibold text-ink-900">À propos de l'entreprise</h3>
                <div className="mt-3 flex items-center gap-3">
                  <Avatar name={company.name} src={company.logo_url} size={44} />
                  <div>
                    <p className="font-medium text-ink-900">{company.name}</p>
                    {company.sector && <p className="text-xs text-ink-500">{company.sector}</p>}
                  </div>
                </div>
                {company.description && <p className="mt-3 text-sm text-ink-600 leading-relaxed line-clamp-4">{company.description}</p>}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="btn-secondary w-full mt-4">
                    Site web
                  </a>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  )
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="text-ink-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="text-sm text-ink-800 font-medium">{value}</p>
      </div>
    </div>
  )
}
