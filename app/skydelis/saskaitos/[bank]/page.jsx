import { cookies } from "next/headers";
import BankTransactionPage from "./BankTransactionPage";
import { getUserFromSession, validateToken } from "@/app/lib/auth/session";
import { notFound } from "next/navigation";
import QueryProvider from "@/app/lib/QueryWrapper";
export default async function Page({ params }) {
  const id = (await params).bank;
  if (id.length !== 24) {
    notFound();
  }

  return (
    <QueryProvider>
      <BankTransactionPage id={id} />
    </QueryProvider>
  )
}
