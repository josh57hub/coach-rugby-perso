import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

// Client Supabase côté navigateur. Utilise les cookies pour stocker la
// session (au lieu de localStorage), ce qui permet au serveur (SSR) de lire
// la même session — voir server.ts dans ce même dossier.
//
// Singleton : on ne veut qu'une seule instance par session navigateur.
let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
    );
  }
  return browserClient;
}
