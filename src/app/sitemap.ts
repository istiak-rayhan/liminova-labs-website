import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/cms";
import { services } from "@/data/services";
import { site } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/portfolio",
    "/services",
    "/book",
    "/faq",
    "/privacy",
    "/terms",
  ].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/services" || path === "/portfolio" ? 0.9 : 0.6,
    }),
  );

  const published = await getPublishedProjects();
  const projectRoutes = published.map((project) => ({
    url: `${site.url}/portfolio/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes, ...serviceRoutes];
}
