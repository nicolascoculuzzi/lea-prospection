"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/fr";

/* Add-campaign form. Writes the campaign row directly (RLS scopes it to the
   merchant); leads, runs and decisions stay engine-written. A new campaign
   always starts as `draft` — nothing dials until it is set active. */
export function NewCampaign({ merchantId }: { merchantId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [name, setName] = useState("");
  const [cap, setCap] = useState("20");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");

  async function create() {
    if (!name.trim()) return;
    setState("saving");
    const { error } = await createClient().from("campaigns").insert({
      merchant_id: merchantId,
      campaign_type: "b2b_prospecting",
      name: name.trim(),
      status: "draft",
      config: {
        pacing: {
          daily_cap: Number(cap) || 20,
          dispatch_window_start: start,
          dispatch_window_end: end,
        },
      },
    });
    if (error) {
      setState("error");
      return;
    }
    setOpen(false);
    setName("");
    setState("idle");
    router.refresh();
  }

  const field =
    "w-full rounded-lg border border-ligne bg-nuit px-3.5 py-2.5 text-[0.9375rem] text-blanc outline-none transition-colors focus:border-vert";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-vert px-5 py-2.5 text-[0.875rem] font-semibold text-nuit transition-transform active:scale-[0.98]"
      >
        {t.campagnes.new}
      </button>
    );
  }

  return (
    <div className="w-full rounded-xl border border-ligne bg-panel p-6">
      <p className="tag mb-5 text-vert">{t.campagnes.new}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[0.75rem] font-medium text-gris sm:col-span-2">
          {t.campagnes.f_name}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.campagnes.f_name_ph}
            className={field}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-[0.75rem] font-medium text-gris">
          {t.campagnes.f_cap}
          <input value={cap} onChange={(e) => setCap(e.target.value)} inputMode="numeric" className={field} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-[0.75rem] font-medium text-gris">
            {t.campagnes.f_start}
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={field} />
          </label>
          <label className="flex flex-col gap-1.5 text-[0.75rem] font-medium text-gris">
            {t.campagnes.f_end}
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={field} />
          </label>
        </div>
      </div>

      <p className="mt-4 max-w-[74ch] text-[0.8125rem] leading-relaxed text-gris-2">
        {t.campagnes.f_note}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={create}
          disabled={state === "saving"}
          className="rounded-full bg-vert px-5 py-2.5 text-[0.875rem] font-semibold text-nuit disabled:opacity-50"
        >
          {state === "saving" ? t.common.saving : t.campagnes.f_create}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-[0.875rem] font-medium text-gris hover:text-blanc"
        >
          {t.common.cancel}
        </button>
        {state === "error" && (
          <span className="text-[0.8125rem] font-medium text-rouge">{t.common.error}</span>
        )}
      </div>
    </div>
  );
}
