import ProjectManager from "@/components/admin/ProjectManager";
import { getCmsStore } from "@/lib/cms";
import type { ProjectStatus } from "@/lib/cms-types";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminProjectsPage({ searchParams }: Props) {
  const params = await searchParams;
  const store = await getCmsStore();
  const status = ["pipeline", "ongoing", "completed"].includes(params.status ?? "")
    ? (params.status as ProjectStatus)
    : undefined;

  return <ProjectManager initialProjects={store.projects} filter={status} />;
}
