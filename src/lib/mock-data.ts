// Sample data for Rugby Performance Coach — V1 (pré-Supabase)
// Toutes les chaînes destinées à l'utilisateur sont en français.

export type Profile = {
  prenom: string;
  taille_cm: number;
  poids_kg: number;
  postes: string[];
  niveau: string;
  date_reprise: string; // ISO
};

export const profile: Profile = {
  prenom: "Joueur",
  taille_cm: 179,
  poids_kg: 84,
  postes: ["Centre 12/13", "Ailier", "Demi de mêlée"],
  niveau: "Fédérale 3 · Rugby à 7",
  date_reprise: "2026-07-22",
};

export type DailyCheckin = {
  date: string;
  sommeil_h: number;
  qualite_sommeil: number; // /10
  energie: number;
  fatigue: number;
  stress: number;
  motivation: number;
  douleur_ischio: number;
  douleur_hanche: number;
  douleur_pied: number;
  douleur_genou: number;
  poids_kg: number;
  notes?: string;
};

const today = new Date();
const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return iso(d);
};

export const checkins: DailyCheckin[] = Array.from({ length: 14 }).map((_, i) => {
  const n = 13 - i;
  return {
    date: daysAgo(n),
    sommeil_h: 6.5 + Math.sin(i / 2) * 0.8 + (i > 10 ? 0.5 : 0),
    qualite_sommeil: 6 + Math.round(Math.sin(i) + 2),
    energie: 6 + Math.round(Math.cos(i / 2) + 1),
    fatigue: 5 + Math.round(Math.sin(i / 3) + 1),
    stress: 4 + Math.round(Math.cos(i) + 1),
    motivation: 7 + Math.round(Math.sin(i / 4)),
    douleur_ischio: Math.max(0, 2 + Math.round(Math.sin(i / 2))),
    douleur_hanche: Math.max(0, 1 + Math.round(Math.cos(i / 2))),
    douleur_pied: Math.max(0, 1 + (i % 5 === 0 ? 2 : 0)),
    douleur_genou: 0,
    poids_kg: 84 + Math.sin(i / 3) * 0.6,
  };
});

export const lastCheckin = checkins[checkins.length - 1];

export function computeReadiness(c: DailyCheckin): number {
  // Score 0–100 — pondération athlète
  const sleep = Math.min(1, c.sommeil_h / 8) * 25;
  const sleepQ = (c.qualite_sommeil / 10) * 15;
  const energy = (c.energie / 10) * 20;
  const fatigue = (1 - c.fatigue / 10) * 15;
  const stress = (1 - c.stress / 10) * 10;
  const pain =
    (1 -
      (c.douleur_ischio + c.douleur_hanche + c.douleur_pied + c.douleur_genou) /
        40) *
    15;
  return Math.round(sleep + sleepQ + energy + fatigue + stress + pain);
}

export const readinessToday = computeReadiness(lastCheckin);
export const recoveryToday = Math.round(
  ((lastCheckin.qualite_sommeil / 10) * 0.5 +
    (1 - lastCheckin.fatigue / 10) * 0.5) *
    100,
);

export type SessionType =
  | "Force bas du corps"
  | "Force haut du corps"
  | "Vitesse / Accélération"
  | "Conditioning"
  | "Mobilité"
  | "Récupération"
  | "Prévention ischio"
  | "Mobilité hanches"
  | "Renfo pieds"
  | "Gainage / Core";

export type TrainingSession = {
  id: string;
  date: string;
  type: SessionType;
  titre: string;
  duree_min: number;
  rpe_cible: number;
  objectif: string;
  equipement: string[];
  echauffement: string[];
  travail_principal: string[];
  accessoire: string[];
  mobilite: string[];
  prevention: string[];
  recuperation: string[];
  alternatives?: string[];
};

