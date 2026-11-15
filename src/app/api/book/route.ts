import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { createLead, getCmsStore } from "@/lib/cms";
import { rateLimit } from "@/lib/rate-limit";
import { findSlot } from "@/lib/slots";
import { site } from "@/data/site";

const bookSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  company: z.string().trim().min(1).max(120),
  note: z.string().trim().max(1000).optional().default(""),
  slotId: z.string().min(8).max(40),
  website: z.string().max(0).optional(),
});

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const limited = rateLimit(`book:${clientKey(request)}`);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (body && typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form and try again." },
      { status: 400 },
    );
  }

  const slot = findSlot(parsed.data.slotId);
  if (!slot) {
    return NextResponse.json({ error: "That time is no longer open. Pick another." }, { status: 409 });
  }

  const store = await getCmsStore();
  const taken = (store.leads ?? []).some(
    (lead) => lead.message.includes(`Slot-Id: ${slot.id}`) && lead.stage !== "lost",
  );
  if (taken) {
    return NextResponse.json({ error: "That time was just taken. Pick another." }, { status: 409 });
  }

  const data = parsed.data;
  const message = [
    `Slot: ${slot.label}`,
    `Slot-Id: ${slot.id}`,
    "",
    data.note || "No extra note.",
  ].join("\n");

  await createLead({
    name: data.name,
    email: data.email,
    company: data.company,
    projectType: "Not sure yet",
    budget: "Exploring",
    timeline: "ASAP",
    message,
    stage: "call",
  });

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const inbox = process.env.EMAIL_TO || site.email;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: inbox,
      replyTo: data.email,
      subject: `Call booked: ${data.name} — ${slot.label}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company}\n${message}`,
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      replyTo: site.email,
      subject: `Your Liminova Labs call — ${slot.label}`,
      text: `Hi ${data.name},\n\nYour 30-minute consultation is held for ${slot.label}.\nWe will confirm from ${site.email}.\n\n— ${site.name}`,
    });
  }

  return NextResponse.json({ ok: true, label: slot.label });
}
