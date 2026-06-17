import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app-shell";
import { checkins } from "@/lib/mock-data";

export const Route = createFileRoute("/analytique")({
  head: () => ({ meta: [{ title: "Statistiques — Rugby Coach" }] }),
  component: Analytics,
});

function ChartCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card-elevated mb-3 p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          {title}
        </h3>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

const tooltipStyle = {
  background: "var(--graphite-2)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
};

function Analytics() {
  const data = checkins.map((c) => ({
    d: c.date.slice(5),
    Poids: Number(c.poids_kg.toFixed(1)),
    Sommeil: Number(c.sommeil_h.toFixed(1)),
    Douleur:
      c.douleur_ischio + c.douleur_hanche + c.douleur_pied + c.douleur_genou,
    Recup: Math.round(((c.qualite_sommeil / 10) * 0.5 + (1 - c.fatigue / 10) * 0.5) * 100),
  }));
  const load = [3200, 3500, 2800, 3800, 4100, 3300, 3800];
  const loadData = load.map((v, i) => ({ d: `S${i + 1}`, charge: v }));

  return (
    <AppShell>
      <PageHeader eyebrow="14 derniers jours" title="Statistiques" />

      <ChartCard title="Poids" sub="kg">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <YAxis domain={["dataMin - 1", "dataMax + 1"]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="Poids" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Douleurs cumulées" sub="/40">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="Douleur" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.25} />
        </AreaChart>
      </ChartCard>

      <ChartCard title="Sommeil" sub="heures">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <YAxis domain={[4, 10]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="Sommeil" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.2} />
        </AreaChart>
      </ChartCard>

      <ChartCard title="Charge hebdomadaire" sub="UA">
        <BarChart data={loadData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="charge" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartCard>

      <ChartCard title="Récupération" sub="/100">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <XAxis dataKey="d" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="Recup" stroke="var(--chart-5)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartCard>

      <Link to="/blessures" className="card-elevated mt-2 block p-4 text-center text-sm font-semibold text-primary">
        Voir le suivi des blessures →
      </Link>
    </AppShell>
  );
}
