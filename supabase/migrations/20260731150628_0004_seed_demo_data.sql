/*
# Données de démonstration FinalStageLink

## Objectif
Insérer des entreprises et offres de stage de démonstration pour que la
plateforme ne soit pas vide au premier lancement.

## Notes
- Les UUID sont fixes pour garantir l'idempotence.
- owner_id est NULL pour ces entreprises de démonstration (pas de compte lié).
*/

INSERT INTO public.companies (id, owner_id, name, slug, description, sector, website, location, size, verified, created_at)
SELECT '11111111-1111-1111-1111-111111111111', NULL,
       'TechNova Labs', 'technova-labs',
       'TechNova Labs est une entreprise spécialisée dans le développement de solutions logicielles innovantes pour les secteurs de la santé et de l''éducation.',
       'Technologie', 'https://example.com/technova', 'Paris, France', '50-200', true, now()
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE id = '11111111-1111-1111-1111-111111111111');

INSERT INTO public.companies (id, owner_id, name, slug, description, sector, website, location, size, verified, created_at)
SELECT '22222222-2222-2222-2222-222222222222', NULL,
       'GreenField Agro', 'greenfield-agro',
       'GreenField Agro développe des solutions agricoles durables et connectées pour les fermes modernes.',
       'Agriculture', 'https://example.com/greenfield', 'Lyon, France', '10-50', false, now()
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE id = '22222222-2222-2222-2222-222222222222');

INSERT INTO public.companies (id, owner_id, name, slug, description, sector, website, location, size, verified, created_at)
SELECT '33333333-3333-3333-3333-333333333333', NULL,
       'Studio Pixel', 'studio-pixel',
       'Agence de design et de communication créative. Nous accompagnons les marques dans leur identité visuelle.',
       'Design', 'https://example.com/studiopixel', 'Bordeaux, France', '10-50', true, now()
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE id = '33333333-3333-3333-3333-333333333333');

INSERT INTO public.companies (id, owner_id, name, slug, description, sector, website, location, size, verified, created_at)
SELECT '44444444-4444-4444-4444-444444444444', NULL,
       'DataForge Analytics', 'dataforge',
       'DataForge Analytics aide les entreprises à exploiter leurs données grâce à l''IA et au machine learning.',
       'Data / IA', 'https://example.com/dataforge', 'Nantes, France', '200-500', true, now()
WHERE NOT EXISTS (SELECT 1 FROM public.companies WHERE id = '44444444-4444-4444-4444-444444444444');

INSERT INTO public.internships (id, company_id, title, description, type, field, location, remote, duration_weeks, start_date, compensation, requirements, status, spots, created_at) VALUES
('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
 'Stage Développeur Web Full-Stack',
 'Rejoignez notre équipe pour développer de nouvelles fonctionnalités de notre plateforme SaaS. Vous travaillerez sur React, Node.js et PostgreSQL.',
 'professional', 'Informatique', 'Paris, France', true, 12, '2026-09-01', '700 €/mois', 'Connaissances en JavaScript et bases de données. Autonomie et curiosité.', 'open', 2, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.internships (id, company_id, title, description, type, field, location, remote, duration_weeks, start_date, compensation, requirements, status, spots, created_at) VALUES
('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
 'Stage Data Scientist',
 'Analyse de jeux de données santé, mise en place de modèles prédictifs et visualisation des résultats.',
 'both', 'Data / IA', 'Paris, France', false, 24, '2026-10-01', '800 €/mois', 'Python, Pandas, notions de machine learning.', 'open', 1, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.internships (id, company_id, title, description, type, field, location, remote, duration_weeks, start_date, compensation, requirements, status, spots, created_at) VALUES
('a3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
 'Stage Ingénieur Agronome',
 'Participation à des projets d''agriculture de précision : capteurs IoT, analyse des sols, optimisation des rendements.',
 'academic', 'Agronomie', 'Lyon, France', false, 16, '2026-09-15', 'Indemnité légale', 'Étudiant en école d''agronomie, intérêt pour l''agriculture durable.', 'open', 3, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.internships (id, company_id, title, description, type, field, location, remote, duration_weeks, start_date, compensation, requirements, status, spots, created_at) VALUES
('a4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333',
 'Stage Designer Graphique',
 'Création d''identités visuelles, supports de communication et maquettes web pour nos clients.',
 'professional', 'Design', 'Bordeaux, France', true, 10, '2026-11-01', '600 €/mois', 'Maîtrise de la suite Adobe, portfolio requis.', 'open', 2, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.internships (id, company_id, title, description, type, field, location, remote, duration_weeks, start_date, compensation, requirements, status, spots, created_at) VALUES
('a5555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444',
 'Stage Ingénieur Machine Learning',
 'Développement de modèles de recommandation et de NLP pour nos clients enterprise.',
 'both', 'Data / IA', 'Nantes, France', true, 24, '2026-09-01', '1000 €/mois', 'Python, PyTorch/TensorFlow, projets personnels appréciés.', 'open', 2, now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.internships (id, company_id, title, description, type, field, location, remote, duration_weeks, start_date, compensation, requirements, status, spots, created_at) VALUES
('a6666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111',
 'Stage Marketing Digital',
 'Animation des réseaux sociaux, création de contenus et analyse des campagnes publicitaires.',
 'professional', 'Marketing', 'Paris, France', true, 8, '2026-10-15', '550 €/mois', 'Créativité, notions de SEO/SEA, anglais écrit.', 'draft', 1, now())
ON CONFLICT (id) DO NOTHING;
