// Calcul des scores readiness / recovery à partir d'un check-in quotidien.
// Formules reprises et conservées depuis src/lib/mock-data.ts (V1) pour ne
// pas casser la cohérence des scores déjà affichés à l'utilisateur — seule
// la source de données change (Supabase au lieu d'un tableau statique).

export type CheckinScoreInput = {
  sommeil_h: number;
  qualite_sommeil: number;
  energie: number;
  fatigue: number;
  stress: number;
  douleur_ischio: number;
  douleur_hanche: number;
  douleur_pied: number;
  douleur_genou: number;
};

export function computeReadiness(c: CheckinScoreInput): number {
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

export function computeRecovery(c: CheckinScoreInput): number {
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

// Seuil au-delà duquel une douleur déclenche une alerte visible sur le
// dashboard et la page blessures (cohérent avec le seuil déjà utilisé en V1).
export const PAIN_ALERT_THRESHOLD = 3;

export function maxPain(c: CheckinScoreInput): number {
  return Math.max(c.douleur_ischio, c.douleur_hanche, c.douleur_pied, c.douleur_genou);
}
