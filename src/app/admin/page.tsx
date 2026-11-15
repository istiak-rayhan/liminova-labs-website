import Link from "next/link";
import { getCmsStore } from "@/lib/cms";
import { money } from "@/lib/finance";
import { buildReport, leadStages } from "@/lib/report";

export default async function AdminOverviewPage() {
  const store = await getCmsStore();
  const report = buildReport(store);
  const team = store.team.filter((member) => member.active).length;

  const cards = [
    { label: "Earned so far", value: money(report.earned), href: "/admin/reports" },
    { label: "Last 7 days", value: money(report.weekIncome), href: "/admin/business" },
    { label: "Still to collect", value: money(report.toCollect), href: "/admin/reports" },
    { label: "New briefs", value: String(report.byStage.new), href: "/admin/leads" },
    { label: "In progress", value: String(report.byStatus.ongoing), href: "/admin/projects?status=ongoing" },
    { label: "Shown on the site", value: String(report.published), href: "/portfolio" },
    { label: "Active team", value: String(team), href: "/admin/team" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-500 mb-8">
        Briefs, delivery, and the money recorded on projects. Figures are from this studio only.
      </p>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-emerald-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Latest briefs</h2>
            <Link href="/admin/leads" className="text-sm font-semibold text-emerald-700">
              Open pipeline
            </Link>
          </div>
          {report.recentLeads.length === 0 ? (
            <p className="text-sm text-slate-500">No briefs yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {report.recentLeads.map((lead) => (
                <li key={lead.id} className="py-3">
                  <p className="font-medium text-slate-900">
                    {lead.name} · {lead.company}
                  </p>
                  <p className="text-sm text-slate-500">
                    {lead.projectType} · {leadStages.find((stage) => stage.id === lead.stage)?.label}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Needs a next step</h2>
            <Link href="/admin/reports" className="text-sm font-semibold text-emerald-700">
              Full report
            </Link>
          </div>
          {report.nextActions.length === 0 ? (
            <p className="text-sm text-slate-500">
              Set a next action on a pipeline or ongoing project.
            </p>
          ) : (
            <ul className="space-y-3">
              {report.nextActions.slice(0, 5).map((item) => (
                <li key={item.id}>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.nextAction}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
