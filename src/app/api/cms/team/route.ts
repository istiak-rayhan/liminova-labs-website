import { NextResponse } from "next/server";
import { canManageTeam } from "@/lib/access";
import { getAdminSession, hashPassword } from "@/lib/auth";
import { deleteTeamMember, getCmsStore, toPublicTeamMember, upsertTeamMember } from "@/lib/cms";
import type { CmsTeamMember, TeamRole } from "@/lib/cms-types";

const roles = new Set<TeamRole>(["leadership", "operations", "partner", "developer"]);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || !canManageTeam(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as CmsTeamMember & { password?: string };
    if (!body.id || !body.name || !roles.has(body.role)) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const email = body.email?.trim().toLowerCase() ?? "";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    const password = body.password?.trim() ?? "";
    if (password && password.length < 8) {
      return NextResponse.json({ error: "Password needs at least 8 characters." }, { status: 400 });
    }

    const store = await getCmsStore();
    if (email && store.team.some((member) => member.id !== body.id && member.email === email)) {
      return NextResponse.json({ error: "That email is already used." }, { status: 400 });
    }
    const existing = store.team.find((member) => member.id === body.id);
    const passwordHash = password ? hashPassword(password) : existing?.passwordHash;

    const saved = await upsertTeamMember({
      id: body.id,
      name: body.name.trim(),
      role: body.role,
      title: body.title?.trim() ?? "",
      focus: body.focus?.trim() ?? "",
      active: Boolean(body.active),
      email: email || undefined,
      passwordHash,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(toPublicTeamMember(saved));
  } catch {
    return NextResponse.json({ error: "Failed to save teammate." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session || !canManageTeam(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await deleteTeamMember(id);
  return NextResponse.json({ ok: true });
}
