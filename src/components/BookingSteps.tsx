const steps = [
  {
    n: "01",
    title: "15–30 min call",
    detail: "Product and constraints — not a pitch deck.",
  },
  {
    n: "02",
    title: "Scope note",
    detail: "We write what we will (and will not) build.",
  },
  {
    n: "03",
    title: "Quote or sprint",
    detail: "Fixed build, time-boxed sprint, or embedded expert.",
  },
];

export default function BookingSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mt-8" : "mt-10"}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 mb-4">
        What happens after you book
      </p>
      <ol className="grid sm:grid-cols-3 gap-4">
        {steps.map((step) => (
          <li
            key={step.n}
            className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4"
          >
            <p className="text-emerald-600 text-xs font-semibold mb-2">{step.n}</p>
            <p className="font-semibold text-slate-900 mb-1">{step.title}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
