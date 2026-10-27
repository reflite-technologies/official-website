import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Staff sign in | Reflite Technologies" },
      { name: "description", content: "Staff sign in for the Reflite Technologies message inbox." },
      { property: "og:title", content: "Staff sign in | Reflite Technologies" },
      { property: "og:description", content: "Staff sign in for the Reflite inbox." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const field =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary/60";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setBusy(true);
    const { error } =
      mode === "in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/inbox` },
          });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up") { toast.success("Check your email to confirm your account."); return; }
    navigate({ to: "/inbox" });
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/inbox" });
    if (res.error) toast.error(res.error.message);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5">
      <div className="w-full max-w-sm rounded-3xl glass p-8">
        <h1 className="font-display text-2xl font-bold">Staff {mode === "in" ? "sign in" : "sign up"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Access the Reflite message inbox.</p>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input name="email" type="email" required placeholder="Email" className={field} />
          <input name="password" type="password" required minLength={8} placeholder="Password" className={field} />
          <button
            disabled={busy}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button onClick={google} className="mt-3 w-full rounded-2xl border border-border px-4 py-3 text-sm">
          Continue with Google
        </button>
        <button
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-primary"
        >
          {mode === "in" ? "No account yet? Create one" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
