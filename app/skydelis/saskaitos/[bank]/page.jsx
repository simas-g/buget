"use client";
import BankTransactionPage from "./BankTransactionPage";
import { notFound } from "next/navigation";
import QueryProvider from "@/app/lib/QueryWrapper";
import ClientLayoutWrapper from "@/app/lib/ClientLayoutWrapper";
import { use } from "react";

export default ({ params }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.bank;
  
  if (id.length !== 24) {
    notFound();
  }

  return (
    <QueryProvider>
      <ClientLayoutWrapper>
        <BankTransactionPage id={id} />
      </ClientLayoutWrapper>
    </QueryProvider>
  );
}
