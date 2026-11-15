import TeamManager from "@/components/admin/TeamManager";
import { getCmsStore, toPublicTeamMember } from "@/lib/cms";
import { requireArea } from "@/lib/guard";

export default async function AdminTeamPage() {
  await requireArea("team");
  const store = await getCmsStore();
  return <TeamManager initialTeam={store.team.map(toPublicTeamMember)} />;
}
