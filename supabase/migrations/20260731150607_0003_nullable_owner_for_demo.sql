/*
# Ajustement pour données de démonstration

## Objectif
Rendre companies.owner_id et applications.student_id nullable afin de pouvoir
insérer des données de démonstration sans compte utilisateur authentifié, tout
en conservant le propriétaire pour les vraies entreprises créées via l'auth.

## Changements
- companies.owner_id : nullable, FK conservé vers profiles(id).
- Aucune perte de données.
*/

alter table public.companies alter column owner_id drop not null;
