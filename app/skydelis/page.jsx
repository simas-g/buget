import Dashboard from "@/components/UI/Dashboard/Dashboard";
import { getFullUser } from "../lib/auth/currentUser";
import { notFound } from "next/navigation";

export default async function Page() {
  const userObject = await getFullUser();
  if(!userObject) {
    notFound()
  }
  const { user } = userObject;
  return (
    <div>
      <Dashboard user={user} />
    </div>
  );
}
