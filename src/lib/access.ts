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
  leadership: "Full dashboard. Cold outreach, business, reports, team, and logins included.",
  operations: "Edit projects. Business, reports, and team stay closed.",
  partner: "Work the lead pipeline and view projects. No money pages.",
  developer: "Update tasks on projects assigned to you.",
};

const visible: Record<TeamRole, DashboardArea[]> = {
  leadership: ["overview", "leads", "outreach", "projects", "business", "reports", "team", "search"],
  operations: ["overview", "projects"],
  partner: ["overview", "leads", "projects"],
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

export function canManageProjects(role: TeamRole) {
  return role === "leadership" || role === "operations";
}

export function canEditOwnTasks(role: TeamRole) {
  return role === "developer";
}

export function canEditLeads(role: TeamRole) {
  return role === "leadership" || role === "partner";
}

export function canManageTeam(role: TeamRole) {
  return role === "leadership";
}

export function canManageOutreach(role: TeamRole) {
  return role === "leadership";
}
