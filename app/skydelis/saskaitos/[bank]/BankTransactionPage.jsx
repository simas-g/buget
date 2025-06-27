"use client";

import { formatDate } from "@/app/util/format";
import { getBankData } from "@/app/util/http";
import Transaction from "@/components/Dashboard/Transaction";
import Button from "@/components/UI/Button";
import { useQuery } from "@tanstack/react-query";
import { Recycle, RefreshCw } from "lucide-react";
import Loading from "@/components/UI/Loading"
const BankTransactionPage = ({ id }) => {
  async function getTransactions() {
    const token = JSON.parse(sessionStorage.getItem("access_token")).data
      .access;
    const res = await fetch(`/api/getInitialTransactions?id=${id}`, {
      headers: {
        "Banking-Token": token,
      },
    });
    if (!res.ok || res.status === 404) {
      return null
    }
    const data = await res.json();
    return data;
  }
  const {
    data: dataB,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bankId", id],
    queryFn: async () => getBankData(id),
    enabled: typeof window !== "undefined" && !!id,
  });
  const {
    data: dataT,
    isLoading: isLoadingT,
    errorT,
  } = useQuery({
    queryKey: ["transactions", id],
    queryFn: async () => getTransactions(),
    enabled: typeof window !== "undefined",
  });

  const bank = dataB?.bank;
  const transactions = dataT?.availableTransactions;
  return (
    <section className="h-full pb-4 min-h-screen w-full bg-[#0A0A20]">
      <div className="text-white text-xl flex border-b p-4 max-w-5xl m-auto">
        <div className="flex items-center gap-4 w-full ">
          <img className="w-20 h-20" src={bank?.logo} alt="" />
          <h1 className="text-4xl font-bold">{bank?.name}</h1>
        </div>
        <div className=" w-full flex flex-col justify-center items-end gap-2">
          <Button variant="outline" className="px-4 py-2 w-fit flex gap-3">
            Atnaujinti
            <RefreshCw size={28} stroke="var(--color-secondary)" />
          </Button>
          <span className="text-sm">liko 4 šią dieną</span>
        </div>
      </div>
      <div className="flex gap-2 max-w-5xl m-auto flex-col">
        <div className="flex text-white gap-2 p-4">
          <p className="text-sm text-whites">Paskutinį kartą atnaujinta: </p>
          <span className="text-sm text-gray-400">
            {bank?._lastFetched || formatDate(new Date())}
          </span>
        </div>

        <ul className="space-y-3 text-white px-4 m-auto w-full">
          {isLoadingT === true ? (<Loading/>) : (transactions?.map((t) => (
            <Transaction key={t.transactionId} operation={t} type="uncategorized" />)
          ))}
        </ul>
      </div>
    </section>
  );
};

export default BankTransactionPage;
