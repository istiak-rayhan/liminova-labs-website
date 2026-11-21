import ProjectManager from "@/components/admin/ProjectManager";
import { canEditOwnTasks, canManageProjects, canSeePipeline } from "@/lib/access";
import { getCmsStore, withoutCommercial } from "@/lib/cms";
import { requireArea } from "@/lib/guard";
import type { ProjectStatus } from "@/lib/cms-types";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminProjectsPage({ searchParams }: Props) {
  const session = await requireArea("projects");
  const params = await searchParams;
  const store = await getCmsStore();
  const leadership = canSeePipeline(session.role);
  const requested = ["pipeline", "ongoing", "completed"].includes(params.status ?? "")
    ? (params.status as ProjectStatus)
    : undefined;
  const status = !leadership && requested === "pipeline" ? undefined : requested;
  const manage = canManageProjects(session.role);
  const tasks = canEditOwnTasks(session.role);
  const namedOnly = tasks || session.role === "partner";
  const projects = (leadership ? store.projects : store.projects.filter((project) => project.status !== "pipeline"))
    .filter((project) => !namedOnly || project.shares?.some((share) => share.memberId === session.memberId))
    .map((project) => (leadership ? project : withoutCommercial(project)));

  return (
    <ProjectManager
      initialProjects={projects}
      team={
        leadership
          ? store.team.map((member) => ({
              id: member.id,
              name: member.name,
              role: member.role,
              title: member.title,
              focus: member.focus,
              active: member.active,
              updatedAt: member.updatedAt,
            }))
          : []
      }
      filter={status}
      capability={manage ? "manage" : session.role === "operations" ? "delivery" : tasks ? "tasks" : "view"}
    />
  );
}
