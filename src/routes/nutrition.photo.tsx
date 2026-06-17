import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Loader2, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app-shell";
import { analyzeMealPhoto, type MealAnalysis } from "@/lib/ai.functions";
import { mealJournal } from "@/lib/mock-data";

export const Route = createFileRoute("/nutrition/photo")({
  head: () => ({ meta: [{ title: "Photo repas — Rugby Coach" }] }),
  component: Photo,
});

function Photo() {
  const analyze = useServerFn(analyzeMealPhoto);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MealAnalysis | null>(null);

  const handleFile = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image trop lourde (max 8 Mo)");
      return;
    }
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    setPreview(dataUrl);
    setResult(null);
    setLoading(true);
    try {
      const res = await analyze({ data: { imageDataUrl: dataUrl } });
      setResult(res);
      toast.success("Analyse terminée");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur d'analyse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Journal photo" title="Analyse de repas IA" />

      <section className="card-elevated mb-4 p-5">
        <p className="text-sm text-muted-foreground">
          Prends une photo de ton assiette : l'IA estime les macros et te donne un retour orienté performance rugby.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-2 rounded-2xl bg-primary py-5 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground active:scale-[0.98]"
          >
            <Camera className="h-6 w-6" />
            Prendre une photo
          </button>
          <button
            onClick={() => {
              const i = inputRef.current;
              if (i) {
                i.removeAttribute("capture");
                i.click();
                setTimeout(() => i.setAttribute("capture", "environment"), 500);
              }
            }}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-graphite-2 py-5 font-display text-sm font-bold uppercase tracking-wider active:scale-[0.98]"
          >
            <Upload className="h-6 w-6" />
            Importer
          </button>
        </div>

        {preview && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <img src={preview} alt="Aperçu du repas" className="aspect-square w-full object-cover" />
          </div>
        )}

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-graphite-2/60 p-4 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            Analyse en cours…
          </div>
        )}
      </section>

      {result && (
        <section className="card-elevated mb-4 p-5">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Résultat de l'analyse
          </div>
          <p className="mt-2 text-sm font-semibold">{result.aliments.join(" · ")}</p>

          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <Macro label="kcal" value={result.calories} />
            <Macro label="Prot." value={`${result.proteines_g}g`} />
            <Macro label="Gluc." value={`${result.glucides_g}g`} />
            <Macro label="Lip." value={`${result.lipides_g}g`} />
          </div>

          <p className="mt-4 rounded-xl bg-graphite-2/60 p-3 text-sm">{result.feedback}</p>

          {result.suggestions.length > 0 && (
            <>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Pour ta performance
              </p>
              <ul className="mt-2 space-y-1.5">
                {result.suggestions.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      <section>
        <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Repas récents
        </h3>
        <ul className="space-y-2">
          {mealJournal.map((m) => (
            <li key={m.id} className="card-elevated p-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{m.repas}</p>
                <p className="text-xs text-muted-foreground">{m.date}</p>
              </div>
              <p className="mt-1 text-sm font-semibold">{m.resume}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {m.calories} kcal · {m.proteines}g P · {m.glucides}g G · {m.lipides}g L
              </p>
              <p className="mt-2 text-xs">{m.feedback}</p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}

function Macro({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-graphite-2/60 px-2 py-3">
      <p className="font-display text-base font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
