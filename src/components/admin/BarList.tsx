type Row = {
  label: string;
  value: number;
  display?: string;
  bar: string;
};

export default function BarList({
  title,
  hint,
  rows,
}: {
  title: string;
  hint?: string;
  rows: Row[];
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/80">
      <h2 className="font-display text-lg font-semibold text-slate-950">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-slate-500">{hint}</p> : null}
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-slate-600">{row.label}</span>
              <span className="font-semibold text-slate-950">{row.display ?? row.value}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${row.bar}`}
                style={{ width: `${Math.max(row.value > 0 ? 4 : 0, (row.value / max) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
