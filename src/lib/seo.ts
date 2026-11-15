import type { Metadata } from "next";
import { site } from "@/data/site";

export function pageMetadata(
  path: string,
  title: string,
  description: string,
): Metadata {
  const canonical = path === "/" ? "/" : path;
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: site.name,
      type: "website",
    },
  };
}
