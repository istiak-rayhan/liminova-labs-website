import TeamManager from "@/components/admin/TeamManager";
import { getCmsStore } from "@/lib/cms";

export default async function AdminTeamPage() {
  const store = await getCmsStore();
  return <TeamManager initialTeam={store.team} />;
}
