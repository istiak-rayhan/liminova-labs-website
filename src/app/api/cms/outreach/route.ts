import { NextResponse } from "next/server";
import { canManageOutreach } from "@/lib/access";
import { getAdminSession } from "@/lib/auth";
import { createOutreach, deleteOutreach, updateOutreach } from "@/lib/cms";
import { sanitizeOutreach } from "@/lib/outreach";

async function leadershipOnly() {
  const session = await getAdminSession();
  if (!session || !canManageOutreach(session.role)) return null;
  return session;
}

export async function POST(request: Request) {
  if (!(await leadershipOnly())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const draft = sanitizeOutreach(body);
  if ("error" in draft) {
    return NextResponse.json({ error: draft.error }, { status: 400 });
  }

  if (body.id) {
    if (typeof body.id !== "string") {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }
    const saved = await updateOutreach(body.id, draft);
    if (!saved) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    return NextResponse.json(saved);
  }

  const created = await createOutreach(draft);
  return NextResponse.json(created);
}

export async function DELETE(request: Request) {
  if (!(await leadershipOnly())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await deleteOutreach(id);
  return NextResponse.json({ ok: true });
}
