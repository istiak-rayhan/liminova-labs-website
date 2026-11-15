import Link from "next/link";
import { getCmsStore } from "@/lib/cms";
import { buildReport, leadStages } from "@/lib/report";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AdminReportsPage() {
  const store = await getCmsStore();
  const report = buildReport(store);
  const maxStage = Math.max(1, ...Object.values(report.byStage));
  const maxType = Math.max(1, ...report.byProjectType.map((row) => row.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Business report</h1>
        <p className="text-slate-500 mt-1">
          Counts come from briefs stored in this dashboard and projects you track. Nothing here is estimated.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Stat label="Briefs, last 30 days" value={String(report.last30)} hint={`${report.prev30} in the 30 days before`} />
        <Stat label="Open pipeline value" value={money(report.pipelineValue)} hint="Sum of deal value on pipeline and ongoing work" />
        <Stat
          label="Win rate"
          value={report.winRate === null ? "—" : `${Math.round(report.winRate * 100)}%`}
          hint="Won divided by won + lost"
        />
        <Stat label="Live case studies" value={String(report.published)} hint="Completed and published" />
      </div>

      <section className="rounded-2xl bg-white border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Lead pipeline</h2>
        <div className="space-y-3">
          {leadStages.map((stage) => {
            const count = report.byStage[stage.id];
            return (
              <div key={stage.id} className="grid grid-cols-[7rem_1fr_2rem] gap-3 items-center text-sm">
                <span className="text-slate-600">{stage.label}</span>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${(count / maxStage) * 100}%` }}
                  />
                </div>
                <span className="text-right font-semibold text-slate-900">{count}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-4">What people ask for</h2>
        {report.byProjectType.length === 0 ? (
          <p className="text-sm text-slate-500">No briefs yet.</p>
        ) : (
          <div className="space-y-3">
            {report.byProjectType.map((row) => (
              <div key={row.label} className="grid grid-cols-[1fr_8rem_2rem] gap-3 items-center text-sm">
                <span className="text-slate-700">{row.label}</span>
                <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-teal-500"
                    style={{ width: `${(row.count / maxType) * 100}%` }}
                  />
                </div>
                <span className="text-right font-semibold">{row.count}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Next actions</h2>
          {report.nextActions.length === 0 ? (
            <p className="text-sm text-slate-500">Add a next action on an open project.</p>
          ) : (
            <ul className="space-y-3">
              {report.nextActions.map((item) => (
                <li key={item.id}>
                  <Link href="/admin/projects" className="font-medium text-slate-900 hover:text-emerald-700">
                    {item.title}
                  </Link>
                  <p className="text-sm text-slate-500">{item.nextAction}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl bg-white border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-3">Open tasks</h2>
          {report.openTasks.length === 0 ? (
            <p className="text-sm text-slate-500">No open tasks on active projects.</p>
          ) : (
            <ul className="space-y-2 text-sm text-slate-700">
              {report.openTasks.slice(0, 12).map((task) => (
                <li key={task.taskId}>
                  <span className="font-medium">{task.title}</span>
                  <span className="text-slate-400"> · {task.projectTitle}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900 mt-2">{value}</p>
      <p className="text-xs text-slate-500 mt-2">{hint}</p>
    </div>
  );
}
