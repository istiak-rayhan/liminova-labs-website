import type { CmsStore, LeadStage, ProjectStatus } from "@/lib/cms-types";

export const leadStages: { id: LeadStage; label: string }[] = [
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "call", label: "Call booked" },
  { id: "proposal", label: "Proposal" },
  { id: "won", label: "Won" },
  { id: "lost", label: "Lost" },
];

const DAY = 24 * 60 * 60 * 1000;

export function buildReport(store: CmsStore, now = Date.now()) {
  const leads = store.leads ?? [];
  const projects = store.projects ?? [];

  const byStage = Object.fromEntries(
    leadStages.map((stage) => [stage.id, leads.filter((lead) => lead.stage === stage.id).length]),
  ) as Record<LeadStage, number>;

  const last30 = leads.filter((lead) => now - new Date(lead.createdAt).getTime() <= 30 * DAY);
  const prev30 = leads.filter((lead) => {
    const age = now - new Date(lead.createdAt).getTime();
    return age > 30 * DAY && age <= 60 * DAY;
  });

  const closed = byStage.won + byStage.lost;
  const winRate = closed === 0 ? null : byStage.won / closed;

  const openProjects = projects.filter((project) => project.status !== "completed");
  const pipelineValue = openProjects.reduce((sum, project) => sum + (project.dealValue || 0), 0);

  const byStatus = {
    pipeline: projects.filter((project) => project.status === "pipeline").length,
    ongoing: projects.filter((project) => project.status === "ongoing").length,
    completed: projects.filter((project) => project.status === "completed").length,
  } satisfies Record<ProjectStatus, number>;

  const typeCounts = new Map<string, number>();
  for (const lead of leads) {
    typeCounts.set(lead.projectType, (typeCounts.get(lead.projectType) ?? 0) + 1);
  }
  const byProjectType = [...typeCounts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);

  const nextActions = openProjects
    .filter((project) => project.nextAction?.trim())
    .map((project) => ({
      id: project.id,
      title: project.title,
      status: project.status,
      nextAction: project.nextAction!.trim(),
    }));

  const openTasks = openProjects.flatMap((project) =>
    (project.tasks ?? [])
      .filter((task) => !task.done)
      .map((task) => ({
        projectId: project.id,
        projectTitle: project.title,
        taskId: task.id,
        title: task.title,
      })),
  );

  return {
    leads: leads.length,
    last30: last30.length,
    prev30: prev30.length,
    byStage,
    winRate,
    byStatus,
    published: projects.filter((project) => project.published && project.status === "completed").length,
    pipelineValue,
    byProjectType,
    nextActions,
    openTasks,
    recentLeads: [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6),
  };
}
