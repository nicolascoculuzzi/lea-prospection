import { createClient } from "@/lib/supabase/server";
import { PageHead, Table, Empty, Pill } from "@/components/ui";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

const TONE: Record<string, "vert" | "ambre" | "neutre"> = {
  active: "vert",
  running: "vert",
  paused: "ambre",
  draft: "neutre",
};

export default async function Campagnes() {
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("outbound_campaigns")
    .select("id, name, status, created_at")
    .order("created_at", { ascending: false });

  const fmt = new Intl.DateTimeFormat("fr-CA", { dateStyle: "medium" });

  return (
    <>
      <PageHead title={t.campagnes.title} sub={t.campagnes.sub} />

      {!campaigns?.length ? (
        <Empty title={t.campagnes.empty_title} text={t.campagnes.empty_text} />
      ) : (
        <Table head={[t.campagnes.col_name, t.campagnes.col_status, t.campagnes.col_created]}>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-b border-ligne last:border-0">
              <td className="px-5 py-3.5 font-medium">{c.name ?? t.common.none}</td>
              <td className="px-5 py-3.5">
                <Pill tone={TONE[c.status ?? ""] ?? "neutre"}>{c.status ?? t.common.none}</Pill>
              </td>
              <td className="px-5 py-3.5 [font-variant-numeric:tabular-nums]">
                {c.created_at ? fmt.format(new Date(c.created_at)) : t.common.none}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  );
}
