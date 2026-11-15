import LeadBoard from "@/components/admin/LeadBoard";
import { canManageTeam } from "@/lib/access";
import { getCmsStore } from "@/lib/cms";
import { requireArea } from "@/lib/guard";

export default async function AdminLeadsPage() {
  const session = await requireArea("leads");
  const store = await getCmsStore();
  const leads = [...(store.leads ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return <LeadBoard initialLeads={leads} canDelete={canManageTeam(session.role)} />;
}
