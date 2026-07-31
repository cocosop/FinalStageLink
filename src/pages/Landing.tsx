import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { GraduationCap, Building2, ShieldCheck, Search, ArrowRight, Sparkles, FileText, Users, BarChart3, CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Landing() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white" />
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute top-40 -left-24 -z-10 h-80 w-80 rounded-full bg-accent-200/40 blur-3xl" />

        <div className="container-page pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 animate-fade-up">
              <Sparkles className="h-3.5 w-3.5" />
              La plateforme qui rapproche les talents et les entreprises
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-900 text-balance animate-fade-up" style={{ animationDelay: '60ms' }}>
              Trouvez le stage qui lance <span className="text-brand-600">votre carrière</span>
            </h1>
            <p className="mt-5 text-lg text-ink-600 max-w-2xl animate-fade-up" style={{ animationDelay: '120ms' }}>
              FinalStageLink met en relation les étudiants et chercheurs de stage avec les entreprises
              qui recrutent. Stages académiques, stages professionnels, alternances — tout au même endroit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '180ms' }}>
              <Link to={profile ? (profile.role === 'company' ? '/company' : profile.role === 'admin' ? '/admin' : '/student') : '/signup'} className="btn-primary px-6 py-3 text-base">
                {profile ? 'Accéder à mon espace' : 'Commencer gratuitement'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/browse" className="btn-secondary px-6 py-3 text-base">
                <Search className="h-4 w-4" />
                Parcourir les offres
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-500 animate-fade-up" style={{ animationDelay: '240ms' }}>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent-500" /> Inscription gratuite</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent-500" /> Offres vérifiées</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent-500" /> Candidatures simplifiées</div>
            </div>
          </div>

          {/* Role cards */}
          <div className="mt-16 grid gap-5 sm:grid-cols-3">
            <RoleCard
              icon={<GraduationCap className="h-6 w-6" />}
              title="Étudiants"
              text="Créez votre profil, postulez en un clic et suivez vos candidatures."
              href="/signup"
              cta="Je suis étudiant"
              accent="brand"
              delay="300ms"
            />
            <RoleCard
              icon={<Building2 className="h-6 w-6" />}
              title="Entreprises"
              text="Publiez vos offres et gérez vos candidatures depuis un tableau de bord clair."
              href="/signup"
              cta="Je recrute"
              accent="accent"
              delay="360ms"
            />
            <RoleCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Administration"
              text="Modération, validation des comptes et pilotage de la plateforme."
              href="/signin"
              cta="Espace admin"
              accent="ink"
              delay="420ms"
            />
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-ink-200 bg-white">
        <div className="container-page py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <Stat value="1 200+" label="Offres de stage" />
          <Stat value="800+" label="Entreprises partenaires" />
          <Stat value="5 000+" label="Étudiants inscrits" />
          <Stat value="93%" label="Taux de placement" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container-page py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide">Fonctionnalités</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-ink-900 text-balance">
            Tout ce qu'il faut pour réussir votre recherche
          </h2>
          <p className="mt-3 text-ink-600">
            Une plateforme pensée pour les trois acteurs de la relation de stage.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Feature icon={<Search className="h-5 w-5" />} title="Recherche avancée"
            text="Filtrez par domaine, type de stage, lieu, télétravail et durée pour trouver l'offre idéale." />
          <Feature icon={<FileText className="h-5 w-5" />} title="Candidatures simplifiées"
            text="Postulez en un clic avec votre profil et une lettre de motivation. Suivez le statut en temps réel." />
          <Feature icon={<Building2 className="h-5 w-5" />} title="Espace entreprise"
            text="Publiez et gérez vos offres, consultez les profils et faites avancer les candidatures." />
          <Feature icon={<Users className="h-5 w-5" />} title="Profils vérifiés"
            text="Entreprises vérifiées par l'administration pour des candidatures en confiance." />
          <Feature icon={<BarChart3 className="h-5 w-5" />} title="Tableaux de bord"
            text="Statistiques, suivi des candidatures et journal d'activité pour chaque rôle." />
          <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Administration complète"
            text="Modération des comptes, validation des entreprises et supervision de l'activité." />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-ink-50 border-y border-ink-200">
        <div className="container-page py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide">Comment ça marche</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-ink-900">
              Trois étapes, un seul endroit
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step n="1" title="Créez votre compte" text="Choisissez votre profil : étudiant ou entreprise. C'est gratuit et rapide." />
            <Step n="2" title="Complétez votre profil" text="Ajoutez vos informations : CV, parcours, ou fiche entreprise et offres." />
            <Step n="3" title="Postulez ou recrutez" text="Les étudiants postulent, les entreprises gèrent les candidatures, l'admin supervise." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-20">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-8 py-14 sm:px-14 sm:py-16 text-center">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl" />
          <h2 className="relative font-display text-3xl sm:text-4xl font-bold text-white text-balance">
            Prêt à trouver votre prochain stage ?
          </h2>
          <p className="relative mt-4 text-brand-100 max-w-xl mx-auto">
            Rejoignez des milliers d'étudiants et d'entreprises qui utilisent FinalStageLink.
          </p>
          <div className="relative mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/signup" className="btn bg-white text-brand-700 px-6 py-3 text-base hover:bg-brand-50">
              Créer mon compte
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/browse" className="btn border border-brand-400 text-white px-6 py-3 text-base hover:bg-brand-600">
              Voir les offres
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function RoleCard({ icon, title, text, href, cta, accent, delay }: { icon: React.ReactNode; title: string; text: string; href: string; cta: string; accent: 'brand' | 'accent' | 'ink'; delay: string }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    accent: 'bg-accent-50 text-accent-700 border-accent-200',
    ink: 'bg-ink-100 text-ink-700 border-ink-200',
  }[accent]
  return (
    <Link to={href} className={`card p-6 group hover:shadow-card transition-all duration-300 hover:-translate-y-1 animate-fade-up`} style={{ animationDelay: delay }}>
      <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${tones}`}>{icon}</div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-500">{text}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 group-hover:gap-2.5 transition-all">
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-3xl font-bold text-brand-700">{value}</p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card p-6 hover:shadow-card transition-all duration-300">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-600">{icon}</div>
      <h3 className="mt-4 font-display font-semibold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-500 leading-relaxed">{text}</p>
    </div>
  )
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-white font-display font-bold shadow-soft">{n}</div>
      <div className="pt-2">
        <h3 className="font-display text-lg font-semibold text-ink-900">{title}</h3>
        <p className="mt-1.5 text-sm text-ink-500">{text}</p>
      </div>
    </div>
  )
}
