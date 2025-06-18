import { Search } from "lucide-react";
import PossibleBanks from "./PossibleBanks";
import { cookies } from "next/headers";
export default async function Page() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("SESSION_KEY")
  return (
    <div className="h-screen p-20 gap-">
      <h1 className="font-bold text-3xl text-center">Pasirink banką</h1>
      <div className="border rounded-xl flex items-center p-3 gap-2 max-w-xl m-auto">
        <Search/>
        <input className="outline-none w-full" type="text" />
      </div>
      <div>
        <PossibleBanks sessionId={sessionId}/>
      </div>
    </div>
  );
}
