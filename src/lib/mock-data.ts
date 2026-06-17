// Rugby Performance Coach — données structurées (prêt Supabase)
// Toutes les chaînes destinées à l'utilisateur sont en français.

export type Profile = {
  prenom: string;
  taille_cm: number;
  poids_kg: number;
  postes: string[];
  poste_principal: string;
  sport: string;
  niveau: string;
  date_reprise: string; // ISO
  objectif_court: string;
  objectifs_long: string[];
};

export const profile: Profile = {
  prenom: "Joueur",
  taille_cm: 179,
  poids_kg: 84,
  poste_principal: "Centre 12/13",
  postes: ["Centre 12/13", "Ailier", "Demi de mêlée (occasionnel)"],
  sport: "Rugby à XV",
  niveau: "Fédérale 3 · Rugby à 7",
  date_reprise: "2026-07-22",
  objectif_court:
    "Arriver pleinement prêt pour la reprise pré-saison le 22 juillet.",
  objectifs_long: [
    "Augmenter la vitesse",
    "Augmenter l'accélération",
    "Augmenter la puissance",
    "Améliorer la condition physique",
    "Améliorer la mobilité",
    "Réduire le risque de blessure",
    "Améliorer la récupération",
    "Améliorer la performance rugby",
  ],
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

// IMPORTANT : on fige la date de référence pour éviter les écarts SSR / client.
// (la "date du jour" est calculée côté client dans les composants quand nécessaire).
const REF_DATE = "2026-06-17";
const today = new Date(REF_DATE);
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
    sommeil_h: Number((6.5 + Math.sin(i / 2) * 0.8 + (i > 10 ? 0.5 : 0)).toFixed(2)),
    qualite_sommeil: 6 + Math.round(Math.sin(i) + 2),
    energie: 6 + Math.round(Math.cos(i / 2) + 1),
    fatigue: 5 + Math.round(Math.sin(i / 3) + 1),
    stress: 4 + Math.round(Math.cos(i) + 1),
    motivation: 7 + Math.round(Math.sin(i / 4)),
    douleur_ischio: Math.max(0, 2 + Math.round(Math.sin(i / 2))),
    douleur_hanche: Math.max(0, 1 + Math.round(Math.cos(i / 2))),
    douleur_pied: Math.max(0, 1 + (i % 5 === 0 ? 2 : 0)),
    douleur_genou: 0,
    poids_kg: Number((84 + Math.sin(i / 3) * 0.6).toFixed(2)),
  };
});

export const lastCheckin = checkins[checkins.length - 1];

