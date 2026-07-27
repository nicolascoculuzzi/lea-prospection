"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/fr";

const SUIVI = [
  { key: "home", href: "/dashboard", label: t.nav.home },
  { key: "campagnes", href: "/dashboard/campagnes", label: t.nav.campagnes },
  { key: "transferts", href: "/dashboard/transferts", label: t.nav.transferts },
];
const CONFIG = [
  { key: "contacts", href: "/dashboard/contacts", label: t.nav.contacts },
  { key: "reglages", href: "/dashboard/reglages", label: t.nav.reglages },
];

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const item = (i: { key: string; href: string; label: string }) => {
    const active = i.href === "/dashboard" ? pathname === i.href : pathname.startsWith(i.href);
    return (
      <Link
        key={i.key}
        href={i.href}
        aria-current={active ? "page" : undefined}
        className={
          active
            ? "rounded-md bg-vert/10 px-3 py-1.5 text-[0.8438rem] font-semibold text-vert"
            : "rounded-md px-3 py-1.5 text-[0.8438rem] font-medium text-gris transition-colors hover:bg-panel hover:text-blanc"
        }
      >
        {i.label}
      </Link>
    );
  };

  return (
    <aside className="sticky top-0 flex h-dvh w-56 shrink-0 flex-col border-r border-ligne px-3 py-5 max-md:hidden">
      <div className="px-3">
        <p className="text-[1.3rem] font-semibold leading-none tracking-tight">
          {t.brand}<span className="text-vert">.</span>
        </p>
        <p className="tag mt-1 text-vert">{t.product}</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        <p className="tag mb-1 px-3 text-gris-2">{t.nav.groupSuivi}</p>
        {SUIVI.map(item)}
        <p className="tag mb-1 mt-6 px-3 text-gris-2">{t.nav.groupConfig}</p>
        {CONFIG.map(item)}
      </nav>

      <div className="border-t border-ligne px-3 pt-4">
        <p className="truncate text-[0.75rem] text-gris-2" title={email}>{email}</p>
        <button onClick={signOut} className="mt-2 text-[0.8125rem] font-semibold text-gris hover:text-blanc">
          {t.nav.signout}
        </button>
      </div>
    </aside>
  );
}
