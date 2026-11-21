import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { canEditDelivery } from "@/lib/access";
import { getAdminSession } from "@/lib/auth";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || !canEditDelivery(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file." }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, GIF, or AVIF images are allowed." },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 8MB)." }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext)
      ? ext
      : "jpg";
    const filename = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
    const pathname = `project-media/${filename}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(pathname, bytes, {
          access: "public",
          contentType: file.type,
          addRandomSuffix: false,
        });
        return NextResponse.json({ url: blob.url, pathname: blob.pathname });
      } catch {
        // Private stores reject public access — fall through to private + proxy URL
        const blob = await put(pathname, bytes, {
          access: "private",
          contentType: file.type,
          addRandomSuffix: false,
          allowOverwrite: true,
        });
        return NextResponse.json({
          url: `/api/media/${blob.pathname}`,
          pathname: blob.pathname,
        });
      }
    }

    const localDir = path.join(process.cwd(), "public", "projects", "uploads");
    await fs.mkdir(localDir, { recursive: true });
    await fs.writeFile(path.join(localDir, filename), bytes);
    return NextResponse.json({
      url: `/projects/uploads/${filename}`,
      pathname: `projects/uploads/${filename}`,
    });
  } catch {
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
