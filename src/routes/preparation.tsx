import { createFileRoute } from "@tanstack/react-router";
import { Flame, Target } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { preparationPlan, seasonStart, daysUntil, TOTAL_PREP_DAYS } from "@/lib/mock-data";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/preparation")({
  head: () => ({ meta: [{ title: "Préparation pré-saison — Rugby Coach" }] }),
  component: Preparation,
});

function Preparation() {
  const [jours, setJours] = useState<number | null>(null);
  useEffect(() => setJours(daysUntil(seasonStart)), []);
  const progression =
    jours == null ? 0 : Math.max(0, Math.min(100, ((TOTAL_PREP_DAYS - jours) / TOTAL_PREP_DAYS) * 100));

  return (
    <AppShell>
      <PageHeader eyebrow="Roadmap" title="Préparation 22 juillet" />

      <section className="card-elevated mb-4 p-5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Compte à rebours</p>
            <p className="font-display text-4xl font-black">
              {jours == null ? "—" : `J − ${jours}`}
            </p>
            <p className="text-xs text-muted-foreground">Reprise pré-saison</p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">{Math.round(progression)} %</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-graphite-2">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-blood-glow" style={{ width: `${progression}%` }} />
        </div>
      </section>

      <ol className="space-y-3">
        {preparationPlan.map((p, i) => (
          <li key={p.id} className="card-elevated p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{p.semaine}</p>
              <ChargeBadge charge={p.charge} />
            </div>
            <h3 className="mt-1 font-display text-lg font-black">{p.titre}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-primary" />
              {p.focus}
            </p>
            <ul className="mt-3 space-y-1.5">
              {p.contenu.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {c}
                </li>
              ))}
            </ul>
            {i < preparationPlan.length - 1 && (
              <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Flame className="h-3 w-3 text-primary" /> Transition vers la phase suivante
              </div>
            )}
          </li>
        ))}
      </ol>
    </AppShell>
  );
}

function ChargeBadge({ charge }: { charge: string }) {
  const map: Record<string, string> = {
    "Modérée": "bg-chart-2/20 text-chart-2",
    "Élevée": "bg-chart-4/20 text-chart-4",
    "Très élevée": "bg-primary/20 text-primary",
    "Décharge": "bg-chart-5/20 text-chart-5",
  };
  return (
    <span className={"rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider " + (map[charge] ?? "bg-graphite-2")}>
      {charge}
    </span>
  );
}
