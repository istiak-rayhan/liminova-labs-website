import { NextResponse } from "next/server";
import { createAdminSession, verifyCredentials, verifyPassword } from "@/lib/auth";
import { getCmsStore } from "@/lib/cms";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }
    if (verifyCredentials(email, password)) {
      await createAdminSession(email, "leadership");
      return NextResponse.json({ ok: true });
    }

    const store = await getCmsStore();
    const member = store.team.find(
      (item) => item.active && item.email?.trim().toLowerCase() === email && item.passwordHash,
    );
    if (!member?.passwordHash || !verifyPassword(password, member.passwordHash)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    await createAdminSession(email, member.role, member.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
