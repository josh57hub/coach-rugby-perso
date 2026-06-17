import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "./supabase/server";

const CheckinInputSchema = z.object({
  date: z.string(), // format YYYY-MM-DD
  sommeil_h: z.number().min(0).max(14),
  qualite_sommeil: z.number().int().min(0).max(10),
  energie: z.number().int().min(0).max(10),
  fatigue: z.number().int().min(0).max(10),
  stress: z.number().int().min(0).max(10),
  motivation: z.number().int().min(0).max(10),
  douleur_ischio: z.number().int().min(0).max(10),
  douleur_hanche: z.number().int().min(0).max(10),
  douleur_pied: z.number().int().min(0).max(10),
  douleur_genou: z.number().int().min(0).max(10),
  poids_kg: z.number().min(40).max(180).optional(),
  notes: z.string().max(2000).optional(),
});

// Crée ou met à jour (upsert) le check-in du jour. Un seul check-in par
// utilisateur et par date — contrainte unique(user_id, date) en base.
// Permet de modifier le check-in du jour si l'utilisateur se reconnecte
// plus tard dans la journée pour l'ajuster.
export const upsertCheckin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CheckinInputSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw new Error("Non authentifié");

    const { data: row, error } = await supabase
      .from("daily_checkins")
      .upsert(
        { ...data, user_id: auth.user.id },
        { onConflict: "user_id,date" },
      )
      .select()
      .single();

    if (error) throw new Error(error.message);
    return row;
  });

// Récupère le check-in du jour pour l'utilisateur courant, ou null s'il
// n'existe pas encore (premier check-in de la journée).
export const getTodayCheckin = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Non authentifié");

  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", auth.user.id)
    .eq("date", today)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
});

// Récupère les N derniers check-ins (par défaut 14 jours), triés du plus
// ancien au plus récent — pratique pour alimenter directement les graphiques
// recharts (blessures.tsx, analytique.tsx) sans avoir à re-trier côté client.
export const getRecentCheckins = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ days: z.number().int().min(1).max(90).default(14) }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) throw new Error("Non authentifié");

    const { data: rows, error } = await supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", auth.user.id)
      .order("date", { ascending: false })
      .limit(data.days);

    if (error) throw new Error(error.message);
    return (rows ?? []).reverse();
  });
