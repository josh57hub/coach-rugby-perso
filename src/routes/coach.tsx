import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";

export const Route = createFileRoute("/coach")({
  head: () => ({ meta: [{ title: "Coach IA — Rugby Coach" }] }),
  component: Coach,
});

type Msg = { role: "user" | "coach"; text: string };

const suggestions = [
  "J'ai mal dormi cette nuit",
  "Douleur ischio droit aujourd'hui",
  "Je n'ai que 30 min",
  "Je suis en déplacement, sans salle",
  "Je suis en vacances cette semaine",
];

function reply(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("dorm") || t.includes("sommeil"))
    return "Compris. Aujourd'hui : on bascule sur une séance de mobilité + activation 30 min (RPE 4). On reporte la force MI à demain. Hydratation 3 L et sieste 20 min si possible.";
  if (t.includes("ischio") || t.includes("hamstring"))
    return "Protocole ischio : pas de sprint max, pas de SDT lourd. On garde la séance avec : isométrique 45° (3×30s), Nordic excentrique léger (3×4), mobilité hanches. Glace 10 min en soirée.";
  if (t.includes("pied") || t.includes("plantaire"))
    return "On retire les impacts : vélo 30 min Z2 + renfo pied (short foot, toe yoga, mollets lents). Pas de pliométrie aujourd'hui.";
  if (t.includes("hanche"))
    return "Mobilité hanches prioritaire : 90/90, couch stretch, pigeon. On évite le squat profond chargé. Renfo fessiers en isométrie (hip thrust 3×20s).";
  if (t.includes("30") || t.includes("temps") || t.includes("court"))
    return "30 min suffisent : 5 min échauffement · 15 min full body (goblet squat + push-up + row élastique en circuit) · 5 min sprints courts · 5 min mobilité. Tu coches l'essentiel.";
  if (t.includes("vacance") || t.includes("voyage") || t.includes("déplacement") || t.includes("salle"))
    return "Plan sans matériel : 3 séances semaine — circuit poids du corps (squats, fentes, pompes, gainage) + sprints terrain + mobilité hanches/pieds quotidienne. Je t'adapte le calendrier.";
  return "Bien noté. Je tiens compte de ton contexte du jour pour adapter la prochaine séance et le calendrier vers le 22 juillet.";
}

function Coach() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "coach",
      text:
        "Salut. Je suis ton coach IA. Dis-moi comment tu te sens aujourd'hui — sommeil, douleurs, contexte (temps dispo, matériel) — et j'adapte la séance.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text?: string) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }, { role: "coach", text: reply(t) }]);
    setInput("");
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Assistant performance" title="Coach IA" />

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              "max-w-[88%] rounded-2xl p-3 text-sm leading-relaxed " +
              (m.role === "coach"
                ? "card-elevated"
                : "ml-auto bg-primary text-primary-foreground")
            }
          >
            {m.role === "coach" && (
              <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" /> Coach
              </div>
            )}
            {m.text}
          </div>
        ))}
      </div>

      <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="shrink-0 rounded-full border border-border bg-graphite-2 px-3 py-1.5 text-xs font-semibold"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="sticky bottom-24 mt-3 flex items-center gap-2 rounded-2xl border border-border bg-background/85 p-2 backdrop-blur"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question au coach…"
          className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </AppShell>
  );
}