export const sessions: TrainingSession[] = [
  {
    id: "s-today",
    date: iso(today),
    type: "Force bas du corps",
    titre: "Force MI — base posté­rieure",
    duree_min: 60,
    rpe_cible: 7,
    objectif:
      "Construire la base de force du train inférieur, sécuriser la chaîne postérieure (ischios).",
    equipement: ["Barre", "Rack", "Élastique"],
    echauffement: [
      "5 min vélo bas régime",
      "Mobilité hanches 90/90 — 2×8",
      "Glute bridge — 2×10",
      "Goblet squat léger — 2×8",
    ],
    travail_principal: [
      "Back squat — 4×5 @ RPE 7",
      "Romanian deadlift — 4×6 (contrôle ischio)",
      "Hip thrust — 3×8",
    ],
    accessoire: [
      "Fente bulgare — 3×8/jambe",
      "Nordic curl assisté — 3×5 (excentrique 4s)",
    ],
    mobilite: ["Pigeon — 2×45s/côté", "Couch stretch — 2×40s/côté"],
    prevention: [
      "Copenhagen adducteur — 2×6/côté",
      "Single leg calf raise — 2×12",
    ],
    recuperation: [
      "Marche 10 min",
      "Boisson récup + 30g protéines",
      "Étirements doux ischio (statique court)",
    ],
    alternatives: [
      "Sans rack : goblet squat lourd + RDL haltères",
      "Sans matériel : split squat sauté + glute bridge mono",
    ],
  },
  {
    id: "s-2",
    date: daysAgo(-1),
    type: "Mobilité",
    titre: "Mobilité hanches & pieds",
    duree_min: 25,
    rpe_cible: 3,
    objectif: "Décharger les hanches, mobiliser la cheville, soulager le pied.",
    equipement: ["Tapis", "Balle de massage"],
    echauffement: ["Marche active 3 min", "Cat-cow — 2×10"],
    travail_principal: [
      "90/90 hip switch — 3×8",
      "World's greatest stretch — 2×6/côté",
      "Ankle CARs — 2×8/cheville",
    ],
    accessoire: ["Auto-massage voûte plantaire — 2 min/pied"],
    mobilite: ["Couch stretch — 2×45s", "Pigeon profond — 2×60s"],
    prevention: ["Toe yoga — 2×10", "Short foot — 2×10"],
    recuperation: ["Respiration nasale 5 min"],
  },
  {
    id: "s-3",
    date: daysAgo(-2),
    type: "Vitesse / Accélération",
    titre: "Accélérations courtes 10–20m",
    duree_min: 50,
    rpe_cible: 8,
    objectif: "Améliorer la sortie de starts et la fréquence sur 10–20m.",
    equipement: ["Plots", "Terrain"],
    echauffement: [
      "Course progressive 8 min",
      "Skipping, talons-fesses, A-skip — 2×20m",
      "3 lignes progressives 60-80-95%",
    ],
    travail_principal: [
      "6×10m départ debout, repos 1'30",
      "4×20m départ 3 appuis, repos 2'",
    ],
    accessoire: ["Sauts horizontaux — 3×3", "Bondissements alternés — 3×6"],
    mobilite: ["Ischios actifs — 2×8", "Hanches CARs"],
    prevention: ["Iso-hold ischio 45° — 2×20s/jambe"],
    recuperation: ["Retour au calme 8 min", "Glace voûte plantaire si gêne"],
    alternatives: ["Si gêne ischio : remplacer par technique de course sub-max"],
  },
  {
    id: "s-4",
    date: daysAgo(-3),
    type: "Conditioning",
    titre: "Conditioning rugby — répétitions d'efforts",
    duree_min: 35,
    rpe_cible: 8,
    objectif: "Reproduire le profil d'effort rugby (intervalles courts intenses).",
    equipement: ["Terrain"],
    echauffement: ["Mobilité dynamique 8 min"],
    travail_principal: [
      "6×(40m sprint + 20m marche) — repos 90s",
      "4 tours : 30s shuttle 5-10-5 / 30s repos actif",
    ],
    accessoire: [],
    mobilite: ["Stretch global 5 min"],
    prevention: ["Calf raises lents — 2×15"],
    recuperation: ["10 min marche", "Hydratation + électrolytes"],
  },
  {
    id: "s-5",
    date: daysAgo(-4),
    type: "Force haut du corps",
    titre: "Push / Pull rugby",
    duree_min: 55,
    rpe_cible: 7,
    objectif: "Force fonctionnelle du haut du corps pour plaquages et rucks.",
    equipement: ["Barre", "Haltères", "Tractions"],
    echauffement: ["Band pull-apart 2×15", "Push-up 2×10"],
    travail_principal: [
      "Bench press — 4×5 @ RPE 7",
      "Tractions lestées — 4×5",
      "Rowing barre — 3×8",
    ],
    accessoire: ["Dips — 3×8", "Face pull — 3×12", "Farmer carry — 3×30m"],
    mobilite: ["Épaules CARs 2×5", "T-spine rotation 2×6/côté"],
    prevention: ["Rotateurs externes élastique — 2×12"],
    recuperation: ["30g protéines", "Sommeil prioritaire"],
  },
];

