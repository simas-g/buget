import { cookies } from "next/headers";
import BankTransactionPage from "./BankTransactionPage";
import { getUserFromSession, validateToken } from "@/app/lib/auth/session";
import { notFound } from "next/navigation";
export default async function Page({ params }) {
  const id = (await params).bank;
  if(id.length !== 36){
    notFound()
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("SESSION_KEY");
  const user = getUserFromSession(cookieStore)
  if(!user) {
    notFound()
  }

  return <BankTransactionPage id={id} sessionId={sessionId} />;
}
