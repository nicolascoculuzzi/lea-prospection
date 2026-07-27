import { createClient } from "@/lib/supabase/server";
import { PageHead, Pill } from "@/components/ui";
import { t } from "@/lib/fr";

export const dynamic = "force-dynamic";

type Destination = {
  role?: string;
  name?: string;
  numbers?: string[];
  number?: string;
  available_hours?: unknown;
};

export default async function Reglages() {
  const supabase = await createClient();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("merchant_id, business_name, timezone")
    .limit(1)
    .maybeSingle();

  const { data: version } = await supabase
    .from("merchant_config_versions_new")
    .select("template_json")
    .eq("is_published", true)
    .limit(1)
    .maybeSingle();

  const transfers = ((version?.template_json as Record<string, unknown>)?.transfers ?? {}) as {
    ring_strategy?: string;
    destinations?: Destination[];
  };
  const destinations = transfers.destinations ?? [];

  return (
    <>
      <PageHead title={t.reglages.title} sub={t.reglages.sub} />

      <section className="rounded-xl border border-ligne bg-panel p-6">
        <div className="flex items-center justify-between">
          <p className="tag text-gris-2">{t.reglages.dest_title}</p>
          <Pill tone="neutre">
            {t.reglages.strategy}: {transfers.ring_strategy ?? "sequential"}
          </Pill>
        </div>

        {!destinations.length ? (
          <p className="mt-4 text-[0.875rem] italic text-gris-2">{t.reglages.dest_empty}</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {destinations.map((d, i) => {
              const nums = d.numbers ?? (d.number ? [d.number] : []);
              return (
                <li key={i} className="flex items-center justify-between border-t border-ligne pt-3 first:border-0 first:pt-0">
                  <span className="text-[0.9375rem] font-medium">{d.role ?? d.name ?? `#${i + 1}`}</span>
                  <span className="text-[0.875rem] text-gris [font-variant-numeric:tabular-nums]">
                    {nums.join(" · ") || t.common.none}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <p className="mt-5 max-w-[74ch] text-[0.8125rem] leading-relaxed text-gris-2">
          {t.reglages.dest_note}
        </p>
      </section>

      <section className="mt-4 rounded-xl border border-ligne bg-panel p-6">
        <p className="tag text-gris-2">{t.reglages.window_title}</p>
        <p className="mt-3 max-w-[74ch] text-[0.875rem] leading-relaxed text-gris">
          {t.reglages.window_note}
        </p>
      </section>

      <section className="mt-4 rounded-xl border border-ligne bg-panel p-6">
        <p className="tag text-gris-2">{t.reglages.business}</p>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-[0.75rem] text-gris-2">{t.contacts.col_business}</dt>
            <dd className="mt-0.5 text-[0.9375rem] font-medium">
              {merchant?.business_name ?? t.common.none}
            </dd>
          </div>
          <div>
            <dt className="text-[0.75rem] text-gris-2">Fuseau horaire</dt>
            <dd className="mt-0.5 text-[0.9375rem] font-medium">{merchant?.timezone ?? t.common.none}</dd>
          </div>
        </dl>
      </section>

      <p className="mt-6 text-[0.8125rem] text-gris-2">{t.reglages.note}</p>
    </>
  );
}
