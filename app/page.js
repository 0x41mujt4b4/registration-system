import Dashboard from "@/app/dashboard/page";
// import Hero from "@/app/components/hero";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import Loading from "./components/loading";

export default async function Page() {
  const session = await getServerSession(options);
  return (
    <main className="">
      {
      !session ? <Loading /> : <Dashboard />
      }
    </main>
  );
}