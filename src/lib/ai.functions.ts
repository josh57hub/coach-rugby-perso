import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Analyse de photo de repas via Lovable AI Gateway (Gemini multimodal).
// L'image est envoyée en data URL base64 depuis le client.

const InputSchema = z.object({
  imageDataUrl: z.string().min(20),
});

export type MealAnalysis = {
  aliments: string[];
  calories: number;
  proteines_g: number;
  glucides_g: number;
  lipides_g: number;
  feedback: string;
  suggestions: string[];
};

const SYSTEM = `Tu es un nutritionniste sportif spécialisé en rugby (joueur 1m79, 84 kg, Fédérale 3, postes Centre/Ailier, objectifs vitesse-puissance et prévention blessures).
Analyse la photo de repas et réponds STRICTEMENT en JSON valide (aucun texte autour), au format :
{
  "aliments": ["..."],
  "calories": nombre,
  "proteines_g": nombre,
  "glucides_g": nombre,
  "lipides_g": nombre,
  "feedback": "phrase courte en français",
  "suggestions": ["...", "..."]
}
Les valeurs nutritionnelles sont des estimations pour la portion visible.
Le feedback et les suggestions sont en français, orientés performance rugby (protéines ~2 g/kg, glucides autour des séances, micronutriments anti-inflammatoires).`;

export const analyzeMealPhoto = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }): Promise<MealAnalysis> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY manquant");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyse ce repas et renvoie le JSON demandé." },
              { type: "image_url", image_url: { url: data.imageDataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Limite de requêtes atteinte. Réessaie dans un instant.");
      if (res.status === 402) throw new Error("Crédits IA épuisés. Ajoute des crédits dans l'espace de travail.");
      throw new Error(`Erreur IA (${res.status}) : ${txt.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: MealAnalysis;
    try {
      parsed = JSON.parse(content);
    } catch {
      // tentative d'extraction
      const m = content.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : ({} as MealAnalysis);
    }

    return {
      aliments: parsed.aliments ?? [],
      calories: Math.round(Number(parsed.calories) || 0),
      proteines_g: Math.round(Number(parsed.proteines_g) || 0),
      glucides_g: Math.round(Number(parsed.glucides_g) || 0),
      lipides_g: Math.round(Number(parsed.lipides_g) || 0),
      feedback: parsed.feedback ?? "",
      suggestions: parsed.suggestions ?? [],
    };
  });
