import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      <AdminNav email={session.email} />
      <div className="flex-1 min-w-0 p-6 lg:p-10">{children}</div>
    </div>
  );
}