export function computeReadiness(c: DailyCheckin): number {
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

export function computeRecovery(c: DailyCheckin): number {
  const sleep = Math.min(1, c.sommeil_h / 8) * 35;
  const sleepQ = (c.qualite_sommeil / 10) * 25;
  const fatigue = (1 - c.fatigue / 10) * 20;
  const stress = (1 - c.stress / 10) * 10;
  const pain =
    (1 -
      (c.douleur_ischio + c.douleur_hanche + c.douleur_pied + c.douleur_genou) /
        40) *
    10;
  return Math.round(sleep + sleepQ + fatigue + stress + pain);
}

export const readinessToday = computeReadiness(lastCheckin);
export const recoveryToday = computeRecovery(lastCheckin);

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
    titre: "Force MI — base postérieure",
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

// Antécédents médicaux détaillés
export type InjuryRecord = {
  id: string;
  zone: string;
  cote?: "Gauche" | "Droit" | "Bilatéral";
  type: string;
  statut: "Récurrent" | "Antécédent" | "Surveillance";
  annee?: string;
  impact: string;
  strategie: string;
};

export const injuryHistory: InjuryRecord[] = [
  {
    id: "ih-1",
    zone: "Ischio-jambier",
    cote: "Droit",
    type: "Lésion récurrente · faiblesse",
    statut: "Récurrent",
    annee: "Plusieurs épisodes",
    impact:
      "Sensible aux volumes de sprint élevés et au soulevé de terre lourd.",
    strategie:
      "Excentriques Nordic curls 2×/sem · iso 45° avant sprint · progression sprint contrôlée · RDL léger contrôle.",
  },
  {
    id: "ih-2",
    zone: "Genou",
    cote: "Gauche",
    type: "Entorse LLI (ligament latéral interne)",
    statut: "Antécédent",
    impact:
      "Stabilité latérale à surveiller sur changements d'appuis et plaquages côté faible.",
    strategie:
      "Renfo chaîne latérale (Copenhagen, side plank, glute med) · stabilité monopodale.",
  },
  {
    id: "ih-3",
    zone: "Tibia",
    cote: "Droit",
    type: "Ancienne fracture",
    statut: "Surveillance",
    impact:
      "Tolérance aux impacts répétés à surveiller (plyométrie, terrain dur).",
    strategie:
      "Progression de charge impact graduelle · gainage du mollet · vérifier douleur post-séance.",
  },
  {
    id: "ih-4",
    zone: "Pied / voûte plantaire",
    cote: "Bilatéral",
    type: "Douleurs récurrentes · gêne plantaire",
    statut: "Récurrent",
    impact:
      "Volume d'impacts à surveiller · raideur matinale possible.",
    strategie:
      "Short foot, toe yoga, calf raises lents · auto-massage voûte · alterner chaussures.",
  },
  {
    id: "ih-5",
    zone: "Hanche",
    cote: "Bilatéral",
    type: "Raideur chronique · gêne occasionnelle",
    statut: "Récurrent",
    impact:
      "Limite l'amplitude en squat profond et la mobilité de course.",
    strategie:
      "Mobilité quotidienne 90/90 · couch stretch · CARs hanches · décompression.",
  },
];

// Nutrition — cibles & supplémentation
export type SupplementTarget = {
  id: string;
  label: string;
  dose: string;
  moment: string;
  pris: boolean;
};

export const nutritionToday = {
  proteines_g: 142,
  proteines_cible_g: 170, // ~2g/kg
  hydratation_l: 2.4,
  hydratation_cible_l: 3.5,
  glucides_g: 280,
  glucides_cible_g: 380,
  lipides_g: 75,
  lipides_cible_g: 90,
  calories: 2620,
  calories_cible: 3100,
};

export const supplements: SupplementTarget[] = [
  { id: "creatine", label: "Créatine monohydrate", dose: "5 g", moment: "Matin ou post-séance", pris: true },
  { id: "collagene", label: "Collagène + Vit. C", dose: "10 g", moment: "30 min avant séance", pris: true },
  { id: "magnesium", label: "Magnésium bisglycinate", dose: "300 mg", moment: "Soir", pris: false },
  { id: "omega3", label: "Oméga 3 EPA/DHA", dose: "2 g", moment: "Avec un repas gras", pris: false },
];

// Journal photo des repas
export type MealPhotoEntry = {
  id: string;
  date: string;
  repas: "Petit-déjeuner" | "Déjeuner" | "Collation" | "Dîner";
  resume: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  feedback: string;
};

export const mealJournal: MealPhotoEntry[] = [
  {
    id: "m-1",
    date: iso(today),
    repas: "Déjeuner",
    resume: "Poulet grillé, riz basmati, brocolis, huile d'olive",
    calories: 720,
    proteines: 52,
    glucides: 78,
    lipides: 22,
    feedback:
      "Très bon profil post-entraînement. Ajouter une portion de fruits pour glycogène + micronutriments.",
  },
  {
    id: "m-2",
    date: daysAgo(1),
    repas: "Petit-déjeuner",
    resume: "Flocons d'avoine, fromage blanc 0%, myrtilles, amandes",
    calories: 540,
    proteines: 36,
    glucides: 62,
    lipides: 16,
    feedback:
      "Équilibré. Augmenter un peu les glucides un jour de séance vitesse (banane en plus).",
  },
];

// Récupération
export const recoveryChecklist = [
  { id: "froid", label: "Douche froide 2 min", done: true },
  { id: "etirements", label: "Étirements doux 10 min", done: true },
  { id: "mobilite", label: "Mobilité hanches 5 min", done: true },
  { id: "magnesium", label: "Magnésium soir", done: false },
  { id: "ecran", label: "Coupure écrans 30 min avant lit", done: false },
  { id: "lit", label: "Au lit avant 23h", done: false },
];

export const mobilityRoutine = [
  { zone: "Hanches", exo: "90/90 hip switch", duree: "2×8/côté" },
  { zone: "Hanches", exo: "Couch stretch", duree: "2×45s/côté" },
  { zone: "Ischios", exo: "Étirement actif jambe tendue", duree: "2×30s" },
  { zone: "Pieds", exo: "Toe yoga + short foot", duree: "2×10" },
  { zone: "Dos", exo: "Cat-cow + T-spine rotation", duree: "2×8" },
];

// Préparation pré-saison — phases jusqu'au 22/07
export type PrepPhase = {
  id: string;
  semaine: string;
  titre: string;
  focus: string;
  charge: "Modérée" | "Élevée" | "Très élevée" | "Décharge";
  contenu: string[];
};

export const preparationPlan: PrepPhase[] = [
  {
    id: "p-1",
    semaine: "S −5 (17–23 juin)",
    titre: "Phase 1 — Réathlétisation",
    focus: "Mobilité, base de force, tolérance impact",
    charge: "Modérée",
    contenu: [
      "3× Force générale (squat, RDL, bench, tractions)",
      "2× Mobilité hanches + pieds",
      "1× Conditioning aérobie continu (35 min Z2)",
      "Prévention ischio quotidienne (iso 30s + Nordic léger)",
    ],
  },
  {
    id: "p-2",
    semaine: "S −4 (24–30 juin)",
    titre: "Phase 2 — Force max & accélération",
    focus: "Force maximale, sorties de starts 10 m",
    charge: "Élevée",
    contenu: [
      "3× Force lourde (back squat 5×3, bench 5×3, trap bar DL)",
      "2× Vitesse — accélérations 10 m × 6–8",
      "1× Conditioning intervalles (4×3' Z4)",
      "Nordic curls 2×6 + Copenhagen 2×8",
    ],
  },
  {
    id: "p-3",
    semaine: "S −3 (1–7 juillet)",
    titre: "Phase 3 — Puissance & vitesse max",
    focus: "Pliométrie, sprint 20–40 m, agilité",
    charge: "Très élevée",
    contenu: [
      "2× Force-vitesse (cleans / jump squat / push-press)",
      "2× Sprint 20–40 m + changements d'appuis (T-test, 5-10-5)",
      "1× Conditioning rugby (répétitions d'efforts 6×40 m)",
      "1× Mobilité longue + récupération active",
    ],
  },
  {
    id: "p-4",
    semaine: "S −2 (8–14 juillet)",
    titre: "Phase 4 — Spécifique rugby",
    focus: "Profil rugby : contact, jeu réduit, conditioning intermittent",
    charge: "Très élevée",
    contenu: [
      "2× Jeux réduits / passes sous fatigue",
      "1× Force d'entretien (3×5 lourd)",
      "2× Sprint répétés (RSA 10×30 m / 25s)",
      "Mobilité quotidienne + protocole sommeil strict",
    ],
  },
  {
    id: "p-5",
    semaine: "S −1 (15–21 juillet)",
    titre: "Phase 5 — Décharge & affûtage",
    focus: "Maintenir vivacité, baisser volume, fraîcheur",
    charge: "Décharge",
    contenu: [
      "1× Force d'activation légère (3×3 explosif)",
      "1× Sprint courts qualité (4×10 m + 3×20 m)",
      "2× Mobilité + récupération (sauna, marche)",
      "Sommeil ≥ 8h, hydratation, repas glycogène J−1",
    ],
  },
  {
    id: "p-6",
    semaine: "22 juillet",
    titre: "Jour J — Reprise",
    focus: "Arriver frais, mobile et confiant",
    charge: "Modérée",
    contenu: [
      "Petit-déj riche en glucides 3h avant",
      "Échauffement long (15 min) + mobilité hanches",
      "Hydratation 500 ml + électrolytes",
      "Visualisation 5 min",
    ],
  },
];

// Objectif hebdo
export const weeklyObjective = {
  titre: "Verrouiller la base postérieure",
  detail: "3 séances de force MI + Nordic curls 2× cette semaine",
  progression: 60, // %
  cible_seances: 5,
  seances_faites: 3,
};

export const seasonStart = new Date("2026-07-22");
export function daysUntil(date: Date, now: Date = new Date()): number {
  const ms = date.getTime() - new Date(now).setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil(ms / 86400000));
}

export const TOTAL_PREP_DAYS = 35; // 17/06 → 22/07
