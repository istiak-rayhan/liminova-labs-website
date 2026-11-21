import { NextResponse } from "next/server";
import { canEditDelivery, canEditOwnTasks, canManageProjects } from "@/lib/access";
import { getAdminSession } from "@/lib/auth";
import { deleteProject, getCmsStore, upsertProject, withoutCommercial } from "@/lib/cms";
import type { CmsProject, ProjectStatus } from "@/lib/cms-types";

function deliveryStatus(value: ProjectStatus | undefined, current: ProjectStatus): ProjectStatus {
  if (value === "ongoing" || value === "completed") return value;
  return current === "pipeline" ? "ongoing" : current;
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function applyDelivery(existing: CmsProject, body: CmsProject): CmsProject {
  return {
    ...existing,
    title: text(body.title, existing.title),
    slug: text(body.slug, existing.slug),
    clientLine: text(body.clientLine, existing.clientLine),
    category: text(body.category, existing.category),
    industry: text(body.industry, existing.industry),
    year: text(body.year, existing.year),
    featured: typeof body.featured === "boolean" ? body.featured : existing.featured,
    published: typeof body.published === "boolean" ? body.published : existing.published,
    summary: text(body.summary, existing.summary),
    challenge: text(body.challenge, existing.challenge),
    approach: text(body.approach, existing.approach),
    outcome: text(body.outcome, existing.outcome),
    role: text(body.role, existing.role),
    before: text(body.before, existing.before ?? ""),
    after: text(body.after, existing.after ?? ""),
    timeline: text(body.timeline, existing.timeline),
    partners: Array.isArray(body.partners) ? body.partners : existing.partners,
    metrics: Array.isArray(body.metrics) ? body.metrics : existing.metrics,
    tech: Array.isArray(body.tech) ? body.tech : existing.tech,
    images: Array.isArray(body.images) ? body.images : existing.images,
    liveUrl: text(body.liveUrl, existing.liveUrl ?? ""),
    nextAction: text(body.nextAction, existing.nextAction ?? ""),
    tasks: Array.isArray(body.tasks) ? body.tasks : existing.tasks,
    status: deliveryStatus(body.status, existing.status),
    updatedAt: new Date().toISOString(),
  };
}

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
    if (canEditDelivery(session.role)) {
      const store = await getCmsStore();
      const existing = store.projects.find((project) => project.id === body.id);
      if (!existing || existing.status === "pipeline") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const saved = await upsertProject(applyDelivery(existing, body));
      return NextResponse.json(withoutCommercial(saved));
    }
    if (!canEditOwnTasks(session.role) || !session.memberId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const store = await getCmsStore();
    const existing = store.projects.find((project) => project.id === body.id);
    const assigned = existing?.shares?.some((share) => share.memberId === session.memberId);
    if (!existing || !assigned || existing.status === "pipeline") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const saved = await upsertProject({
      ...existing,
      nextAction: body.nextAction ?? existing.nextAction,
      tasks: Array.isArray(body.tasks) ? body.tasks : existing.tasks,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(withoutCommercial(saved));
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
