import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessAdminPanel, canAccessDashboard, canAccessRegistration, getPostLoginPath } from "@/lib/permissions";
import Logout from "../components/logout";

export default async function NoAccessPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const permissions = session.user.permissions ?? [];
  if (
    canAccessDashboard(permissions) ||
    canAccessRegistration(permissions) ||
    canAccessAdminPanel(session.user.role, permissions, session.user.isMasterTenant)
  ) {
    redirect(getPostLoginPath(permissions, session.user.role, session.user.isMasterTenant));
  }

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-16 text-center">
      <h1 className="text-xl font-semibold text-slate-800">No access assigned</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your account is signed in but has neither <code className="rounded bg-slate-100 px-1">students:read</code> nor{" "}
        <code className="rounded bg-slate-100 px-1">students:create</code> nor the required admin permissions
        (<code className="rounded bg-slate-100 px-1">users:read</code>,{" "}
        <code className="rounded bg-slate-100 px-1">tenants:read</code>). Ask an administrator to update your permissions.
      </p>
      <ul className="mt-6 flex list-none justify-center p-0">
        <Logout />
      </ul>
    </main>
  );
}
