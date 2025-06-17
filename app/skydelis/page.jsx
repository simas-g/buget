import Dashboard from "@/components/UI/Dashboard/Dashboard";
import { getCurrentUser } from "../lib/auth/currentUser";

export default async function Page() {
  const user = await getCurrentUser()
  return (
    <div>
      <Dashboard user={user}/>
    </div>
  );
}
