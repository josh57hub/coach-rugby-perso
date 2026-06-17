import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app-shell";
import { getTodayCheckin, upsertCheckin } from "@/lib/checkin.functions";

export const Route = createFileRoute("/check-in")({
  head: () => ({ meta: [{ title: "Check-in — Rugby Coach" }] }),
  // Le check-in du jour (s'il existe déjà) est chargé côté serveur avant le
  // premier rendu — pas de flash "tout à zéro" si l'utilisateur revient
  // ajuster son check-in plus tard dans la journée.
  loader: async () => {
    const existing = await getTodayCheckin();
    return { existing };
  },
  component: CheckIn,
});

type FieldKey =
  | "sommeil_h"
  | "qualite_sommeil"
  | "energie"
  | "fatigue"
  | "stress"
  | "motivation"
  | "douleur_ischio"
  | "douleur_hanche"
  | "douleur_pied"
  | "douleur_genou"
  | "poids_kg";

type Field = { key: FieldKey; label: string; min: number; max: number; suffix?: string };

const fields: Field[] = [
  { key: "sommeil_h", label: "Durée de sommeil", min: 0, max: 12, suffix: "h" },
  { key: "qualite_sommeil", label: "Qualité du sommeil", min: 0, max: 10 },
  { key: "energie", label: "Énergie", min: 0, max: 10 },
  { key: "fatigue", label: "Fatigue", min: 0, max: 10 },
  { key: "stress", label: "Stress", min: 0, max: 10 },
  { key: "motivation", label: "Motivation", min: 0, max: 10 },
  { key: "douleur_ischio", label: "Douleur ischio droit", min: 0, max: 10 },
  { key: "douleur_hanche", label: "Douleur hanche", min: 0, max: 10 },
  { key: "douleur_pied", label: "Douleur pied", min: 0, max: 10 },
  { key: "douleur_genou", label: "Douleur genou gauche", min: 0, max: 10 },
  { key: "poids_kg", label: "Poids", min: 60, max: 110, suffix: "kg" },
];

// Valeurs neutres par défaut si aucun check-in n'existe encore pour aujourd'hui.
const DEFAULTS: Record<FieldKey, number> = {
  sommeil_h: 7,
  qualite_sommeil: 7,
  energie: 7,
  fatigue: 4,
  stress: 4,
  motivation: 7,
  douleur_ischio: 0,
  douleur_hanche: 0,
  douleur_pied: 0,
  douleur_genou: 0,
  poids_kg: 84,
};

function CheckIn() {
  const nav = useNavigate();
  const { existing } = Route.useLoaderData();
  const submitCheckin = useServerFn(upsertCheckin);

  const [values, setValues] = useState<Record<FieldKey, number>>(() => {
    if (!existing) return DEFAULTS;
    return {
      sommeil_h: existing.sommeil_h,
      qualite_sommeil: existing.qualite_sommeil,
      energie: existing.energie,
      fatigue: existing.fatigue,
      stress: existing.stress,
      motivation: existing.motivation,
      douleur_ischio: existing.douleur_ischio,
      douleur_hanche: existing.douleur_hanche,
      douleur_pied: existing.douleur_pied,
      douleur_genou: existing.douleur_genou,
      poids_kg: existing.poids_kg ?? DEFAULTS.poids_kg,
    };
  });
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      await submitCheckin({
        data: {
          date: today,
          ...values,
          notes: notes || undefined,
        },
      });
      toast.success("Check-in enregistré", { description: "Recommandations mises à jour." });
      nav({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow={existing ? "Déjà rempli aujourd'hui · modifiable" : "< 60 secondes"}
        title="Check-in du jour"
      />
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.key} className="card-elevated p-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">{f.label}</label>
              <span className="font-display text-lg font-black tabular-nums">
                {Number(values[f.key]).toFixed(f.key === "sommeil_h" || f.key === "poids_kg" ? 1 : 0)}
                {f.suffix ? ` ${f.suffix}` : ""}
              </span>
            </div>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.key === "sommeil_h" ? 0.25 : f.key === "poids_kg" ? 0.1 : 1}
              value={values[f.key]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [f.key]: Number(e.target.value) }))
              }
              className="mt-3 h-2 w-full appearance-none rounded-full bg-graphite-2 accent-primary"
            />
          </div>
        ))}

        <div className="card-elevated p-4">
          <label className="text-sm font-semibold">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Sensations, contexte, sommeil…"
            className="mt-2 w-full resize-none rounded-lg border border-border bg-background/60 p-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          onClick={submit}
          disabled={saving}
          className="sticky bottom-24 mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-display text-base font-bold uppercase tracking-wider text-primary-foreground shadow-[0_10px_30px_-10px_var(--blood-glow)] active:scale-[0.99] disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {existing ? "Mettre à jour le check-in" : "Valider le check-in"}
        </button>
      </div>
    </AppShell>
  );
}
