import { redirect } from "next/navigation";
import { auth } from "@/auth";
import RegistrationPageClient from "@/features/registration/RegistrationPageClient";
import { canAccessDashboard, canAccessRegistration } from "@/lib/permissions";

export default async function RegistrationPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const permissions = session.user.permissions ?? [];
  if (!canAccessRegistration(permissions)) {
    if (canAccessDashboard(permissions)) {
      redirect("/dashboard");
    }
    redirect("/no-access");
  }

  return <RegistrationPageClient />;
}
