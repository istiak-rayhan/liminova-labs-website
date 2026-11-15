import LeadBoard from "@/components/admin/LeadBoard";
import { getCmsStore } from "@/lib/cms";

export default async function AdminLeadsPage() {
  const store = await getCmsStore();
  const leads = [...(store.leads ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return <LeadBoard initialLeads={leads} />;
}
