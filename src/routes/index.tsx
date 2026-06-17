import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Flame,
  Moon,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Utensils,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { RingScore } from "@/components/ring-score";
import {
  daysUntil,
  injuryHistory,
  profile,
  seasonStart,
  todaySession,
  weeklyObjective,
  TOTAL_PREP_DAYS,
} from "@/lib/mock-data";
import { getTodayCheckin } from "@/lib/checkin.functions";
import { computeReadiness, computeRecovery, maxPain, PAIN_ALERT_THRESHOLD } from "@/lib/scores";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rugby Performance Coach" },
      {
        name: "description",
        content:
          "Coach IA personnel — préparation rugby, récupération, prévention blessures.",
      },
    ],
  }),
  loader: async () => {
    const checkin = await getTodayCheckin();
    return { checkin };
  },
  component: Dashboard,
});

function Dashboard() {
  const { checkin } = Route.useLoaderData();

  // Évite l'erreur d'hydratation : on calcule les jours côté client uniquement.
  const [jours, setJours] = useState<number | null>(null);
  useEffect(() => setJours(daysUntil(seasonStart)), []);
  const progression =
    jours == null
      ? 0
      : Math.max(0, Math.min(100, ((TOTAL_PREP_DAYS - jours) / TOTAL_PREP_DAYS) * 100));

  const readiness = checkin ? computeReadiness(checkin) : null;
  const recovery = checkin ? computeRecovery(checkin) : null;
  const painMax = checkin ? maxPain(checkin) : 0;
  const recurrents = injuryHistory.filter((i) => i.statut === "Récurrent").length;

  return (
    <AppShell>
      <header className="mb-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Bonjour, {profile.prenom}
          </p>
          <h1 className="text-3xl font-black leading-tight">État du jour</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.poste_principal} · {profile.niveau}
          </p>
        </div>
        <Link
          to="/profil"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-graphite-2 text-foreground"
          aria-label="Profil"
        >
          <User className="h-5 w-5" />
        </Link>
      </header>

      {/* Scores */}
      {checkin ? (
        <section className="card-elevated mb-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <RingScore value={readiness ?? 0} label="Readiness" sub="/ 100" />
            <RingScore value={recovery ?? 0} label="Récupération" sub="/ 100" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat icon={Moon} label="Sommeil" value={`${checkin.sommeil_h.toFixed(1)}h`} />
            <Stat icon={Flame} label="Énergie" value={`${checkin.energie}/10`} />
            <Stat icon={Zap} label="Charge sem." value="3 800" />
          </div>
        </section>
      ) : (
        <Link
          to="/check-in"
          className="card-elevated mb-4 flex items-center justify-between gap-3 p-5 ring-glow"
        >
          <div>
            <p className="text-sm font-semibold">Check-in du jour à faire</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Readiness et récupération s'affichent une fois rempli · moins de 60s
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
        </Link>
      )}

      {/* État blessure */}
      {checkin && (
        <Link
          to="/blessures"
          className={
            "card-elevated mb-4 flex items-center justify-between gap-3 p-4 " +
            (painMax >= PAIN_ALERT_THRESHOLD ? "border-primary/40 ring-glow" : "")
          }
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl " +
                (painMax >= PAIN_ALERT_THRESHOLD ? "bg-primary/15 text-primary" : "bg-chart-5/15 text-chart-5")
              }
            >
              {painMax >= PAIN_ALERT_THRESHOLD ? <AlertTriangle className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {painMax >= PAIN_ALERT_THRESHOLD ? "Alerte douleur" : "Aucune alerte active"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {painMax >= PAIN_ALERT_THRESHOLD
                  ? `Douleur ${painMax}/10 · adaptation séance recommandée`
                  : `${recurrents} antécédents récurrents sous surveillance`}
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>
      )}

      {/* Séance du jour */}
      <Link to="/seance/$id" params={{ id: todaySession.id }} className="card-elevated mb-4 block p-5">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <span>Séance du jour</span>
          <span className="text-muted-foreground">
            {todaySession.duree_min} min · RPE {todaySession.rpe_cible}
          </span>
        </div>
        <h2 className="mt-2 text-xl font-black leading-tight">{todaySession.titre}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{todaySession.objectif}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="rounded-full bg-graphite-2 px-3 py-1 text-xs font-semibold">
            {todaySession.type}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Démarrer <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      {/* Objectif hebdo */}
      <section className="card-elevated mb-4 p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <Target className="h-3.5 w-3.5" /> Objectif de la semaine
        </div>
        <p className="mt-2 font-display text-base font-bold leading-tight">{weeklyObjective.titre}</p>
        <p className="text-xs text-muted-foreground">{weeklyObjective.detail}</p>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {weeklyObjective.seances_faites} / {weeklyObjective.cible_seances} séances
          </span>
          <span className="font-semibold text-primary">{weeklyObjective.progression} %</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-graphite-2">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-blood-glow" style={{ width: `${weeklyObjective.progression}%` }} />
        </div>
      </section>

      {/* Objectif reprise */}
      <Link to="/preparation" className="card-elevated mb-4 block p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
          <CalendarCheck className="h-3.5 w-3.5" /> Préparation pré-saison
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="font-display text-3xl font-black">
              {jours == null ? "—" : `J − ${jours}`}
            </p>
            <p className="text-xs text-muted-foreground">Reprise le 22 juillet</p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            {Math.round(progression)} %
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-graphite-2">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-blood-glow" style={{ width: `${progression}%` }} />
        </div>
      </Link>

      {/* Quick actions */}
      <section className="mb-2">
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Actions rapides
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Quick to="/check-in" icon={ClipboardList} label="Check-in du jour" hint="< 60 s" />
          <Quick to="/preparation" icon={Target} label="Roadmap 22/07" hint="6 phases" />
          <Quick to="/recuperation" icon={Sparkles} label="Routine récup" hint="Soir" />
          <Quick to="/nutrition" icon={Utensils} label="Nutrition" hint="Photo IA" />
        </div>
      </section>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Moon;
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

function Quick({
  to,
  icon: Icon,
  label,
  hint,
}: {
  to: string;
  icon: typeof Moon;
  label: string;
  hint: string;
}) {
  return (
    <Link to={to} className="card-elevated flex flex-col gap-2 p-4 transition active:scale-[0.98]">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-sm font-semibold leading-tight">{label}</p>
      <p className="text-[11px] text-muted-foreground">{hint}</p>
    </Link>
  );
}
