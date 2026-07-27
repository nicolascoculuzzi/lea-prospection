"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/fr";

export default function LoginPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) {
      setError(t.login.error);
      setPending(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const field =
    "w-full rounded-lg border border-ligne bg-nuit px-3.5 py-2.5 text-[0.9375rem] text-blanc outline-none transition-colors placeholder:text-gris-2 focus:border-vert";

  return (
    <div className="flex min-h-dvh">
      <main className="relative flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <p className="mb-1 text-center text-[26px] font-semibold leading-none tracking-tight">
            {t.brand}<span className="text-vert">.</span>
          </p>
          <p className="tag mb-8 text-center text-vert">{t.product}</p>

          <div className="rounded-2xl border border-ligne bg-panel p-8 shadow-2xl">
            <h1 className="text-center text-[22px] font-semibold tracking-tight">{t.login.title}</h1>
            <p className="mt-1 text-center text-[0.8125rem] text-gris">{t.login.sub}</p>

            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[0.8125rem] font-medium text-gris">
                {t.login.email}
                <input name="email" type="email" autoComplete="email" required className={field} />
              </label>
              <label className="flex flex-col gap-1.5 text-[0.8125rem] font-medium text-gris">
                {t.login.password}
                <input name="password" type="password" autoComplete="current-password" required className={field} />
              </label>

              {error && (
                <p role="alert" className="text-[0.8125rem] font-medium text-rouge">{error}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-2 rounded-lg bg-vert py-3 text-[0.9375rem] font-semibold text-nuit transition-transform active:scale-[0.98] disabled:opacity-50"
              >
                {pending ? t.login.submitting : t.login.submit}
              </button>
            </form>
          </div>
        </div>
        <p className="absolute bottom-6 left-8 hidden text-xs text-gris-2 lg:block">
          © {new Date().getFullYear()} {t.brand}
        </p>
      </main>

      <aside
        className="relative hidden items-center justify-center lg:flex lg:w-1/2"
        style={{ background: "radial-gradient(ellipse at center, rgba(62,229,143,0.05), transparent 65%), #0e1114" }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(62,229,143,0.13) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden
        />
        <div className="relative max-w-md rounded-xl border border-ligne bg-panel/95 p-8 shadow-2xl">
          <span className="wave" aria-hidden><i /><i /><i /><i /></span>
          <p className="mt-4 text-[17px] leading-relaxed">
            Léa compose, qualifie, et passe le téléphone à un représentant seulement
            quand quelqu&apos;un d&apos;intéressé est déjà en ligne.
          </p>
          <p className="mt-5 text-[13px] text-gris">Vos représentants ne composent plus.</p>
        </div>
      </aside>
    </div>
  );
}
