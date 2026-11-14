import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

type Props = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { path } = await params;
  const pathname = path.join("/");
  if (!pathname || pathname.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Media store unavailable" }, { status: 404 });
  }

  try {
    const result = await get(pathname, { access: "private", useCache: true });
    if (!result || result.statusCode !== 200 || !result.stream) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const headers = new Headers();
    headers.set("Content-Type", result.blob.contentType || "application/octet-stream");
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    return new NextResponse(result.stream, { headers });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
