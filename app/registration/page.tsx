import { redirect } from "next/navigation";
import { auth } from "@/auth";
import RegistrationPageClient from "@/features/registration/RegistrationPageClient";

export default async function RegistrationPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return <RegistrationPageClient />;
}
