import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center">
              <img src="/edited-photo_(2).png" alt="Stagelink" className="h-12 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-4 text-sm text-ink-400 max-w-sm leading-relaxed">
              La plateforme qui rapproche les étudiants, les entreprises et les écoles autour du stage.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white text-sm">Navigation</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/browse" className="hover:text-white transition">Offres de stage</Link></li>
              <li><Link to="/#features" className="hover:text-white transition">Fonctionnalités</Link></li>
              <li><Link to="/#how" className="hover:text-white transition">Comment ça marche</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white text-sm">Compte</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/signin" className="hover:text-white transition">Connexion</Link></li>
              <li><Link to="/signup" className="hover:text-white transition">Créer un compte</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-ink-800 text-xs text-ink-500 flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} Stagelink. Tous droits réservés.</p>
          <p>Plateforme de mise en relation étudiants · entreprises · écoles.</p>
        </div>
      </div>
    </footer>
  )
}
