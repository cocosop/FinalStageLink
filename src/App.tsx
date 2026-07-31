import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './lib/auth'
import type { Role } from './lib/supabase'
import Landing from './pages/Landing'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Browse from './pages/Browse'
import InternshipDetail from './pages/InternshipDetail'
import StudentDashboard from './pages/StudentDashboard'
import CompanyDashboard from './pages/CompanyDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { PageLoader } from './components/ui'

export default function App() {
  const { session, profile, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><PageLoader /></div>
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/internships/:id" element={<InternshipDetail />} />

      <Route path="/signin" element={
        session ? <Navigate to={dashFor(profile)} replace /> : <Signin />
      } />
      <Route path="/signup" element={
        session ? <Navigate to={dashFor(profile)} replace /> : <Signup />
      } />

      <Route path="/student/*" element={<Guard role="student" profile={profile}><StudentDashboard /></Guard>} />
      <Route path="/company/*" element={<Guard role="company" profile={profile}><CompanyDashboard /></Guard>} />
      <Route path="/admin/*" element={<Guard role="admin" profile={profile}><AdminDashboard /></Guard>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function dashFor(profile: { role: Role } | null): string {
  if (!profile) return '/'
  return profile.role === 'admin' ? '/admin' : profile.role === 'company' ? '/company' : '/student'
}

function Guard({ role, profile, children }: { role: Role; profile: { role: Role } | null; children: React.ReactNode }) {
  const location = useLocation()
  if (!profile) return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  if (profile.role !== role) return <Navigate to={dashFor(profile)} replace />
  return <>{children}</>
}
