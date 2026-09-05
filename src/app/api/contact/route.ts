import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/data/site";

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const limited = rateLimit(clientKey(request));
    if (!limited.ok) {
      return NextResponse.json(
        { success: false, error: "Too many messages. Try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();

    if (typeof body.website === "string" && body.website.length > 0) {
      return NextResponse.json({ success: true, message: "Received." }, { status: 200 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Invalid submission.";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const data = parsed.data;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Contact form missing EMAIL_USER or EMAIL_PASS");
      return NextResponse.json(
        { success: false, error: "Mail is not configured on this environment." },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const text = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company}`,
      `Project type: ${data.projectType}`,
      `Budget: ${data.budget}`,
      `Timeline: ${data.timeline}`,
      "",
      "Project details:",
      data.message,
    ].join("\n");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: data.email,
      subject: `New Liminova Labs inquiry from ${data.name} (${data.company})`,
      text,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.email,
      replyTo: site.email,
      subject: `We received your brief — ${site.name}`,
      text: `Hi ${data.name},\n\nThanks for writing to ${site.name}. ${site.responseSla}\n\nIf you would rather pick a time, use ${site.url}/book.\n\n— ${site.name}`,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to send email." }, { status: 500 });
  }
}
