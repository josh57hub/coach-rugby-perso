import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ShieldCheck } from "lucide-react";
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
  { key: "douleur_ischio", label: "Ischio droit", color: "var(--chart-1)" },
  { key: "douleur_hanche", label: "Hanche", color: "var(--chart-4)" },
  { key: "douleur_pied", label: "Pied", color: "var(--chart-2)" },
  { key: "douleur_genou", label: "Genou gauche", color: "var(--chart-5)" },
] as const;

function recommendations() {
  const r: { zone: string; texte: string; alerte: boolean }[] = [];
  if (lastCheckin.douleur_ischio >= 3)
    r.push({
      zone: "Ischio",
      texte: "Volume sprint réduit · pas de soulevé de terre lourd · iso 45°",
      alerte: true,
    });
  if (lastCheckin.douleur_pied >= 3)
    r.push({
      zone: "Pied",
      texte: "Réduire impacts · vélo / rameur en alternative · short foot 2× jour",
      alerte: true,
    });
  if (lastCheckin.douleur_hanche >= 3)
    r.push({
      zone: "Hanche",
      texte: "Mobilité 90/90 et couch stretch · éviter squat profond charge max",
      alerte: true,
    });
  if (r.length === 0)
    r.push({ zone: "Global", texte: "Aucune alerte — poursuivre le plan en cours.", alerte: false });
  return r;
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
      <PageHeader eyebrow="Suivi blessures" title="Douleurs & adaptation" />

      <section className="card-elevated mb-4 p-4">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          Évolution 14 jours
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
                <Line
                  key={z.key}
                  type="monotone"
                  dataKey={z.label.split(" ")[0]}
                  stroke={z.color}
                  strokeWidth={2}
                  dot={false}
                />
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
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Antécédents
        </h3>
        <ul className="space-y-2">
          {injuryHistory.map((h, i) => (
            <li key={i} className="card-elevated p-4">
              <p className="text-sm font-semibold">{h.zone}</p>
              <p className="text-xs text-muted-foreground">{h.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
