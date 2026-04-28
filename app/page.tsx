import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPostLoginPath } from "@/lib/permissions";

export default async function Page() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  redirect(getPostLoginPath(session.user.permissions ?? [], session.user.role, session.user.isMasterTenant));
}