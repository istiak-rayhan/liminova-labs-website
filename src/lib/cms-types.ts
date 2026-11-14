export type ProjectStatus = "pipeline" | "ongoing" | "completed";

export type CmsProject = {
  id: string;
  slug: string;
  title: string;
  clientLine: string;
  category: string;
  industry: string;
  year: string;
  featured: boolean;
  status: ProjectStatus;
  published: boolean;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  role: string;
  quotation: string;
  timeline: string;
  partners: string[];
  metrics: { label: string; value: string }[];
  tech: string[];
  images: string[];
  liveUrl?: string;
  updatedAt: string;
};

export type TeamRole = "developer" | "partner" | "operations" | "leadership";

export type CmsTeamMember = {
  id: string;
  name: string;
  role: TeamRole;
  title: string;
  focus: string;
  active: boolean;
  updatedAt: string;
};

export type CmsStore = {
  version: 1;
  projects: CmsProject[];
  team: CmsTeamMember[];
  updatedAt: string;
};
