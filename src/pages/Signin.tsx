import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { ArrowRight, Mail, Lock } from 'lucide-react'
import Navbar from '../components/Navbar'
import { ErrorBanner, Spinner } from '../components/ui'

export default function Signin() {
  const { signIn, profile } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email.trim(), password)
    if (error) {
      setError(error)
      setLoading(false)
    }
  }

  // If already signed in, redirect
  if (profile) {
    const dest = profile.role === 'admin' ? '/admin' : profile.role === 'company' ? '/company' : '/student'
    navigate(dest, { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-ink-900">Connexion</h1>
            <p className="mt-2 text-ink-500">Heureux de vous revoir sur Stagelink.</p>
          </div>

          <form onSubmit={onSubmit} className="card p-6 sm:p-8 space-y-5">
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
              {loading ? <Spinner /> : <>Se connecter <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            Pas encore de compte ?{' '}
            <Link to="/signup" className="font-medium text-brand-600 hover:text-brand-700">Créer un compte</Link>
          </p>
          <p className="mt-3 text-center text-xs text-ink-400">
            Compte administrateur ? Connectez-vous avec vos identifiants administrateur.
          </p>
        </div>
      </div>
    </div>
  )
}
