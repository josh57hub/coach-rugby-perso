import { createFileRoute, Link } from "@tanstack/react-router";
import { Droplets, Beef, Pill, Camera, ArrowRight, Wheat, Nut } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { nutritionToday, supplements } from "@/lib/mock-data";

export const Route = createFileRoute("/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition — Rugby Coach" }] }),
  component: Nutrition,
});

function Bar({
  label,
  value,
  target,
  unit,
  icon: Icon,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  icon: typeof Beef;
}) {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div className="card-elevated p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{label}</span>
        </div>
        <span className="font-display text-sm font-bold tabular-nums">
          {value} <span className="text-muted-foreground">/ {target} {unit}</span>
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-graphite-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-blood-glow"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Nutrition() {
  return (
    <AppShell>
      <PageHeader eyebrow="Aujourd'hui" title="Nutrition & supplémentation" />

      <Link
        to="/nutrition/photo"
        className="card-elevated mb-4 flex items-center justify-between border-primary/40 p-4 ring-glow"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Analyse photo IA</p>
            <p className="text-xs text-muted-foreground">Calories & macros depuis une photo de ton assiette</p>
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <div className="space-y-3">
        <Bar label="Protéines" value={nutritionToday.proteines_g} target={nutritionToday.proteines_cible_g} unit="g" icon={Beef} />
        <Bar label="Glucides" value={nutritionToday.glucides_g} target={nutritionToday.glucides_cible_g} unit="g" icon={Wheat} />
        <Bar label="Lipides" value={nutritionToday.lipides_g} target={nutritionToday.lipides_cible_g} unit="g" icon={Nut} />
        <Bar label="Hydratation" value={nutritionToday.hydratation_l} target={nutritionToday.hydratation_cible_l} unit="L" icon={Droplets} />
      </div>

      <h3 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Supplémentation du jour
      </h3>
      <ul className="space-y-2">
        {supplements.map((s) => (
          <li
            key={s.id}
            className={
              "card-elevated flex items-center justify-between p-4 " +
              (s.pris ? "border-primary/40" : "")
            }
          >
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl " +
                  (s.pris ? "bg-primary/15 text-primary" : "bg-graphite-2 text-muted-foreground")
                }
              >
                <Pill className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{s.label}</p>
                <p className="truncate text-xs text-muted-foreground">{s.dose} · {s.moment}</p>
              </div>
            </div>
            <span className={"text-xs font-semibold " + (s.pris ? "text-primary" : "text-muted-foreground")}>
              {s.pris ? "✓ Pris" : "À prendre"}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Repères du jour
      </h3>
      <ul className="card-elevated divide-y divide-border p-2 text-sm">
        <li className="flex items-center gap-2 p-3"><Pill className="h-4 w-4 text-primary" /> 30 g de protéines après séance</li>
        <li className="flex items-center gap-2 p-3"><Pill className="h-4 w-4 text-primary" /> 500 ml d'eau dès le réveil</li>
        <li className="flex items-center gap-2 p-3"><Pill className="h-4 w-4 text-primary" /> Glucides lents au dîner pour la récup</li>
        <li className="flex items-center gap-2 p-3"><Pill className="h-4 w-4 text-primary" /> Poisson gras 2× par semaine (oméga 3)</li>
      </ul>
    </AppShell>
  );
}
