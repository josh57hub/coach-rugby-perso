import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app-shell";
import { lastCheckin } from "@/lib/mock-data";

export const Route = createFileRoute("/check-in")({
  head: () => ({ meta: [{ title: "Check-in — Rugby Coach" }] }),
  component: CheckIn,
});

type Field = { key: string; label: string; min: number; max: number; suffix?: string };

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

function CheckIn() {
  const nav = useNavigate();
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, (lastCheckin as never)[f.key] ?? 0])),
  );
  const [notes, setNotes] = useState("");

  const submit = () => {
    toast.success("Check-in enregistré", { description: "Recommandations mises à jour." });
    nav({ to: "/" });
  };

  return (
    <AppShell>
      <PageHeader eyebrow="< 60 secondes" title="Check-in du jour" />
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
          className="sticky bottom-24 mt-4 w-full rounded-2xl bg-primary py-4 font-display text-base font-bold uppercase tracking-wider text-primary-foreground shadow-[0_10px_30px_-10px_var(--blood-glow)] active:scale-[0.99]"
        >
          Valider le check-in
        </button>
      </div>
    </AppShell>
  );
}
