import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { Role } from '../lib/supabase'
import { GraduationCap, Building2, ArrowRight, Mail, Lock, User, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { ErrorBanner, Spinner } from '../components/ui'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email.trim(), password, fullName.trim() || 'Utilisateur', role)
    if (error) {
      setError(error)
      setLoading(false)
      return
    }
    navigate(role === 'company' ? '/company' : '/student')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-ink-900">Créer un compte</h1>
            <p className="mt-2 text-ink-500">Rejoignez FinalStageLink en moins d'une minute.</p>
          </div>

          <form onSubmit={onSubmit} className="card p-6 sm:p-8 space-y-5">
            <div>
              <label className="label">Je suis…</label>
              <div className="grid grid-cols-2 gap-3">
                <RoleButton active={role === 'student'} onClick={() => setRole('student')}
                  icon={<GraduationCap className="h-5 w-5" />} label="Étudiant" />
                <RoleButton active={role === 'company'} onClick={() => setRole('company')}
                  icon={<Building2 className="h-5 w-5" />} label="Entreprise" />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="fullName">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input id="fullName" className="input pl-10" placeholder="Jean Dupont"
                  value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input id="email" type="email" className="input pl-10" placeholder="vous@exemple.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                <input id="password" type="password" className="input pl-10" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            {error && <ErrorBanner message={error} />}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? <Spinner /> : <>Créer mon compte <ArrowRight className="h-4 w-4" /></>}
            </button>

            <p className="text-xs text-ink-400 text-center flex items-center justify-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              En créant un compte, vous acceptez nos conditions d'utilisation.
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Déjà un compte ?{' '}
            <Link to="/signin" className="font-medium text-brand-600 hover:text-brand-700">Connexion</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function RoleButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition ${
        active ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-soft' : 'border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
      }`}>
      {icon}
      {label}
    </button>
  )
}
