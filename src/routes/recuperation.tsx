import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Sparkles, Utensils } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { recoveryChecklist } from "@/lib/mock-data";

export const Route = createFileRoute("/recuperation")({
  head: () => ({ meta: [{ title: "Récupération — Rugby Coach" }] }),
  component: Recup,
});

function Recup() {
  const [list, setList] = useState(recoveryChecklist);
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

      <section className="card-elevated mb-4 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Check-list du soir
        </div>
        <ul className="mt-3 space-y-2">
          {list.map((item) => (
            <li key={item.id}>
              <button
                onClick={() =>
                  setList((l) =>
                    l.map((x) => (x.id === item.id ? { ...x, done: !x.done } : x)),
                  )
                }
                className="flex w-full items-center gap-3 rounded-xl bg-graphite-2/60 p-3 text-left"
              >
                <span
                  className={
                    "grid h-5 w-5 shrink-0 place-items-center rounded-md border " +
                    (item.done
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border")
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
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Moon className="h-3.5 w-3.5" /> Protocole sommeil
        </div>
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
            <p className="text-xs text-muted-foreground">Suivre protéines, hydratation, suppléments</p>
          </div>
        </div>
        <span className="text-primary">→</span>
      </Link>
    </AppShell>
  );
}
