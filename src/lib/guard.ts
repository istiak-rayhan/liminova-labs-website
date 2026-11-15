import { redirect } from "next/navigation";
import { getAdminSession, type DashboardSession } from "@/lib/auth";
import { canView, type DashboardArea } from "@/lib/access";

export async function requireArea(area: DashboardArea): Promise<DashboardSession> {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  if (!canView(session.role, area)) redirect("/admin");
  return session;
}
