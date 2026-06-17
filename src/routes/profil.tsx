import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Target, Trophy, Ruler, Weight, MapPin, Calendar, ArrowRight, Activity, LogOut } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { profile, injuryHistory } from "@/lib/mock-data";
import { signOut } from "@/lib/auth.functions";

export const Route = createFileRoute("/profil")({
  head: () => ({ meta: [{ title: "Profil athlète — Rugby Coach" }] }),
  component: Profil,
});

function Profil() {
  const nav = useNavigate();
  const doSignOut = useServerFn(signOut);

  const logout = async () => {
    await doSignOut();
    nav({ to: "/login" });
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Athlète" title="Profil de performance" />

      <section className="card-elevated mb-4 p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary text-2xl font-black">
            {profile.prenom.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="font-display text-xl font-black">{profile.prenom}</p>
            <p className="text-xs text-muted-foreground">{profile.sport} · {profile.niveau}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Metric icon={Ruler} label="Taille" value={`${profile.taille_cm} cm`} />
          <Metric icon={Weight} label="Poids" value={`${profile.poids_kg} kg`} />
          <Metric icon={Activity} label="IMC" value={(profile.poids_kg / (profile.taille_cm / 100) ** 2).toFixed(1)} />
        </div>
      </section>

      <section className="card-elevated mb-4 p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <MapPin className="h-3.5 w-3.5" /> Postes
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {profile.postes.map((p, i) => (
            <li
              key={p}
              className={
                "rounded-full px-3 py-1.5 text-xs font-semibold " +
                (i === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-graphite-2 text-foreground")
              }
            >
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="card-elevated mb-4 p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Calendar className="h-3.5 w-3.5" /> Objectif court terme
        </div>
        <p className="mt-2 text-sm">{profile.objectif_court}</p>
      </section>

      <section className="card-elevated mb-4 p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Trophy className="h-3.5 w-3.5" /> Objectifs long terme
        </div>
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {profile.objectifs_long.map((o) => (
            <li
              key={o}
              className="flex items-center gap-2 rounded-xl bg-graphite-2/60 px-3 py-2 text-xs font-semibold"
            >
              <Target className="h-3.5 w-3.5 text-primary" />
              {o}
            </li>
          ))}
        </ul>
      </section>

      <Link to="/blessures" className="card-elevated flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-semibold">Historique des blessures</p>
          <p className="text-xs text-muted-foreground">
            {injuryHistory.length} antécédents suivis · stratégies de prévention
          </p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <button
        onClick={logout}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-graphite-2/60 py-3.5 text-sm font-semibold text-muted-foreground active:scale-[0.99]"
      >
        <LogOut className="h-4 w-4" /> Se déconnecter
      </button>
    </AppShell>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Ruler;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-graphite-2/60 px-2 py-3">
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <p className="mt-1 font-display text-base font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
