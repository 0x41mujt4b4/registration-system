import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardPageClient from "@/features/dashboard/DashboardPageClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return <DashboardPageClient />;
}