export const todaySession = sessions[0];

// Calendrier jusqu'au 22 juillet
export type CalendarEntry = {
  date: string;
  type: SessionType | "Repos";
  titre: string;
  duree_min?: number;
  contexte?: "Domicile" | "Salle" | "Terrain" | "Vacances" | "Voyage";
};

function buildCalendar(): CalendarEntry[] {
  const target = new Date("2026-07-22");
  const start = new Date(today);
  const out: CalendarEntry[] = [];
  const cycle: Array<{ type: CalendarEntry["type"]; titre: string; duree?: number }> = [
    { type: "Force bas du corps", titre: "Force MI — base postérieure", duree: 60 },
    { type: "Mobilité hanches", titre: "Mobilité hanches & pieds", duree: 25 },
    { type: "Vitesse / Accélération", titre: "Accélérations 10–20m", duree: 50 },
    { type: "Force haut du corps", titre: "Push / Pull rugby", duree: 55 },
    { type: "Conditioning", titre: "Répétitions d'efforts", duree: 35 },
    { type: "Prévention ischio", titre: "Routine ischios + Copenhagen", duree: 20 },
    { type: "Repos", titre: "Récupération active" },
  ];
  let i = 0;
  for (let d = new Date(start); d <= target; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    const entry = cycle[i % cycle.length];
    // Dimanche = repos par défaut
    out.push({
      date: iso(new Date(d)),
      type: day === 0 ? "Repos" : entry.type,
      titre: day === 0 ? "Récupération complète" : entry.titre,
      duree_min: day === 0 ? undefined : entry.duree,
      contexte: "Salle",
    });
    i++;
  }
  return out;
}

export const calendar = buildCalendar();

export type PainLog = { date: string; zone: string; niveau: number };
export const painLogs: PainLog[] = checkins.flatMap((c) => [
  { date: c.date, zone: "Ischio droit", niveau: c.douleur_ischio },
  { date: c.date, zone: "Hanche", niveau: c.douleur_hanche },
  { date: c.date, zone: "Pied", niveau: c.douleur_pied },
  { date: c.date, zone: "Genou (LLI)", niveau: c.douleur_genou },
]);

export const injuryHistory = [
  { zone: "Ischio droit", note: "Récidive — surveillance volume sprint" },
  { zone: "Hanche", note: "Raideur chronique — mobilité quotidienne" },
  { zone: "Pied", note: "Douleur plantaire — gestion impacts" },
  { zone: "Genou gauche", note: "Entorse LLI — renforcer chaîne latérale" },
  { zone: "Tibia", note: "Ancienne fracture — surveiller charge impact" },
];

export const nutritionToday = {
  proteines_g: 142,
  proteines_cible_g: 170,
  hydratation_l: 2.4,
  hydratation_cible_l: 3.5,
  creatine: true,
  collagene: true,
  magnesium: true,
  omega3: false,
};

export const recoveryChecklist = [
  { id: "froid", label: "Douche froide 2 min", done: true },
  { id: "etirements", label: "Étirements doux 10 min", done: true },
  { id: "magnesium", label: "Magnésium soir", done: false },
  { id: "ecran", label: "Coupure écrans 30 min avant lit", done: false },
  { id: "lit", label: "Au lit avant 23h", done: false },
];

export const seasonStart = new Date("2026-07-22");
export function daysUntil(date: Date): number {
  const ms = date.getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil(ms / 86400000));
}
