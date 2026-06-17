import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Beef, Pill } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { nutritionToday } from "@/lib/mock-data";

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

function Supp({ label, taken }: { label: string; taken: boolean }) {
  return (
    <button
      className={
        "flex items-center justify-between rounded-xl border p-3 text-sm font-semibold " +
        (taken
          ? "border-primary/40 bg-primary/10 text-foreground"
          : "border-border bg-graphite-2 text-muted-foreground")
      }
    >
      <span>{label}</span>
      <span className="text-xs">{taken ? "✓ Pris" : "À prendre"}</span>
    </button>
  );
}

function Nutrition() {
  return (
    <AppShell>
      <PageHeader eyebrow="Aujourd'hui" title="Nutrition & supplémentation" />

      <div className="space-y-3">
        <Bar
          label="Protéines"
          value={nutritionToday.proteines_g}
          target={nutritionToday.proteines_cible_g}
          unit="g"
          icon={Beef}
        />
        <Bar
          label="Hydratation"
          value={nutritionToday.hydratation_l}
          target={nutritionToday.hydratation_cible_l}
          unit="L"
          icon={Droplets}
        />
      </div>

      <h3 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Supplémentation
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <Supp label="Créatine 5g" taken={nutritionToday.creatine} />
        <Supp label="Collagène 10g" taken={nutritionToday.collagene} />
        <Supp label="Magnésium" taken={nutritionToday.magnesium} />
        <Supp label="Oméga 3" taken={nutritionToday.omega3} />
      </div>

      <h3 className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Repères du jour
      </h3>
      <ul className="card-elevated divide-y divide-border p-2 text-sm">
        <li className="flex items-center gap-2 p-3"><Pill className="h-4 w-4 text-primary" /> 30 g de protéines après séance</li>
        <li className="flex items-center gap-2 p-3"><Pill className="h-4 w-4 text-primary" /> Boire 500 ml dès le réveil</li>
        <li className="flex items-center gap-2 p-3"><Pill className="h-4 w-4 text-primary" /> Glucides lents au dîner — récup</li>
      </ul>
    </AppShell>
  );
}
