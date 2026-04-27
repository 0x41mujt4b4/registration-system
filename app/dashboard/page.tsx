import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardPageClient from "@/features/dashboard/DashboardPageClient";
import { canAccessDashboard, canAccessRegistration } from "@/lib/permissions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const permissions = session.user.permissions ?? [];
  if (!canAccessDashboard(permissions)) {
    if (canAccessRegistration(permissions)) {
      redirect("/registration");
    }
    redirect("/no-access");
  }

  return <DashboardPageClient />;
}