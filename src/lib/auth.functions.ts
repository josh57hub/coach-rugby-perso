import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabaseServerClient } from "./supabase/server";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "8 caractères minimum"),
});

// Inscription. Le trigger SQL on_auth_user_created (voir migration 00001)
// crée automatiquement la ligne profiles correspondante côté base.
export const signUp = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CredentialsSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const signIn = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CredentialsSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  await supabase.auth.signOut();
  return { success: true };
});

// Récupère l'utilisateur courant côté serveur (depuis le cookie de session).
// Utilisé dans les loaders de route pour protéger l'accès et dans les
// server functions pour récupérer le user_id sans avoir à le passer
// explicitement depuis le client (plus sûr : impossible à falsifier).
export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
});
