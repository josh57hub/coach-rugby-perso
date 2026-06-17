import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { signIn, signUp } from "@/lib/auth.functions";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — Rugby Coach" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const doSignIn = useServerFn(signIn);
  const doSignUp = useServerFn(signUp);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        await doSignIn({ data: { email, password } });
        toast.success("Connecté");
        nav({ to: "/" });
      } else {
        await doSignUp({ data: { email, password } });
        toast.success("Compte créé", {
          description: "Ton profil athlète a été initialisé automatiquement.",
        });
        nav({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur d'authentification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-transparent px-6 text-foreground">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="font-display text-2xl font-black">Rugby Performance Coach</h1>
        <p className="text-sm text-muted-foreground">
          {mode === "signin" ? "Connecte-toi à ton espace" : "Crée ton compte athlète"}
        </p>
      </div>

      <form onSubmit={submit} className="card-elevated w-full space-y-3 p-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Email
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="toi@exemple.com"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Mot de passe
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2.5">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-display text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-[0_10px_30px_-10px_var(--blood-glow)] active:scale-[0.99] disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>

      <button
        onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
        className="mt-4 text-xs font-semibold text-muted-foreground"
      >
        {mode === "signin" ? (
          <>Pas encore de compte ? <span className="text-primary">Créer un compte</span></>
        ) : (
          <>Déjà un compte ? <span className="text-primary">Se connecter</span></>
        )}
      </button>
    </div>
  );
}
