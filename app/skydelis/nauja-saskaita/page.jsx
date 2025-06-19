import { ArrowLeft } from "lucide-react";
import PossibleBanks from "./PossibleBanks";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("SESSION_KEY");

  return (
    <div className="w-full flex flex-col items-center px-5 sm:px-20">
      <Link href={'/skydelis'} className="absolute left-4 top-4 md:hidden">
        <ArrowLeft size={32}/>
      </Link>
      <h1 className="font-semibold text-2xl text-center max-w-xl mb-7 pt-20">
        Pasirink banką
      </h1>  
      <div className="w-full max-w-xl pb-10">
        <PossibleBanks sessionId={sessionId} />
      </div>
    </div>
  );
}
