import Link from "next/link";
import { canSeeFinance, canView } from "@/lib/access";
import { getCmsStore } from "@/lib/cms";
import { money } from "@/lib/finance";
import { requireArea } from "@/lib/guard";
import { buildReport, leadStages } from "@/lib/report";

export default async function AdminOverviewPage() {
  const session = await requireArea("overview");
  const store = await getCmsStore();
  const report = buildReport(store);
  const leadership = canSeeFinance(session.role);
  const delivery = store.projects.filter((project) => project.status !== "pipeline");
  const assigned = delivery.filter((project) =>
    project.shares?.some((share) => share.memberId === session.memberId),
  );
  const ownWork = session.role === "operations" ? delivery : assigned;

  const cards = leadership
    ? [
        { label: "Earned so far", value: money(report.earned), href: "/admin/reports" },
        { label: "Last 7 days", value: money(report.weekIncome), href: "/admin/business" },
        { label: "Still to collect", value: money(report.toCollect), href: "/admin/reports" },
        { label: "New briefs", value: String(report.byStage.new), href: "/admin/leads" },
        {
          label: "Outreach in play",
          value: String((store.outreach ?? []).filter((lead) => !lead.converted && !lead.wasted).length),
          href: "/admin/outreach",
        },
        { label: "In progress", value: String(report.byStatus.ongoing), href: "/admin/projects?status=ongoing" },
        { label: "Pipeline", value: String(report.byStatus.pipeline), href: "/admin/projects?status=pipeline" },
        { label: "Shown on the site", value: String(report.published), href: "/portfolio" },
        { label: "Active team", value: String(store.team.filter((member) => member.active).length), href: "/admin/team" },
      ]
    : [
        {
          label: session.role === "operations" ? "In progress" : "Assigned to you",
          value: String(ownWork.filter((project) => project.status === "ongoing").length),
          href: "/admin/projects",
        },
      ];

  const actions = ownWork
    .filter((project) => project.status === "ongoing" && project.nextAction?.trim())
    .map((project) => ({ id: project.id, title: project.title, nextAction: project.nextAction!.trim() }));
  const shownActions = leadership ? report.nextActions : actions;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
      <p className="text-slate-500 mb-8">
        {leadership
          ? "Briefs, delivery, and the money recorded on projects. Figures are from this studio only."
          : "Your delivery desk. Leads, cold outreach, pipeline, and money stay with leadership."}
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
        {canView(session.role, "leads") ? (
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
        ) : null}
        <section className="rounded-2xl bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Needs a next step</h2>
            <Link href="/admin/projects" className="text-sm font-semibold text-emerald-700">
              Projects
            </Link>
          </div>
          {shownActions.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing waiting on a next step.</p>
          ) : (
            <ul className="space-y-3">
              {shownActions.slice(0, 5).map((item) => (
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
