export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse" aria-hidden>
      <div className="h-8 w-48 rounded-lg bg-slate-200" />
      <div className="h-4 w-80 max-w-full rounded bg-slate-200" />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 rounded-2xl bg-white border border-slate-200" />
        ))}
      </div>
    </div>
  );
}
