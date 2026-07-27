import { createClient } from "@/lib/supabase/server";
import { PageHead, Table, Empty, Pill } from "@/components/ui";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

export default async function Contacts() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("outbound_campaign_contacts")
    .select("id, business_name, phone, status, attempts")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <PageHead title={t.contacts.title} sub={t.contacts.sub} />

      {!rows?.length ? (
        <Empty title={t.contacts.empty_title} text={t.contacts.empty_text} />
      ) : (
        <Table
          head={[t.contacts.col_business, t.contacts.col_phone, t.contacts.col_status, t.contacts.col_attempts]}
        >
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-ligne last:border-0">
              <td className="px-5 py-3.5 font-medium">{r.business_name ?? t.common.none}</td>
              <td className="px-5 py-3.5 [font-variant-numeric:tabular-nums]">{r.phone ?? t.common.none}</td>
              <td className="px-5 py-3.5"><Pill>{r.status ?? t.common.none}</Pill></td>
              <td className="px-5 py-3.5 [font-variant-numeric:tabular-nums]">{r.attempts ?? 0}</td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
