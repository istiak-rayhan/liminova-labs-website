import type { TeamRole } from "@/lib/cms-types";

export type DashboardArea =
  | "overview"
  | "leads"
  | "outreach"
  | "projects"
  | "business"
  | "reports"
  | "team"
  | "search";

export const roleOrder: TeamRole[] = ["leadership", "operations", "partner", "developer"];

export const roleLabels: Record<TeamRole, string> = {
  leadership: "Leadership",
  operations: "Operations",
  partner: "Partner",
  developer: "Developer",
};

export const roleAccess: Record<TeamRole, string> = {
  leadership: "Everything: leads, cold outreach, pipeline, money, reports, and team logins.",
  operations: "Leads, cold outreach, and projects already in progress. No pipeline or money.",
  partner: "See projects you are named on. No leads, pipeline, or money.",
  developer: "Update tasks and the next step on projects assigned to you.",
};

const visible: Record<TeamRole, DashboardArea[]> = {
  leadership: ["overview", "leads", "outreach", "projects", "business", "reports", "team", "search"],
  operations: ["overview", "leads", "outreach", "projects"],
  partner: ["overview", "projects"],
  developer: ["overview", "projects"],
};

export function normalizeRole(role: unknown): TeamRole | null {
  if (role === "admin" || role === "leadership") return "leadership";
  if (role === "operations" || role === "partner" || role === "developer") return role;
  return null;
}

export function canView(role: TeamRole, area: DashboardArea) {
  return visible[role].includes(area);
}

export function canSeeFinance(role: TeamRole) {
  return role === "leadership";
}

export function canSeePipeline(role: TeamRole) {
  return role === "leadership";
}

export function canManageProjects(role: TeamRole) {
  return role === "leadership";
}

export function canEditDelivery(role: TeamRole) {
  return role === "leadership" || role === "operations";
}

export function canEditOwnTasks(role: TeamRole) {
  return role === "developer";
}

export function canEditLeads(role: TeamRole) {
  return role === "leadership" || role === "operations";
}

export function canManageTeam(role: TeamRole) {
  return role === "leadership";
}

export function canManageOutreach(role: TeamRole) {
  return role === "leadership" || role === "operations";
}
