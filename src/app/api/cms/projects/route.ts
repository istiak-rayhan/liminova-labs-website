import { NextResponse } from "next/server";
import { canEditOwnTasks, canManageProjects } from "@/lib/access";
import { getAdminSession } from "@/lib/auth";
import { deleteProject, getCmsStore, upsertProject } from "@/lib/cms";
import type { CmsProject } from "@/lib/cms-types";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as CmsProject;
    if (!body.id || !body.title) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (canManageProjects(session.role)) {
      const saved = await upsertProject({
        ...body,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json(saved);
    }
    if (!canEditOwnTasks(session.role) || !session.memberId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const store = await getCmsStore();
    const existing = store.projects.find((project) => project.id === body.id);
    const assigned = existing?.shares?.some((share) => share.memberId === session.memberId);
    if (!existing || !assigned) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const saved = await upsertProject({
      ...existing,
      nextAction: body.nextAction ?? existing.nextAction,
      tasks: Array.isArray(body.tasks) ? body.tasks : existing.tasks,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Failed to save project." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session || !canManageProjects(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
