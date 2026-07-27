import { createClient } from "@/lib/supabase/server";
import { PageHead, Table, Empty, Pill } from "@/components/ui";
import { NewCampaign } from "@/components/new-campaign";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

const TONE: Record<string, "vert" | "ambre" | "rouge" | "neutre"> = {
  active: "vert",
  paused: "ambre",
  draft: "neutre",
  archived: "neutre",
};

export default async function Campagnes() {
  const supabase = await createClient();

  const [{ data: merchant }, { data: campaigns }, { data: runs }] = await Promise.all([
    supabase.from("merchants").select("merchant_id").limit(1).maybeSingle(),
    supabase
      .from("campaigns")
      .select("id, name, campaign_type, status, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("campaign_dispatch_runs")
      .select("campaign_id, started_at, leads_total, leads_sendable, leads_blocked")
      .order("started_at", { ascending: false })
      .limit(200),
  ]);

  // Latest run per campaign — what the engine last decided.
  const latest = new Map<string, NonNullable<typeof runs>[number]>();
  for (const r of runs ?? []) {
    if (r.campaign_id && !latest.has(r.campaign_id)) latest.set(r.campaign_id, r);
  }

  const fmt = new Intl.DateTimeFormat("fr-CA", { dateStyle: "medium" });

  return (
    <>
      <PageHead
        title={t.campagnes.title}
        sub={t.campagnes.sub}
        right={merchant ? <NewCampaign merchantId={merchant.merchant_id} /> : undefined}
      />

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
                <td className="px-5 py-3.5">
                  <span className="font-medium">{c.name ?? c.campaign_type ?? t.common.none}</span>
                  {c.name && c.campaign_type && (
                    <span className="ml-2 text-[0.75rem] text-gris-2">{c.campaign_type}</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <Pill tone={TONE[c.status ?? ""] ?? "neutre"}>{c.status ?? t.common.none}</Pill>
                </td>
                <td className="px-5 py-3.5">
                  {run ? (
                    <div className="flex items-center gap-2.5">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-nuit">
                        <div className="h-full rounded-full bg-vert" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[0.75rem] text-gris [font-variant-numeric:tabular-nums]">
                        {sendable}/{total}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[0.8125rem] text-gris-2">{t.campagnes.not_run}</span>
                  )}
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
