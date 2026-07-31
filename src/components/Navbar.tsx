import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { GraduationCap, Building2, ShieldCheck, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)

  const dashHref = profile?.role === 'admin' ? '/admin'
    : profile?.role === 'company' ? '/company'
    : '/student'

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-ink-200/70">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-soft transition group-hover:scale-105">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="font-display font-bold text-ink-900 text-[15px]">FinalStageLink</span>
            <span className="block text-[11px] text-ink-500 -mt-0.5">Stages académiques & pro</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/#features" className="btn-ghost">Fonctionnalités</Link>
          <Link to="/#how" className="btn-ghost">Comment ça marche</Link>
          <Link to="/browse" className="btn-ghost">Offres</Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {profile ? (
            <>
              <Link to={dashHref} className="btn-secondary">
                {profile.role === 'admin' ? <ShieldCheck className="h-4 w-4" /> : profile.role === 'company' ? <Building2 className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                Tableau de bord
              </Link>
              <button onClick={signOut} className="btn-ghost">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-ghost">Connexion</Link>
              <Link to="/signup" className="btn-primary">Créer un compte</Link>
            </>
          )}
        </div>

        <button className="md:hidden btn-ghost p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-200 bg-white animate-fade-in">
          <div className="container-page py-3 flex flex-col gap-1">
            <Link to="/#features" onClick={() => setOpen(false)} className="btn-ghost justify-start">Fonctionnalités</Link>
            <Link to="/#how" onClick={() => setOpen(false)} className="btn-ghost justify-start">Comment ça marche</Link>
            <Link to="/browse" onClick={() => setOpen(false)} className="btn-ghost justify-start">Offres</Link>
            <div className="h-px bg-ink-200 my-1" />
            {profile ? (
              <>
                <Link to={dashHref} onClick={() => setOpen(false)} className="btn-secondary justify-start">Tableau de bord</Link>
                <button onClick={() => { signOut(); setOpen(false) }} className="btn-ghost justify-start">Déconnexion</button>
              </>
            ) : (
              <>
                <Link to="/signin" onClick={() => setOpen(false)} className="btn-secondary">Connexion</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary">Créer un compte</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
