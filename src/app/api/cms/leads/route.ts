import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteLead, updateLead } from "@/lib/cms";
import type { LeadStage } from "@/lib/cms-types";

const stages = new Set<LeadStage>(["new", "contacted", "call", "proposal", "won", "lost"]);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    stage?: LeadStage;
    notes?: string;
  };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  if (body.stage && !stages.has(body.stage)) {
    return NextResponse.json({ error: "Unknown stage." }, { status: 400 });
  }

  const saved = await updateLead(body.id, {
    ...(body.stage ? { stage: body.stage } : {}),
    ...(typeof body.notes === "string" ? { notes: body.notes } : {}),
  });
  if (!saved) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }
  return NextResponse.json(saved);
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
  await deleteLead(id);
  return NextResponse.json({ ok: true });
}
