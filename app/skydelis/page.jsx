import Dashboard from "@/components/Dashboard/Dashboard";
import { getFullUser } from "../lib/auth/currentUser";
import { notFound } from "next/navigation";

import { cookies } from "next/headers";
import ClientOnly from '@/app/lib/ClientOnly'
export default async function Page() {
  const userObject = await getFullUser();
  if (!userObject) {
    notFound();
  }
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("SESSION_KEY").value;
  const { user } = userObject;
  return (
    <div className="min-h-screen bg-[#0A0A20] text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[5%] left-[5%] h-[300px] w-[300px] rounded-full bg-[#2563EB]/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-[#EB2563]/10 blur-[100px]" />
        <div className="absolute top-[60%] left-[70%] h-[250px] w-[250px] rounded-full bg-[#63EB25]/10 blur-[100px]" />
      </div>
      <ClientOnly fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <Dashboard user={user} sessionId={sessionKey} />
      </ClientOnly>
    </div>
  );
}
