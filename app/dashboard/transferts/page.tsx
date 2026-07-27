import { createClient } from "@/lib/supabase/server";
import { PageHead, Table, Empty, Pill } from "@/components/ui";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

const TONE: Record<string, "vert" | "ambre" | "rouge" | "neutre"> = {
  connected: "vert",
  "no-answer": "ambre",
  busy: "ambre",
  canceled: "ambre",
  failed: "rouge",
  attempted: "neutre",
  unknown: "neutre",
};

export default async function Transferts() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("call_sessions")
    .select("id, started_at, caller_e164, transfer_destination, transfer_outcome")
    .eq("transfer_attempted", true)
    .order("started_at", { ascending: false })
    .limit(100);

  const fmt = new Intl.DateTimeFormat("fr-CA", { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <PageHead title={t.transferts.title} sub={t.transferts.sub} />

      {!rows?.length ? (
        <Empty title={t.transferts.empty_title} text={t.transferts.empty_text} />
      ) : (
        <Table
          head={[t.transferts.col_when, t.transferts.col_number, t.transferts.col_dest, t.transferts.col_outcome]}
        >
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-ligne last:border-0">
              <td className="whitespace-nowrap px-5 py-3.5 [font-variant-numeric:tabular-nums]">
                {r.started_at ? fmt.format(new Date(r.started_at)) : t.common.none}
              </td>
              <td className="px-5 py-3.5 [font-variant-numeric:tabular-nums]">
                {r.caller_e164 ?? t.common.none}
              </td>
              <td className="px-5 py-3.5 text-gris [font-variant-numeric:tabular-nums]">
                {r.transfer_destination ?? t.common.none}
              </td>
              <td className="px-5 py-3.5">
                <Pill tone={TONE[r.transfer_outcome ?? ""] ?? "neutre"}>
                  {t.transferts.outcomes[r.transfer_outcome ?? ""] ?? r.transfer_outcome ?? t.common.none}
                </Pill>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
