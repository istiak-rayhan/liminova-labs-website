import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/login");

  return (
    <div className="h-dvh overflow-hidden bg-slate-100 flex flex-col lg:flex-row">
      <AdminNav email={session.email} role={session.role} />
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto p-6 lg:p-10">{children}</div>
    </div>
  );
}
