import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { addInvestment, addPayout, deleteInvestment, deletePayout, getCmsStore } from "@/lib/cms";
import { memberDue } from "@/lib/finance";

function amountOf(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100) / 100;
}

function dateOf(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return value;
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    kind?: string;
    action?: string;
    id?: string;
    section?: string;
    amount?: unknown;
    date?: unknown;
    note?: string;
    projectId?: string;
    memberId?: string;
  };

  try {
    if (body.kind === "investment" && body.action === "delete" && body.id) {
      await deleteInvestment(body.id);
    } else if (body.kind === "payout" && body.action === "delete" && body.id) {
      await deletePayout(body.id);
    } else if (body.kind === "investment" && body.action === "add") {
      const section = body.section?.trim() ?? "";
      const amount = amountOf(body.amount);
      const date = dateOf(body.date);
      if (!section || !amount || !date) {
        return NextResponse.json({ error: "Section, amount, and date are required." }, { status: 400 });
      }
      await addInvestment({
        section: section.slice(0, 80),
        amount,
        date,
        note: (body.note ?? "").trim().slice(0, 240),
      });
    } else if (body.kind === "payout" && body.action === "add") {
      const amount = amountOf(body.amount);
      const date = dateOf(body.date);
      if (!body.projectId || !body.memberId || !amount || !date) {
        return NextResponse.json({ error: "Project, person, amount, and date are required." }, { status: 400 });
      }
      const store = await getCmsStore();
      const project = store.projects.find((item) => item.id === body.projectId);
      if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
      const due = memberDue(project, body.memberId, store.payouts ?? []);
      if (due.percent <= 0) {
        return NextResponse.json({ error: "This person has no share on that project." }, { status: 400 });
      }
      if (amount > due.remaining + 0.001) {
        return NextResponse.json({ error: "Amount is higher than what is still due." }, { status: 400 });
      }
      await addPayout({
        projectId: body.projectId,
        memberId: body.memberId,
        amount,
        date,
        note: (body.note ?? "").trim().slice(0, 240),
      });
    } else {
      return NextResponse.json({ error: "Unknown ledger action." }, { status: 400 });
    }

    const store = await getCmsStore();
    return NextResponse.json({
      investments: store.investments ?? [],
      payouts: store.payouts ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Could not update the ledger." }, { status: 500 });
  }
}
