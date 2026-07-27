import { createClient } from "@/lib/supabase/server";
import { PageHead, Table, Empty, Pill } from "@/components/ui";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

const TONE: Record<string, "vert" | "ambre" | "rouge" | "neutre"> = {
  active: "vert",
  running: "vert",
  completed: "vert",
  paused: "ambre",
  scheduled: "ambre",
  draft: "neutre",
  failed: "rouge",
};

export default async function Campagnes() {
  const supabase = await createClient();

  const [{ data: campaigns }, { data: runs }] = await Promise.all([
    supabase
      .from("campaigns")
      .select("id, campaign_type, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("campaign_dispatch_runs")
      .select("campaign_id, started_at, leads_total, leads_sendable, leads_blocked")
      .order("started_at", { ascending: false })
      .limit(200),
  ]);

  // Latest run per campaign — the progress signal the engine actually writes.
  const latest = new Map<string, NonNullable<typeof runs>[number]>();
  for (const r of runs ?? []) {
    if (r.campaign_id && !latest.has(r.campaign_id)) latest.set(r.campaign_id, r);
  }

  const fmt = new Intl.DateTimeFormat("fr-CA", { dateStyle: "medium" });

  return (
    <>
      <PageHead title={t.campagnes.title} sub={t.campagnes.sub} />

      {!campaigns?.length ? (
        <Empty title={t.campagnes.empty_title} text={t.campagnes.empty_text} />
      ) : (
        <Table
          head={[
            t.campagnes.col_name,
            t.campagnes.col_status,
            t.campagnes.col_sendable,
            t.campagnes.col_blocked,
            t.campagnes.col_created,
          ]}
        >
          {campaigns.map((c) => {
            const run = latest.get(c.id);
            const total = run?.leads_total ?? 0;
            const sendable = run?.leads_sendable ?? 0;
            const pct = total ? Math.round((sendable / total) * 100) : 0;
            return (
              <tr key={c.id} className="border-b border-ligne last:border-0">
                <td className="px-5 py-3.5 font-medium">{c.campaign_type ?? t.common.none}</td>
                <td className="px-5 py-3.5">
                  <Pill tone={TONE[c.status ?? ""] ?? "neutre"}>{c.status ?? t.common.none}</Pill>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-nuit">
                      <div className="h-full rounded-full bg-vert" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[0.75rem] text-gris [font-variant-numeric:tabular-nums]">
                      {sendable}/{total}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 [font-variant-numeric:tabular-nums]">
                  {run?.leads_blocked ?? 0}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 [font-variant-numeric:tabular-nums]">
                  {c.created_at ? fmt.format(new Date(c.created_at)) : t.common.none}
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
