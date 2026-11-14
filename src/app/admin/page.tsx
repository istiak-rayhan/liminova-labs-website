import Link from "next/link";
import { getCmsStore } from "@/lib/cms";

export default async function AdminOverviewPage() {
  const store = await getCmsStore();
  const counts = {
    pipeline: store.projects.filter((p) => p.status === "pipeline").length,
    ongoing: store.projects.filter((p) => p.status === "ongoing").length,
    completed: store.projects.filter((p) => p.status === "completed").length,
    published: store.projects.filter((p) => p.published && p.status === "completed")
      .length,
    team: store.team.filter((member) => member.active).length,
  };

  const cards = [
    { label: "Pipeline", value: counts.pipeline, href: "/admin/projects?status=pipeline" },
    { label: "Ongoing", value: counts.ongoing, href: "/admin/projects?status=ongoing" },
    { label: "Completed", value: counts.completed, href: "/admin/projects?status=completed" },
    { label: "Live on site", value: counts.published, href: "/portfolio" },
    { label: "Active team", value: counts.team, href: "/admin/team" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-2">
        Dashboard
      </h1>
      <p className="text-slate-500 mb-8">
        Manage delivery inventory, publish completed work to Selected work, and
        keep the team roster current.
      </p>
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl bg-white border border-slate-200 p-5 hover:border-emerald-200 hover:shadow-md transition-all"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {card.label}
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="rounded-2xl bg-white border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900 mb-2">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects"
            className="rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold"
          >
            Add / edit projects
          </Link>
          <Link
            href="/admin/team"
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Manage team
          </Link>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          Mark a project <strong>completed</strong> and toggle{" "}
          <strong>published</strong> to showcase it on the landing page Selected
          work section.
        </p>
      </div>
    </div>
  );
}
