import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminControlCenterPageClient from "@/features/admin/AdminControlCenterPageClient";
import { canAccessAdminPanel } from "@/lib/permissions";

export default async function AdminPanelPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const permissions = session.user.permissions ?? [];
  if (!canAccessAdminPanel(session.user.role, permissions, session.user.isMasterTenant)) {
    redirect("/no-access");
  }

  return (
    <AdminControlCenterPageClient
      permissions={permissions}
      isMasterTenant={session.user.isMasterTenant === true}
      ownTenantDomain={session.user.tenantDomain ?? ""}
    />
  );
}
