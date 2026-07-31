import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import type { ReactNode } from 'react'
import { GraduationCap, Building2, ShieldCheck, LogOut, Menu, X, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'

type NavItem = { to: string; label: string; icon: ReactNode; end?: boolean }

export default function DashboardLayout({ title, nav, children }: { title: string; nav: NavItem[]; children: ReactNode }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const roleLabel = profile?.role === 'admin' ? 'Administrateur' : profile?.role === 'company' ? 'Entreprise' : 'Étudiant'
  const RoleIcon = profile?.role === 'admin' ? ShieldCheck : profile?.role === 'company' ? Building2 : GraduationCap

  return (
    <div className="min-h-screen bg-ink-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 bg-white border-r border-ink-200 flex flex-col transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center px-5 border-b border-ink-200">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-display font-bold text-ink-900 text-sm">FinalStageLink</span>
          </Link>
          <button className="ml-auto lg:hidden btn-ghost p-1.5" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 rounded-xl bg-ink-50 p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-700">
              <RoleIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-900 truncate">{profile?.full_name ?? 'Utilisateur'}</p>
              <p className="text-xs text-ink-500">{roleLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => isActive
                ? 'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-brand-50 text-brand-700'
                : 'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900'}
              onClick={() => setOpen(false)}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-ink-200 space-y-1">
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-ink-50 hover:text-ink-900">
            <LayoutDashboard className="h-4 w-4" /> Accueil
          </Link>
          <button onClick={async () => { await signOut(); navigate('/') }} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 hover:bg-red-50 hover:text-red-600">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-ink-900/30 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-ink-200 h-16 flex items-center px-4 sm:px-6">
          <button className="lg:hidden btn-ghost p-2" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
          <h1 className="font-display font-semibold text-ink-900 ml-2 lg:ml-0">{title}</h1>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
