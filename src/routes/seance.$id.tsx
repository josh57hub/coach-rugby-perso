import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock3, Dumbbell, Gauge } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { sessions } from "@/lib/mock-data";

export const Route = createFileRoute("/seance/$id")({
  head: ({ params }) => ({ meta: [{ title: `Séance ${params.id} — Rugby Coach` }] }),
  loader: ({ params }) => {
    const s = sessions.find((x) => x.id === params.id);
    if (!s) throw notFound();
    return s;
  },
  component: SessionPage,
  notFoundComponent: () => (
    <AppShell>
      <p className="text-sm text-muted-foreground">Séance introuvable.</p>
    </AppShell>
  ),
});

function Block({ title, items }: { title: string; items: string[] }) {
  if (!items?.length) return null;
  return (
    <section className="card-elevated mb-3 p-4">
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((x, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{x}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SessionPage() {
  const s = Route.useLoaderData();
  return (
    <AppShell>
      <Link
        to="/calendrier"
        className="mb-3 inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Calendrier
      </Link>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
        {s.type}
      </p>
      <h1 className="mt-1 text-2xl font-black leading-tight">{s.titre}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{s.objectif}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <Pill icon={Clock3} value={`${s.duree_min} min`} label="Durée" />
        <Pill icon={Gauge} value={`RPE ${s.rpe_cible}`} label="Intensité" />
        <Pill icon={Dumbbell} value={`${s.equipement.length} items`} label="Matériel" />
      </div>

      <div className="mt-5">
        <Block title="Échauffement" items={s.echauffement} />
        <Block title="Travail principal" items={s.travail_principal} />
        <Block title="Accessoire" items={s.accessoire} />
        <Block title="Mobilité" items={s.mobilite} />
        <Block title="Prévention" items={s.prevention} />
        <Block title="Récupération" items={s.recuperation} />
        {s.alternatives && <Block title="Alternatives" items={s.alternatives} />}
      </div>

      <button className="sticky bottom-24 mt-2 w-full rounded-2xl bg-primary py-4 font-display text-base font-bold uppercase tracking-wider text-primary-foreground shadow-[0_10px_30px_-10px_var(--blood-glow)]">
        Démarrer la séance
      </button>
    </AppShell>
  );
}

function Pill({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Clock3;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-graphite-2/60 px-2 py-3">
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <p className="mt-1 font-display text-sm font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
