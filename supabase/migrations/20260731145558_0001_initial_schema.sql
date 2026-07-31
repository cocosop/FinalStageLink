/*
# Plateforme FinalStageLink — schéma initial

## Objectif
Mettre en place la base de données d'une plateforme de recherche de stage
académique et professionnel reliant étudiants, entreprises et un administrateur.

## Nouvelles tables
1. `profiles` — profil utilisateur lié à auth.users, avec un rôle (student / company / admin).
2. `companies` — fiches entreprises, créées par les utilisateurs de rôle `company`.
3. `internships` — offres de stage publiées par les entreprises.
4. `applications` — candidatures des étudiants sur les offres.
5. `events` — journal d'activité (connexions, publications, candidatures) pour l'admin.

## Colonnes principales
- profiles: id (uuid PK = auth.users.id), email, full_name, role, avatar_url, phone, bio, created_at.
- companies: id, owner_id (-> profiles.id), name, slug, description, sector, website, location, logo_url, size, verified, created_at.
- internships: id, company_id, title, description, type (academic/professional/both), field, location, remote, duration_weeks, start_date, compensation, requirements, status (draft/open/closed), spots, created_at.
- applications: id, internship_id, student_id, cover_letter, status (submitted/reviewing/accepted/rejected), created_at.
- events: id, actor_id, type, message, created_at.

## Sécurité (RLS)
- RLS activée sur toutes les tables.
- `profiles` : lecture publique (annuaire), mise à jour par le propriétaire, admin peut tout.
- `companies` : lecture publique, écriture par le propriétaire (company) ou admin.
- `internships` : lecture publique des offres ouvertes, écriture par l'entreprise propriétaire ou admin.
- `applications` : un étudiant lit/met à jour ses candidatures ; une entreprise lit les candidatures sur ses offres et fait avancer le statut ; l'admin voit tout.
- `events` : lecture par admin uniquement, insertion par tout utilisateur authentifié.

## Notes importantes
1. Les politiques utilisent `auth.uid()` et un helper `is_admin()` basé sur le rôle du profil.
2. L'id du profil EST l'id de auth.users.
3. Les colonnes owner/student utilisent `DEFAULT auth.uid()` pour les inserts côté client.
4. Le rôle `admin` est attribué manuellement en base par l'opérateur.
*/

-- =========================================================
-- 1. profiles table (sans politiques qui référencent is_admin)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'student' check (role in ('student','company','admin')),
  avatar_url text,
  phone text,
  bio text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- politiques qui n'ont pas besoin de is_admin
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  to anon, authenticated
  using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- =========================================================
-- 2. is_admin() helper (dépend de profiles)
-- =========================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- politique update qui référence is_admin (maintenant définie)
drop policy if exists "profiles_update_self_or_admin" on public.profiles;
create policy "profiles_update_self_or_admin"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- =========================================================
-- 3. companies
-- =========================================================
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  name text not null,
  slug text unique,
  description text,
  sector text,
  website text,
  location text,
  logo_url text,
  size text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;

drop policy if exists "companies_select_all" on public.companies;
create policy "companies_select_all"
  on public.companies for select
  to anon, authenticated
  using (true);

drop policy if exists "companies_insert_owner" on public.companies;
create policy "companies_insert_owner"
  on public.companies for insert
  to authenticated
  with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "companies_update_owner_or_admin" on public.companies;
create policy "companies_update_owner_or_admin"
  on public.companies for update
  to authenticated
  using (auth.uid() = owner_id or public.is_admin())
  with check (auth.uid() = owner_id or public.is_admin());

drop policy if exists "companies_delete_owner_or_admin" on public.companies;
create policy "companies_delete_owner_or_admin"
  on public.companies for delete
  to authenticated
  using (auth.uid() = owner_id or public.is_admin());

-- =========================================================
-- 4. internships
-- =========================================================
create table if not exists public.internships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  type text not null default 'professional' check (type in ('academic','professional','both')),
  field text not null default '',
  location text,
  remote boolean not null default false,
  duration_weeks integer,
  start_date date,
  compensation text,
  requirements text,
  status text not null default 'draft' check (status in ('draft','open','closed')),
  spots integer,
  created_at timestamptz not null default now()
);

alter table public.internships enable row level security;

drop policy if exists "internships_select_open" on public.internships;
create policy "internships_select_open"
  on public.internships for select
  to anon, authenticated
  using (
    status = 'open'
    or exists (
      select 1 from public.companies c
      where c.id = internships.company_id and c.owner_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "internships_insert_owner" on public.internships;
create policy "internships_insert_owner"
  on public.internships for insert
  to authenticated
  with check (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.owner_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "internships_update_owner_or_admin" on public.internships;
create policy "internships_update_owner_or_admin"
  on public.internships for update
  to authenticated
  using (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.owner_id = auth.uid()
    )
    or public.is_admin()
  )
  with check (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.owner_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "internships_delete_owner_or_admin" on public.internships;
create policy "internships_delete_owner_or_admin"
  on public.internships for delete
  to authenticated
  using (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.owner_id = auth.uid()
    )
    or public.is_admin()
  );

-- =========================================================
-- 5. applications
-- =========================================================
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  internship_id uuid not null references public.internships(id) on delete cascade,
  student_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  cover_letter text,
  status text not null default 'submitted' check (status in ('submitted','reviewing','accepted','rejected')),
  created_at timestamptz not null default now(),
  unique (internship_id, student_id)
);

alter table public.applications enable row level security;

drop policy if exists "applications_select_visible" on public.applications;
create policy "applications_select_visible"
  on public.applications for select
  to authenticated
  using (
    student_id = auth.uid()
    or exists (
      select 1 from public.internships i
      join public.companies c on c.id = i.company_id
      where i.id = applications.internship_id and c.owner_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "applications_insert_student" on public.applications;
create policy "applications_insert_student"
  on public.applications for insert
  to authenticated
  with check (
    student_id = auth.uid()
    and exists (
      select 1 from public.internships i where i.id = internship_id and i.status = 'open'
    )
  );

drop policy if exists "applications_update_owner_or_company" on public.applications;
create policy "applications_update_owner_or_company"
  on public.applications for update
  to authenticated
  using (
    student_id = auth.uid()
    or exists (
      select 1 from public.internships i
      join public.companies c on c.id = i.company_id
      where i.id = applications.internship_id and c.owner_id = auth.uid()
    )
    or public.is_admin()
  )
  with check (
    student_id = auth.uid()
    or exists (
      select 1 from public.internships i
      join public.companies c on c.id = i.company_id
      where i.id = applications.internship_id and c.owner_id = auth.uid()
    )
    or public.is_admin()
  );

drop policy if exists "applications_delete_owner" on public.applications;
create policy "applications_delete_owner"
  on public.applications for delete
  to authenticated
  using (student_id = auth.uid() or public.is_admin());

-- =========================================================
-- 6. events (journal d'activité admin)
-- =========================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "events_select_admin" on public.events;
create policy "events_select_admin"
  on public.events for select
  to authenticated
  using (public.is_admin());

drop policy if exists "events_insert_any" on public.events;
create policy "events_insert_any"
  on public.events for insert
  to authenticated
  with check (auth.uid() = actor_id or actor_id is null);

-- =========================================================
-- Index
-- =========================================================
create index if not exists idx_internships_status on public.internships (status);
create index if not exists idx_internships_company on public.internships (company_id);
create index if not exists idx_applications_student on public.applications (student_id);
create index if not exists idx_applications_internship on public.applications (internship_id);
create index if not exists idx_companies_owner on public.companies (owner_id);
create index if not exists idx_events_created on public.events (created_at desc);
