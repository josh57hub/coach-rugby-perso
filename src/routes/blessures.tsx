import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ShieldCheck, History } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { checkins, injuryHistory, lastCheckin } from "@/lib/mock-data";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const Route = createFileRoute("/blessures")({
  head: () => ({ meta: [{ title: "Blessures — Rugby Coach" }] }),
  component: Blessures,
});

const zones = [
  { key: "Ischio", color: "var(--chart-1)" },
  { key: "Hanche", color: "var(--chart-4)" },
  { key: "Pied", color: "var(--chart-2)" },
  { key: "Genou", color: "var(--chart-5)" },
] as const;

function recommendations() {
  const r: { zone: string; texte: string; alerte: boolean }[] = [];
  if (lastCheckin.douleur_ischio >= 3)
    r.push({
      zone: "Ischio droit",
      texte: "Volume sprint réduit · pas de soulevé de terre lourd · iso 45° avant toute course",
      alerte: true,
    });
  if (lastCheckin.douleur_pied >= 3)
    r.push({
      zone: "Pied / voûte plantaire",
      texte: "Réduire impacts · vélo/rameur en alternative · short foot 2× jour",
      alerte: true,
    });
  if (lastCheckin.douleur_hanche >= 3)
    r.push({
      zone: "Hanche",
      texte: "Mobilité 90/90 + couch stretch · éviter squat profond charge max",
      alerte: true,
    });
  if (lastCheckin.douleur_genou >= 3)
    r.push({
      zone: "Genou gauche (LLI)",
      texte: "Stabilité monopodale · pas de pivots brusques · renfo glute med",
      alerte: true,
    });
  if (r.length === 0)
    r.push({ zone: "État général", texte: "Aucune alerte — poursuivre le plan en cours.", alerte: false });
  return r;
}

function statusColor(s: string) {
  if (s === "Récurrent") return "bg-primary/20 text-primary";
  if (s === "Surveillance") return "bg-chart-4/20 text-chart-4";
  return "bg-graphite-2 text-muted-foreground";
}

function Blessures() {
  const data = checkins.map((c) => ({
    date: c.date.slice(5),
    Ischio: c.douleur_ischio,
    Hanche: c.douleur_hanche,
    Pied: c.douleur_pied,
    Genou: c.douleur_genou,
  }));

  return (
    <AppShell>
      <PageHeader eyebrow="Suivi & antécédents" title="Blessures" />

      <section className="card-elevated mb-4 p-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Évolution des douleurs · 14 jours
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  background: "var(--graphite-2)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              />
              {zones.map((z) => (
                <Line key={z.key} type="monotone" dataKey={z.key} stroke={z.color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Recommandations automatiques
        </h3>
        <ul className="space-y-2">
          {recommendations().map((r, i) => (
            <li key={i} className="card-elevated flex items-start gap-3 p-4">
              <div
                className={
                  "grid h-9 w-9 shrink-0 place-items-center rounded-xl " +
                  (r.alerte ? "bg-primary/15 text-primary" : "bg-chart-5/15 text-chart-5")
                }
              >
                {r.alerte ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{r.zone}</p>
                <p className="text-xs text-muted-foreground">{r.texte}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <History className="h-3.5 w-3.5" /> Historique des blessures
        </h3>
        <ul className="space-y-2">
          {injuryHistory.map((h) => (
            <li key={h.id} className="card-elevated p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {h.zone}
                    {h.cote && <span className="text-muted-foreground"> · {h.cote}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{h.type}</p>
                </div>
                <span className={"shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider " + statusColor(h.statut)}>
                  {h.statut}
                </span>
              </div>
              <p className="mt-3 text-xs">
                <span className="font-semibold text-foreground">Impact : </span>
                <span className="text-muted-foreground">{h.impact}</span>
              </p>
              <p className="mt-1 text-xs">
                <span className="font-semibold text-primary">Stratégie : </span>
                <span className="text-muted-foreground">{h.strategie}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
