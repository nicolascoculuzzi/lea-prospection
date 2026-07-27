import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHead, Pill, Table } from "@/components/ui";
import { CampaignDetail } from "@/components/campaign-detail";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

const TONE: Record<string, "vert" | "ambre" | "rouge" | "neutre"> = {
  active: "vert", paused: "ambre", draft: "neutre", archived: "neutre",
};

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, name, campaign_type, status, config")
    .eq("id", id)
    .maybeSingle();

  if (!campaign) notFound();

  const { data: leads } = await supabase
    .from("campaign_leads")
    .select("id, contact_name, contact_phone, state, block_reasons")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false })
    .limit(25);

  const pacing = ((campaign.config as Record<string, unknown>)?.pacing ?? {}) as {
    daily_cap?: number; dispatch_window_start?: string; dispatch_window_end?: string;
  };

  return (
    <>
      <Link href="/dashboard/campagnes" className="text-[0.8125rem] font-semibold text-gris-2 hover:text-blanc">
        ← {t.detail.back}
      </Link>

      <div className="mt-3">
        <PageHead
          title={campaign.name ?? campaign.campaign_type ?? t.common.none}
          sub={`${t.campagnes.f_cap}: ${pacing.daily_cap ?? 20} · ${pacing.dispatch_window_start ?? "09:00"}–${pacing.dispatch_window_end ?? "17:00"}`}
          right={<Pill tone={TONE[campaign.status ?? ""] ?? "neutre"}>{campaign.status}</Pill>}
        />
      </div>

      <CampaignDetail campaignId={campaign.id} status={campaign.status ?? "draft"} />

      {leads && leads.length > 0 && (
        <section className="mt-8">
          <p className="tag mb-3 text-gris-2">{t.detail.recent_leads}</p>
          <Table head={[t.contacts.col_business, t.contacts.col_phone, t.contacts.col_status]}>
            {leads.map((l) => {
              const blocks = Array.isArray(l.block_reasons) ? l.block_reasons : [];
              return (
                <tr key={l.id} className="border-b border-ligne last:border-0">
                  <td className="px-5 py-3.5 font-medium">{l.contact_name ?? t.common.none}</td>
                  <td className="px-5 py-3.5 [font-variant-numeric:tabular-nums]">{l.contact_phone}</td>
                  <td className="px-5 py-3.5">
                    <Pill tone={l.state === "eligible" ? "vert" : l.state === "suppressed" ? "ambre" : "neutre"}>
                      {l.state}
                    </Pill>
                    {blocks.length > 0 && (
                      <span className="ml-2 text-[0.75rem] text-gris-2">
                        {blocks.map((b: string) => t.reasons[b] ?? b).join(", ")}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table>
        </section>
      )}
    </>
  );
}
