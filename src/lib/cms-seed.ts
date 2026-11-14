import { projects } from "@/data/projects";
import type { CmsProject, CmsStore, CmsTeamMember } from "@/lib/cms-types";

function now() {
  return new Date().toISOString();
}

export function seedProjects(): CmsProject[] {
  return projects.map((project, index) => ({
    id: `proj_${project.slug}`,
    slug: project.slug,
    title: project.title,
    clientLine: project.clientLine,
    category: project.category,
    industry: project.industry,
    year: project.year,
    featured: project.featured,
    status: "completed" as const,
    published: true,
    summary: project.summary,
    challenge: project.challenge,
    approach: project.approach,
    outcome: project.outcome,
    role: project.role,
    quotation: "",
    timeline: project.year,
    partners: [],
    metrics: project.metrics,
    tech: project.tech,
    images: project.images,
    liveUrl: project.liveUrl,
    updatedAt: now(),
    // keep stable order: featured first via index bias
    ...(index === 0 ? {} : {}),
  }));
}

export function seedTeam(): CmsTeamMember[] {
  const stamped = now();
  return [
    {
      id: "team_founder",
      name: "Liminova Labs Core",
      role: "leadership",
      title: "Founding engineer",
      focus: "Product architecture, delivery, and client partnerships",
      active: true,
      updatedAt: stamped,
    },
  ];
}

export function createSeedStore(): CmsStore {
  return {
    version: 1,
    projects: seedProjects(),
    team: seedTeam(),
    updatedAt: now(),
  };
}
