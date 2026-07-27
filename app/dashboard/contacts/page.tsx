import { createClient } from "@/lib/supabase/server";
import { PageHead, Table, Empty, Pill } from "@/components/ui";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

const TONE: Record<string, "vert" | "ambre" | "rouge" | "neutre"> = {
  converted: "vert",
  contacted: "vert",
  eligible: "neutre",
  pending: "neutre",
  queued: "ambre",
  dispatched: "ambre",
  suppressed: "rouge",
  opted_out: "rouge",
  failed: "rouge",
};

export default async function Contacts() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("campaign_leads")
    .select("id, contact_name, contact_phone, state, attempts, last_attempt_at, block_reasons")
    .order("created_at", { ascending: false })
    .limit(200);

  const fmt = new Intl.DateTimeFormat("fr-CA", { dateStyle: "short", timeStyle: "short" });

  return (
    <>
      <PageHead title={t.contacts.title} sub={t.contacts.sub} />

      {!rows?.length ? (
        <Empty title={t.contacts.empty_title} text={t.contacts.empty_text} />
      ) : (
        <Table
          head={[
            t.contacts.col_business,
            t.contacts.col_phone,
            t.contacts.col_status,
            t.contacts.col_attempts,
            t.contacts.col_last,
          ]}
        >
          {rows.map((r) => {
            const blocks = Array.isArray(r.block_reasons) ? r.block_reasons : [];
            return (
              <tr key={r.id} className="border-b border-ligne last:border-0">
                <td className="px-5 py-3.5 font-medium">{r.contact_name ?? t.common.none}</td>
                <td className="px-5 py-3.5 [font-variant-numeric:tabular-nums]">
                  {r.contact_phone ?? t.common.none}
                </td>
                <td className="px-5 py-3.5">
                  <Pill tone={TONE[r.state ?? ""] ?? "neutre"}>{r.state ?? t.common.none}</Pill>
                  {blocks.length > 0 && (
                    <span className="ml-2 text-[0.75rem] text-gris-2">{blocks.join(", ")}</span>
                  )}
                </td>
                <td className="px-5 py-3.5 [font-variant-numeric:tabular-nums]">{r.attempts ?? 0}</td>
                <td className="whitespace-nowrap px-5 py-3.5 text-gris [font-variant-numeric:tabular-nums]">
                  {r.last_attempt_at ? fmt.format(new Date(r.last_attempt_at)) : t.common.none}
                </td>
              </tr>
            );
          })}
        </Table>
      )}
    </>
  );
}
