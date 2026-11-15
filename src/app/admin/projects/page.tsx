import ProjectManager from "@/components/admin/ProjectManager";
import { canEditOwnTasks, canManageProjects } from "@/lib/access";
import { getCmsStore } from "@/lib/cms";
import { requireArea } from "@/lib/guard";
import type { CmsProject, ProjectStatus } from "@/lib/cms-types";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

function visibleProject(project: CmsProject, memberId?: string): CmsProject {
  return {
    ...project,
    company: "",
    quotation: "",
    finalizedValue: undefined,
    dealValue: undefined,
    phases: [],
    receipts: [],
    shares: memberId ? (project.shares ?? []).filter((share) => share.memberId === memberId) : [],
  };
}

export default async function AdminProjectsPage({ searchParams }: Props) {
  const session = await requireArea("projects");
  const params = await searchParams;
  const store = await getCmsStore();
  const status = ["pipeline", "ongoing", "completed"].includes(params.status ?? "")
    ? (params.status as ProjectStatus)
    : undefined;
  const manage = canManageProjects(session.role);
  const tasks = canEditOwnTasks(session.role);
  const projects = manage
    ? store.projects
    : store.projects
        .filter((project) => !tasks || project.shares?.some((share) => share.memberId === session.memberId))
        .map((project) => visibleProject(project, tasks ? session.memberId : undefined));

  return (
    <ProjectManager
      initialProjects={projects}
      team={store.team.map((member) => ({
        id: member.id,
        name: member.name,
        role: member.role,
        title: member.title,
        focus: member.focus,
        active: member.active,
        updatedAt: member.updatedAt,
      }))}
      filter={status}
      capability={manage ? "manage" : tasks ? "tasks" : "view"}
    />
  );
}
