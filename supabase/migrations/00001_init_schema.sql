-- ============================================================================
-- Rugby Performance Coach — Schéma initial
-- ============================================================================
-- Toutes les tables sont protégées par Row Level Security (RLS) : chaque
-- utilisateur ne peut lire/écrire que ses propres lignes (user_id = auth.uid()).
-- Même si l'application n'a qu'un seul utilisateur aujourd'hui, ce modèle
-- permet d'ajouter sans douleur d'autres athlètes ou un préparateur physique
-- plus tard.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PROFILES — données athlète, objectifs, contraintes
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  prenom text not null default 'Joueur',
  taille_cm numeric(5,1) not null default 179,
  poids_kg numeric(5,1) not null default 84,
  postes text[] not null default array['Centre 12/13', 'Ailier', 'Demi de mêlée (occasionnel)'],
  poste_principal text not null default 'Centre 12/13',
  sport text not null default 'Rugby à XV',
  niveau text not null default 'Fédérale 3 · Rugby à 7',
  date_reprise date not null default '2026-07-22',
  objectif_court text,
  objectifs_long text[] not null default array[]::text[],
  equipement_disponible text[] not null default array[]::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Profil athlète unique par utilisateur : identité, anthropométrie, postes, objectifs.';

-- ----------------------------------------------------------------------------
-- 2. DAILY_CHECKINS — check-in quotidien (sommeil, douleurs, état général)
-- ----------------------------------------------------------------------------
create table public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  sommeil_h numeric(4,2) not null default 7,
  qualite_sommeil smallint not null default 7 check (qualite_sommeil between 0 and 10),
  energie smallint not null default 7 check (energie between 0 and 10),
  fatigue smallint not null default 4 check (fatigue between 0 and 10),
  stress smallint not null default 4 check (stress between 0 and 10),
  motivation smallint not null default 7 check (motivation between 0 and 10),
  douleur_ischio smallint not null default 0 check (douleur_ischio between 0 and 10),
  douleur_hanche smallint not null default 0 check (douleur_hanche between 0 and 10),
  douleur_pied smallint not null default 0 check (douleur_pied between 0 and 10),
  douleur_genou smallint not null default 0 check (douleur_genou between 0 and 10),
  poids_kg numeric(5,2),
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

comment on table public.daily_checkins is 'Un check-in par jour et par utilisateur. Sert de base au calcul readiness/recovery.';
create index daily_checkins_user_date_idx on public.daily_checkins (user_id, date desc);

-- ----------------------------------------------------------------------------
-- 3. INJURY_HISTORY — antécédents de blessure (référentiel, peu modifié)
-- ----------------------------------------------------------------------------
create table public.injury_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  zone text not null,
  cote text,
  type text not null,
  statut text not null check (statut in ('Récurrent', 'Antécédent', 'Surveillance')),
  annee text,
  impact text,
  strategie text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.injury_history is 'Antécédents de blessure connus : zone, statut, stratégie de prévention associée.';

-- ----------------------------------------------------------------------------
-- 4. TRAINING_SESSIONS — séances planifiées (catalogue / calendrier)
-- ----------------------------------------------------------------------------
create table public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  type text not null,
  titre text not null,
  duree_min smallint not null default 45,
  rpe_cible smallint check (rpe_cible between 1 and 10),
  objectif text,
  equipement text[] not null default array[]::text[],
  echauffement text[] not null default array[]::text[],
  travail_principal text[] not null default array[]::text[],
  accessoire text[] not null default array[]::text[],
  mobilite text[] not null default array[]::text[],
  prevention text[] not null default array[]::text[],
  recuperation text[] not null default array[]::text[],
  alternatives text[] not null default array[]::text[],
  contexte text check (contexte in ('Salle', 'Domicile', 'Vacances', 'Terrain')),
  statut text not null default 'planifiee' check (statut in ('planifiee', 'faite', 'manquee', 'adaptee')),
  created_at timestamptz not null default now()
);

comment on table public.training_sessions is 'Séances planifiées (calendrier). Le détail réellement effectué vit dans session_logs.';
create index training_sessions_user_date_idx on public.training_sessions (user_id, date);

-- ----------------------------------------------------------------------------
-- 5. SESSION_LOGS — exécution réelle d'une séance (RPE ressenti, douleurs post)
-- ----------------------------------------------------------------------------
create table public.session_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid references public.training_sessions(id) on delete set null,
  date date not null default current_date,
  rpe_ressenti smallint check (rpe_ressenti between 1 and 10),
  duree_reelle_min smallint,
  charge_totale numeric(8,2),
  douleur_post_ischio smallint check (douleur_post_ischio between 0 and 10),
  douleur_post_hanche smallint check (douleur_post_hanche between 0 and 10),
  douleur_post_pied smallint check (douleur_post_pied between 0 and 10),
  douleur_post_genou smallint check (douleur_post_genou between 0 and 10),
  series_completees jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

comment on table public.session_logs is 'Journal de ce qui a réellement été fait : RPE ressenti, charges, douleurs post-séance.';
create index session_logs_user_date_idx on public.session_logs (user_id, date desc);

-- ----------------------------------------------------------------------------
-- 6. MEAL_ENTRIES — journal nutritionnel (photo IA ou saisie manuelle)
-- ----------------------------------------------------------------------------
create table public.meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  repas text not null check (repas in ('Petit-déjeuner', 'Déjeuner', 'Collation', 'Dîner')),
  source text not null default 'manuel' check (source in ('photo_ia', 'manuel')),
  photo_url text,
  aliments text[] not null default array[]::text[],
  resume text,
  calories integer,
  proteines_g integer,
  glucides_g integer,
  lipides_g integer,
  feedback text,
  suggestions text[] not null default array[]::text[],
  created_at timestamptz not null default now()
);

comment on table public.meal_entries is 'Repas journalisés, via analyse photo IA ou saisie manuelle.';
create index meal_entries_user_date_idx on public.meal_entries (user_id, date desc);

-- ----------------------------------------------------------------------------
-- 7. RECOVERY_LOGS — checklist de récupération du soir, par jour
-- ----------------------------------------------------------------------------
create table public.recovery_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

comment on table public.recovery_logs is 'État de la checklist de récupération du soir, une entrée par jour.';

-- ============================================================================
-- ROW LEVEL SECURITY — chaque utilisateur n'accède qu'à ses propres données
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.injury_history enable row level security;
alter table public.training_sessions enable row level security;
alter table public.session_logs enable row level security;
alter table public.meal_entries enable row level security;
alter table public.recovery_logs enable row level security;

-- profiles : id = auth.uid() directement (pas de colonne user_id séparée)
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Toutes les autres tables suivent le même modèle user_id = auth.uid()
create policy "checkins_all_own" on public.daily_checkins for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "injuries_all_own" on public.injury_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_all_own" on public.training_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "logs_all_own" on public.session_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meals_all_own" on public.meal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "recovery_all_own" on public.recovery_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER — création automatique du profil à l'inscription
-- ============================================================================
-- Quand un utilisateur s'inscrit via Supabase Auth, on lui crée immédiatement
-- une ligne profiles avec les valeurs par défaut (déjà calibrées sur le
-- profil athlète connu). Évite d'avoir un utilisateur "orphelin" sans profil.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- TRIGGER — updated_at automatique
-- ============================================================================

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger injury_history_set_updated_at
  before update on public.injury_history
  for each row execute function public.set_updated_at();
