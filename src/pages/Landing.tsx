import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { GraduationCap, Building2, ShieldCheck, Search, ArrowRight, FileText, Users, ChartBar as BarChart3, CircleCheck as CheckCircle2, Zap, Target, TrendingUp } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Landing() {
  const { profile } = useAuth()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 -z-10 bg-dots opacity-60" />
        <div className="absolute -top-32 -right-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute top-20 -left-40 -z-10 h-80 w-80 rounded-full bg-accent-100/40 blur-3xl" />

        <div className="container-page pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-1.5 text-xs font-medium text-ink-700 shadow-soft animate-fade-up">
              <span className="flex h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
              La plateforme qui rapproche les talents et les entreprises
            </div>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink-900 text-balance animate-fade-up" style={{ animationDelay: '60ms' }}>
              Trouvez le stage qui lance <span className="relative inline-block">
                <span className="relative z-10 text-brand-600">votre carrière</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-accent-200/60 -z-0 rounded" />
              </span>
            </h1>
            <p className="mt-6 text-lg text-ink-600 max-w-2xl leading-relaxed animate-fade-up" style={{ animationDelay: '120ms' }}>
              Stagelink met en relation les étudiants et chercheurs de stage avec les entreprises
              qui recrutent. Stages académiques, stages professionnels, alternances — tout au même endroit.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '180ms' }}>
              <Link to={profile ? (profile.role === 'company' ? '/company' : profile.role === 'admin' ? '/admin' : '/student') : '/signup'} className="btn-primary px-6 py-3.5 text-base">
                {profile ? 'Accéder à mon espace' : 'Commencer gratuitement'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/browse" className="btn-secondary px-6 py-3.5 text-base">
                <Search className="h-4 w-4" />
                Parcourir les offres
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-600 animate-fade-up" style={{ animationDelay: '240ms' }}>
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
      <section className="bg-ink-900 text-white">
        <div className="container-page py-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat value="1 200+" label="Offres de stage" />
          <Stat value="800+" label="Entreprises partenaires" />
          <Stat value="5 000+" label="Étudiants inscrits" />
          <Stat value="93%" label="Taux de placement" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container-page py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
            <Zap className="h-3.5 w-3.5" />
            Fonctionnalités
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-ink-900 text-balance">
            Tout ce qu'il faut pour réussir votre recherche
          </h2>
          <p className="mt-3 text-ink-600 text-lg">
            Une plateforme pensée pour les trois acteurs de la relation de stage.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="container-page py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Target className="h-3.5 w-3.5" />
              Comment ça marche
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-ink-900">
              Trois étapes, un seul endroit
            </h2>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <Step n="1" title="Créez votre compte" text="Choisissez votre profil : étudiant ou entreprise. C'est gratuit et rapide." />
            <Step n="2" title="Complétez votre profil" text="Ajoutez vos informations : CV, parcours, ou fiche entreprise et offres." />
            <Step n="3" title="Postulez ou recrutez" text="Postulez, les entreprises gèrent les candidatures, l'admin supervise." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 px-8 py-16 sm:px-14 sm:py-20 text-center">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent-400/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <TrendingUp className="h-10 w-10 text-white/80 mx-auto" />
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-bold text-white text-balance">
              Prêt à trouver votre prochain stage ?
            </h2>
            <p className="mt-4 text-brand-100 max-w-xl mx-auto text-lg">
              Rejoignez des milliers d'étudiants et d'entreprises qui utilisent Stagelink.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/signup" className="btn bg-white text-brand-700 px-6 py-3.5 text-base hover:bg-brand-50 shadow-lg active:scale-[0.98]">
                Créer mon compte
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/browse" className="btn border border-white/30 text-white px-6 py-3.5 text-base hover:bg-white/10 active:scale-[0.98]">
                Voir les offres
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function RoleCard({ icon, title, text, href, cta, accent, delay }: { icon: React.ReactNode; title: string; text: string; href: string; cta: string; accent: 'brand' | 'accent' | 'ink'; delay: string }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-600 border-brand-100',
    accent: 'bg-accent-50 text-accent-600 border-accent-100',
    ink: 'bg-ink-100 text-ink-700 border-ink-200',
  }[accent]
  const ctaTone = {
    brand: 'text-brand-600',
    accent: 'text-accent-600',
    ink: 'text-ink-700',
  }[accent]
  return (
    <Link to={href} className={`card-hover p-7 group animate-fade-up`} style={{ animationDelay: delay }}>
      <div className={`grid h-12 w-12 place-items-center rounded-2xl border ${tones}`}>{icon}</div>
      <h3 className="mt-5 font-display text-lg font-bold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-500 leading-relaxed">{text}</p>
      <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${ctaTone} group-hover:gap-2.5 transition-all`}>
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-4xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-sm text-ink-400">{label}</p>
    </div>
  )
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="card-hover p-7">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-ink-50 text-ink-700 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">{icon}</div>
      <h3 className="mt-5 font-display font-bold text-ink-900">{title}</h3>
      <p className="mt-2 text-sm text-ink-500 leading-relaxed">{text}</p>
    </div>
  )
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-0 top-0 grid h-12 w-12 place-items-center rounded-2xl bg-white border border-ink-200 shadow-soft text-brand-600 font-display text-lg font-bold">{n}</div>
      <div className="pt-1">
        <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
        <p className="mt-2 text-sm text-ink-500 leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
