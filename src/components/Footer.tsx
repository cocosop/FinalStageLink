import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="container-page py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link to="/" className="flex items-center">
            <img src="/edited-photo_(2).png" alt="Stagelink" className="h-14 w-auto" />
          </Link>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-500">
            <Link to="/browse" className="hover:text-ink-900 transition">Offres de stage</Link>
            <Link to="/#features" className="hover:text-ink-900 transition">Fonctionnalités</Link>
            <Link to="/#how" className="hover:text-ink-900 transition">Comment ça marche</Link>
            <Link to="/signin" className="hover:text-ink-900 transition">Connexion</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-ink-100 text-xs text-ink-400 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Stagelink. Tous droits réservés.</p>
          <p>Plateforme de mise en relation étudiants · entreprises · écoles.</p>
        </div>
      </div>
    </footer>
  )
}
