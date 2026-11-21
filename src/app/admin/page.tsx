import Link from "next/link";
import { canSeeFinance, canView } from "@/lib/access";
import { getCmsStore } from "@/lib/cms";
import type { CmsProject } from "@/lib/cms-types";
import { money } from "@/lib/finance";
import { requireArea } from "@/lib/guard";
import { buildReport, leadStages } from "@/lib/report";

function hourInDhaka(now: Date) {
  const value = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    hour: "numeric",
    hourCycle: "h23",
  }).format(now);
  const hour = Number(value);
  return hour === 24 ? 0 : hour;
}

function greetingFor(now: Date) {
  const hour = hourInDhaka(now);
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function openTasks(projects: CmsProject[]) {
  return projects.flatMap((project) =>
    (project.tasks ?? [])
      .filter((task) => !task.done && task.title.trim())
      .map((task) => ({
        id: `${project.id}-${task.id}`,
        project: project.title,
        title: task.title.trim(),
      })),
  );
}

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
  const member = store.team.find(
    (person) =>
      person.id === session.memberId ||
      (person.email && person.email.toLowerCase() === session.email.toLowerCase()),
  );
  const firstName = member?.name.trim().split(/\s+/)[0];
  const greeting = `${greetingFor(new Date())}${firstName ? `, ${firstName}` : ""}`;

  const cards = leadership
    ? [
        { label: "New briefs", value: String(report.byStage.new), hint: "Inbound, still new", href: "/admin/leads" },
        {
          label: "Outreach in play",
          value: String((store.outreach ?? []).filter((lead) => !lead.converted && !lead.wasted).length),
          hint: "Collected leads still open",
          href: "/admin/outreach",
        },
        {
          label: "In progress",
          value: String(report.byStatus.ongoing),
          hint: "Projects being delivered",
          href: "/admin/projects?status=ongoing",
        },
        {
          label: "Still to collect",
          value: money(report.toCollect),
          hint: "Signed value minus receipts",
          href: "/admin/reports",
        },
      ]
    : [
        {
          label: session.role === "operations" ? "In progress" : "Assigned to you",
          value: String(ownWork.filter((project) => project.status === "ongoing").length),
          hint: "Work you can move today",
          href: "/admin/projects",
        },
        {
          label: "Open tasks",
          value: String(openTasks(ownWork).length),
          hint: "Unchecked tasks on your projects",
          href: "/admin/projects",
        },
      ];

  const quieter = leadership
    ? [
        { label: "Earned so far", value: money(report.earned), href: "/admin/reports" },
        { label: "Last 7 days", value: money(report.weekIncome), href: "/admin/business" },
        { label: "Pipeline", value: String(report.byStatus.pipeline), href: "/admin/projects?status=pipeline" },
        { label: "On the site", value: String(report.published), href: "/portfolio" },
        { label: "People", value: String(store.team.filter((person) => person.active).length), href: "/admin/team" },
      ]
    : [];

  const actions = ownWork
    .filter((project) => project.status === "ongoing" && project.nextAction?.trim())
    .map((project) => ({ id: project.id, title: project.title, nextAction: project.nextAction!.trim() }));
  const shownActions = leadership ? report.nextActions : actions;
  const deliveryTasks = openTasks(ownWork).slice(0, 5);
  const people = store.team.filter((person) => person.active).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-3xl bg-[#07140f] px-6 py-7 text-white md:px-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">Liminova Labs</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{greeting}.</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
          {leadership
            ? "Business development, delivery, money, and the people on the work. One desk for the studio."
            : "Your delivery desk. Leads, cold outreach, pipeline, and money stay with leadership."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {leadership ? (
            <>
              <Link href="/admin/leads" className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950">
                Review briefs
              </Link>
              <Link href="/admin/outreach" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                Cold outreach
              </Link>
            </>
          ) : (
            <Link href="/admin/projects" className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950">
              Open projects
            </Link>
          )}
        </div>
      </section>

      <div className={`mt-5 grid gap-3 ${cards.length > 2 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2"}`}>
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl bg-white px-5 py-4 shadow-[0_1px_2px_rgba(7,20,15,0.04)] ring-1 ring-slate-200/80 transition hover:ring-emerald-300"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{card.label}</p>
            <p className="mt-3 font-display text-3xl font-bold text-slate-950">{card.value}</p>
            <p className="mt-2 text-xs text-slate-500">{card.hint}</p>
          </Link>
        ))}
      </div>

      {quieter.length > 0 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quieter.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-2xl bg-white/80 px-4 py-3 ring-1 ring-slate-200/70 transition hover:ring-emerald-300"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{card.label}</p>
              <p className="mt-1 font-display text-xl font-bold text-slate-950">{card.value}</p>
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/80 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-950">On the agenda</h2>
            <Link href="/admin/projects" className="text-sm font-semibold text-emerald-700">
              Projects
            </Link>
          </div>
          {shownActions.length === 0 ? (
            <p className="text-sm text-slate-500">Nothing waiting on a next step.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {shownActions.slice(0, 5).map((item) => (
                <li key={item.id} className="py-3">
                  <p className="font-medium text-slate-950">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.nextAction}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {canView(session.role, "leads") ? (
          <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/80 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-slate-950">Latest briefs</h2>
              <Link href="/admin/leads" className="text-sm font-semibold text-emerald-700">
                Leads
              </Link>
            </div>
            {report.recentLeads.length === 0 ? (
              <p className="text-sm text-slate-500">No briefs yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {report.recentLeads.map((lead) => (
                  <li key={lead.id} className="py-3">
                    <p className="font-medium text-slate-950">
                      {lead.name}
                      {lead.company ? ` · ${lead.company}` : ""}
                    </p>
                    <p className="text-sm text-slate-500">
                      {lead.projectType} · {leadStages.find((stage) => stage.id === lead.stage)?.label}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/80 lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-slate-950">Open tasks</h2>
            {deliveryTasks.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No open tasks on your projects.</p>
            ) : (
              <ul className="mt-2 divide-y divide-slate-100">
                {deliveryTasks.map((task) => (
                  <li key={task.id} className="py-3">
                    <p className="font-medium text-slate-950">{task.title}</p>
                    <p className="text-sm text-slate-500">{task.project}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      {leadership ? (
        <section className="mt-4 rounded-3xl bg-white p-6 ring-1 ring-slate-200/80">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-slate-950">People</h2>
            <Link href="/admin/team" className="text-sm font-semibold text-emerald-700">
              Manage
            </Link>
          </div>
          {people.length === 0 ? (
            <p className="text-sm text-slate-500">No active people yet.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((person) => (
                <li key={person.id} className="rounded-2xl bg-[#f4f8f5] px-4 py-3">
                  <p className="font-medium text-slate-950">{person.name}</p>
                  <p className="text-sm text-slate-500">{person.title || person.focus || "Team"}</p>
                </li>
              ))}
            </ul>
          )}
          {report.openTasks.length > 0 ? (
            <p className="mt-4 text-xs text-slate-400">{report.openTasks.length} open tasks across active work.</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
