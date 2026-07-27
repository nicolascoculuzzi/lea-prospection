"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { t } from "@/lib/fr";

type Preview = {
  leads_total: number;
  leads_sendable: number;
  leads_blocked: number;
  block_reasons: Record<string, number>;
};

const API = process.env.NEXT_PUBLIC_FASTAPI_URL ?? "";

/* Campaign setup: import a list, dry-run it through the compliance gate,
   then activate. Nothing dials while status is draft or paused. */
export function CampaignDetail({
  campaignId,
  status,
}: {
  campaignId: string;
  status: string;
}) {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [busy, setBusy] = useState<null | "import" | "preview" | "status">(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);

  async function token() {
    const { data } = await createClient().auth.getSession();
    return data.session?.access_token ?? "";
  }

  async function call(path: string, body?: unknown) {
    const res = await fetch(`${API}/api/prospecting/campaigns/${campaignId}/${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${await token()}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setCsv(await f.text());
  }

  async function doImport() {
    if (!csv.trim()) return;
    setBusy("import"); setErr(null); setMsg(null);
    try {
      const r = await call("import", { csv_text: csv, default_region: "CA" });
      setMsg(
        t.detail.import_done
          .replace("{n}", String(r.imported))
          .replace("{dupe}", String(r.skipped_duplicate))
          .replace("{bad}", String(r.skipped_invalid))
      );
      setCsv("");
      router.refresh();
    } catch { setErr(t.common.error); }
    setBusy(null);
  }

  async function doPreview() {
    setBusy("preview"); setErr(null); setMsg(null);
    try {
      setPreview(await call("preview"));
      router.refresh();
    } catch { setErr(t.common.error); }
    setBusy(null);
  }

  async function setStatus(next: string) {
    setBusy("status"); setErr(null);
    const { error } = await createClient()
      .from("campaigns").update({ status: next }).eq("id", campaignId);
    if (error) setErr(t.common.error);
    setBusy(null);
    router.refresh();
  }

  const box = "rounded-xl border border-ligne bg-panel p-6";
  const btn = "rounded-full px-5 py-2.5 text-[0.875rem] font-semibold transition-transform active:scale-[0.98] disabled:opacity-50";

  return (
    <div className="flex flex-col gap-4">
      {/* 1 — import */}
      <section className={box}>
        <p className="tag text-vert">{t.detail.step1}</p>
        <h2 className="mt-1 text-[1.0625rem] font-semibold">{t.detail.import_title}</h2>
        <p className="mt-1 max-w-[74ch] text-[0.875rem] text-gris">{t.detail.import_sub}</p>

        <input
          type="file"
          accept=".csv,text/csv"
          onChange={onFile}
          className="mt-4 block w-full text-[0.8125rem] text-gris file:mr-3 file:rounded-full file:border-0 file:bg-panel-2 file:px-4 file:py-2 file:text-[0.8125rem] file:font-semibold file:text-blanc"
        />
        <textarea
          value={csv}
          onChange={(e) => setCsv(e.target.value)}
          rows={5}
          placeholder={t.detail.csv_ph}
          className="mt-3 w-full rounded-lg border border-ligne bg-nuit px-3.5 py-2.5 font-mono text-[0.8125rem] text-blanc outline-none focus:border-vert"
        />
        <button onClick={doImport} disabled={busy !== null || !csv.trim()} className={`${btn} mt-3 bg-vert text-nuit`}>
          {busy === "import" ? t.common.saving : t.detail.import_btn}
        </button>
      </section>

      {/* 2 — preview */}
      <section className={box}>
        <p className="tag text-vert">{t.detail.step2}</p>
        <h2 className="mt-1 text-[1.0625rem] font-semibold">{t.detail.preview_title}</h2>
        <p className="mt-1 max-w-[74ch] text-[0.875rem] text-gris">{t.detail.preview_sub}</p>

        <button onClick={doPreview} disabled={busy !== null} className={`${btn} mt-4 border border-ligne bg-nuit text-blanc`}>
          {busy === "preview" ? t.common.loading : t.detail.preview_btn}
        </button>

        {preview && (
          <div className="mt-5 border-t border-ligne pt-5">
            <div className="flex flex-wrap gap-8">
              {[
                { l: t.detail.p_total, v: preview.leads_total, c: "text-blanc" },
                { l: t.detail.p_sendable, v: preview.leads_sendable, c: "text-vert" },
                { l: t.detail.p_blocked, v: preview.leads_blocked, c: "text-ambre" },
              ].map((x) => (
                <div key={x.l}>
                  <p className="text-[0.75rem] text-gris">{x.l}</p>
                  <p className={`text-[1.6rem] font-semibold [font-variant-numeric:tabular-nums] ${x.c}`}>{x.v}</p>
                </div>
              ))}
            </div>

            {Object.keys(preview.block_reasons).length > 0 && (
              <>
                <p className="tag mt-5 text-gris-2">{t.detail.why_blocked}</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {Object.entries(preview.block_reasons)
                    .sort((a, b) => b[1] - a[1])
                    .map(([reason, n]) => (
                      <li key={reason} className="flex items-baseline justify-between text-[0.875rem]">
                        <span className="text-gris">{t.reasons[reason] ?? reason}</span>
                        <span className="[font-variant-numeric:tabular-nums]">{n}</span>
                      </li>
                    ))}
                </ul>
              </>
            )}
          </div>
        )}
      </section>

      {/* 3 — activate */}
      <section className={box}>
        <p className="tag text-vert">{t.detail.step3}</p>
        <h2 className="mt-1 text-[1.0625rem] font-semibold">{t.detail.launch_title}</h2>
        <p className="mt-1 max-w-[74ch] text-[0.875rem] text-gris">{t.detail.launch_sub}</p>

        <div className="mt-4 flex items-center gap-3">
          {status !== "active" ? (
            <button onClick={() => setStatus("active")} disabled={busy !== null} className={`${btn} bg-vert text-nuit`}>
              {t.detail.activate}
            </button>
          ) : (
            <button onClick={() => setStatus("paused")} disabled={busy !== null} className={`${btn} border border-ligne bg-nuit text-blanc`}>
              {t.detail.pause}
            </button>
          )}
          <span className="text-[0.8125rem] text-gris-2">
            {status === "active" ? t.detail.is_active : t.detail.is_idle}
          </span>
        </div>
      </section>

      {(msg || err) && (
        <p className={`text-[0.875rem] font-medium ${err ? "text-rouge" : "text-vert"}`}>{err ?? msg}</p>
      )}
    </div>
  );
}
