import OutreachDesk from "@/components/admin/OutreachDesk";
import { getCmsStore } from "@/lib/cms";
import { requireArea } from "@/lib/guard";

export default async function AdminOutreachPage() {
  await requireArea("outreach");
  const store = await getCmsStore();
  const leads = [...(store.outreach ?? [])].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return <OutreachDesk initialLeads={leads} />;
}
