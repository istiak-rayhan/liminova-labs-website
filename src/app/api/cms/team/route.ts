import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteTeamMember, upsertTeamMember } from "@/lib/cms";
import type { CmsTeamMember } from "@/lib/cms-types";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as CmsTeamMember;
    if (!body.id || !body.name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const saved = await upsertTeamMember({
      ...body,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Failed to save teammate." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await deleteTeamMember(id);
  return NextResponse.json({ ok: true });
}
