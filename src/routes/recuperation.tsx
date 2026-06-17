import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sparkles, Utensils, Activity, Heart } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { recoveryChecklist, recoveryToday, mobilityRoutine, lastCheckin } from "@/lib/mock-data";

export const Route = createFileRoute("/recuperation")({
  head: () => ({ meta: [{ title: "Récupération — Rugby Coach" }] }),
  component: Recup,
});

function Recup() {
  const [list, setList] = useState(recoveryChecklist);
  const done = list.filter((l) => l.done).length;
  const sleep = [
    "Dîner léger 2h avant le coucher",
    "Coupure écrans 30 min avant",
    "Chambre 18°C · totalement sombre",
    "Magnésium · respiration 4-7-8",
    "Heure de coucher cible : 22h30",
  ];

  return (
    <AppShell>
      <PageHeader eyebrow="Routine quotidienne" title="Récupération" />

      <section className="card-elevated mb-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Heart className="h-3.5 w-3.5" /> Score de récupération
            </p>
            <p className="mt-1 font-display text-4xl font-black tabular-nums">{recoveryToday}<span className="text-base text-muted-foreground">/100</span></p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>Sommeil : <span className="text-foreground font-semibold">{lastCheckin.sommeil_h.toFixed(1)}h</span></p>
            <p>Qualité : <span className="text-foreground font-semibold">{lastCheckin.qualite_sommeil}/10</span></p>
            <p>Fatigue : <span className="text-foreground font-semibold">{lastCheckin.fatigue}/10</span></p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-graphite-2">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-blood-glow" style={{ width: `${recoveryToday}%` }} />
        </div>
      </section>

      <section className="card-elevated mb-4 p-4">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Check-list du soir
          </p>
          <span className="text-xs font-semibold text-muted-foreground">{done}/{list.length}</span>
        </div>
        <ul className="mt-3 space-y-2">
          {list.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setList((l) => l.map((x) => (x.id === item.id ? { ...x, done: !x.done } : x)))}
                className="flex w-full items-center gap-3 rounded-xl bg-graphite-2/60 p-3 text-left"
              >
                <span
                  className={
                    "grid h-5 w-5 shrink-0 place-items-center rounded-md border " +
                    (item.done ? "border-primary bg-primary text-primary-foreground" : "border-border")
                  }
                >
                  {item.done && "✓"}
                </span>
                <span className={"text-sm " + (item.done ? "line-through text-muted-foreground" : "")}>
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-elevated mb-4 p-4">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Activity className="h-3.5 w-3.5" /> Mobilité & étirements
        </p>
        <ul className="mt-3 divide-y divide-border">
          {mobilityRoutine.map((m) => (
            <li key={m.exo} className="flex items-center justify-between py-2.5 text-sm">
              <div>
                <p className="font-semibold">{m.exo}</p>
                <p className="text-xs text-muted-foreground">{m.zone}</p>
              </div>
              <span className="font-display text-xs font-bold tabular-nums text-primary">{m.duree}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-elevated mb-4 p-4">
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Moon className="h-3.5 w-3.5" /> Protocole sommeil
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {sleep.map((s) => (
            <li key={s} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {s}
            </li>
          ))}
        </ul>
      </section>

      <Link to="/nutrition" className="card-elevated flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
            <Utensils className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Nutrition & supplémentation</p>
            <p className="text-xs text-muted-foreground">Protéines, hydratation, créatine, magnésium…</p>
          </div>
        </div>
        <span className="text-primary">→</span>
      </Link>
    </AppShell>
  );
}
