import type { ReactNode } from "react";

export function PageHead({ eyebrow, title, sub, right }: {
  eyebrow?: string; title: string; sub?: string; right?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="tag mb-1 text-vert">{eyebrow}</p>}
        <h1 className="text-[1.5rem] font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 max-w-[70ch] text-[0.875rem] text-gris">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function Tiles({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-xl border border-ligne bg-ligne sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="bg-panel p-5">
          <p className="text-[0.75rem] font-medium text-gris">{i.label}</p>
          <p className="mt-2 text-[1.9rem] font-semibold tracking-tight [font-variant-numeric:tabular-nums]">
            {i.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-ligne bg-panel px-8 py-16 text-center">
      <span className="wave mx-auto" aria-hidden><i /><i /><i /><i /></span>
      <p className="mt-4 text-[1.0625rem] font-semibold">{title}</p>
      <p className="mx-auto mt-1.5 max-w-[52ch] text-[0.875rem] leading-relaxed text-gris">{text}</p>
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ligne bg-panel">
      <table className="w-full text-[0.875rem]">
        <thead>
          <tr className="border-b border-ligne text-left">
            {head.map((h) => (
              <th key={h} className="tag px-5 py-3 font-semibold text-gris-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Pill({ tone = "neutre", children }: { tone?: "vert" | "ambre" | "rouge" | "neutre"; children: ReactNode }) {
  const map = {
    vert: "bg-vert/12 text-vert",
    ambre: "bg-ambre/12 text-ambre",
    rouge: "bg-rouge/12 text-rouge",
    neutre: "bg-nuit text-gris",
  } as const;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}
