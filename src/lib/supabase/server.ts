import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import type { Database } from "./types";

// Client Supabase côté serveur (SSR + createServerFn).
//
// Contrairement au client navigateur, celui-ci doit lire/écrire la session
// via les cookies HTTP de la requête en cours — c'est ce qui permet au SSR
// de savoir si l'utilisateur est connecté dès le premier rendu, sans flash
// "non connecté" au chargement de la page.
//
// IMPORTANT : on crée une nouvelle instance à chaque appel (pas de singleton
// côté serveur), car chaque requête a ses propres cookies. Un singleton
// partagerait par erreur la session d'un utilisateur avec un autre.
export function getSupabaseServerClient() {
  return createServerClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const cookies = getCookies();
          return Object.entries(cookies).map(([name, value]) => ({ name, value }));
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            setCookie(name, value, {
              ...options,
              // sameSite "lax" : nécessaire pour que le cookie survive la
              // navigation initiale (lien externe, nouvel onglet) tout en
              // restant protégé contre le CSRF cross-site.
              sameSite: "lax",
            });
          }
        },
      },
    },
  );
}
