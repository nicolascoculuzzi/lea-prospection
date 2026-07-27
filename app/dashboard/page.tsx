import { createClient } from "@/lib/supabase/server";
import { PageHead, Tiles, Empty } from "@/components/ui";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const since = new Date(Date.now() - 30 * 864e5).toISOString();

  // Outbound-only surface: this portal never reads inbound reception data.
  const [{ data: attempts }, { data: calls }, { count: campaignCount }] = await Promise.all([
    supabase
      .from("outbound_attempts")
      .select("id, outcome")
      .gte("attempted_at", since)
      .limit(5000),
    supabase
      .from("call_sessions")
      .select("id, answered_at, transfer_outcome")
      .eq("direction", "outbound")
      .gte("started_at", since)
      .limit(5000),
    supabase.from("campaigns").select("*", { count: "exact", head: true }),
  ]);

  const dials = attempts?.length ?? 0;
  const rows = calls ?? [];
  const reached = rows.filter((c) => c.answered_at).length;
  const transfers = rows.filter((c) => c.transfer_outcome === "connected").length;
  const rate = reached ? Math.round((transfers / reached) * 100) : 0;

  return (
    <>
      <PageHead
        eyebrow={t.home.eyebrow}
        title={t.home.title}
        right={
          <span className="inline-flex items-center gap-2 rounded-full border border-ligne bg-panel px-3 py-1 text-[0.75rem] font-medium text-gris">
            <span className="h-1.5 w-1.5 rounded-full bg-vert" aria-hidden />
            {t.home.live}: 0
          </span>
        }
      />

      <Tiles
        items={[
          { label: t.home.tiles.dials, value: String(dials) },
          { label: t.home.tiles.reached, value: String(reached) },
          { label: t.home.tiles.transfers, value: String(transfers) },
          { label: t.home.tiles.rate, value: `${rate} %` },
        ]}
      />

      {!campaignCount && (
        <div className="mt-8">
          <Empty title={t.home.empty_title} text={t.home.empty_text} />
        </div>
      )}
    </>
  );
}
