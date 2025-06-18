import Dashboard from "@/components/UI/Dashboard/Dashboard";
import { getFullUser } from "../lib/auth/currentUser";

export default async function Page() {
  const userObject = await getFullUser();
  if(!userObject) {
    return null
  }
  const { user } = userObject;
  return (
    <div>
      <Dashboard user={user} />
    </div>
  );
}
