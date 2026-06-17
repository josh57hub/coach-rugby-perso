import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { calendar, sessions } from "@/lib/mock-data";
import { ChevronRight, Home, Plane, Building2, Clock3 } from "lucide-react";

export const Route = createFileRoute("/calendrier")({
  head: () => ({ meta: [{ title: "Calendrier — Rugby Coach" }] }),
  component: Calendrier,
});

const typeColor: Record<string, string> = {
  "Force bas du corps": "text-chart-1",
  "Force haut du corps": "text-chart-1",
  "Vitesse / Accélération": "text-chart-4",
  Conditioning: "text-chart-4",
  Mobilité: "text-chart-2",
  "Mobilité hanches": "text-chart-2",
  Récupération: "text-chart-5",
  "Prévention ischio": "text-primary",
  Repos: "text-muted-foreground",
};

function Calendrier() {
  const [filter, setFilter] = useState<"Salle" | "Domicile" | "Vacances" | "Tous">("Tous");
  const data = calendar.slice(0, 30);

  return (
    <AppShell>
      <PageHeader eyebrow="Programmation" title="Vers le 22 juillet" />

      <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-2">
        {[
          { k: "Tous", icon: Clock3 },
          { k: "Salle", icon: Building2 },
          { k: "Domicile", icon: Home },
          { k: "Vacances", icon: Plane },
        ].map(({ k, icon: Icon }) => (
          <button
            key={k}
            onClick={() => setFilter(k as typeof filter)}
            className={
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold " +
              (filter === k
                ? "bg-primary text-primary-foreground"
                : "bg-graphite-2 text-muted-foreground")
            }
          >
            <Icon className="h-3.5 w-3.5" /> {k}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {data.map((e) => {
          const session = sessions.find((s) => s.type === e.type);
          const date = new Date(e.date);
          const day = date.toLocaleDateString("fr-FR", { weekday: "short" });
          const dnum = date.getDate();
          return (
            <li key={e.date}>
              <Link
                to={session ? "/seance/$id" : "/calendrier"}
                params={session ? { id: session.id } : undefined}
                className="card-elevated flex items-center gap-3 p-3"
              >
                <div className="grid w-12 shrink-0 place-items-center rounded-xl bg-graphite-2 py-2">
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {day}
                  </span>
                  <span className="font-display text-lg font-black leading-none">
                    {dnum}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className={"truncate text-xs font-semibold uppercase tracking-wider " + (typeColor[e.type] ?? "")}>
                    {e.type}
                  </p>
                  <p className="truncate text-sm font-semibold">{e.titre}</p>
                  {e.duree_min && (
                    <p className="text-[11px] text-muted-foreground">
                      {e.duree_min} min · {e.contexte}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ul>
    </AppShell>
  );
}
