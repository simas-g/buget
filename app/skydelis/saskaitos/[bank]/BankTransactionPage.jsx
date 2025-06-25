"use client";
import { useFetch } from "@/app/hooks/useFetch";
import QueryProvider from "@/app/lib/QueryWrapper";
import { formatDate } from "@/app/util/format";
import { getBankData } from "@/app/util/http";
import Button from "@/components/UI/Button";
import { useQuery } from "@tanstack/react-query";
import { Recycle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
const BankTransactionPage = ({ id, sessionId }) => {
  const [transactions, setTransactions] = useState();
  const { data, isLoading, error } = useQuery({
    queryKey: ["bankId", id],
    queryFn: async () => getBankData(id, sessionId.value),
    enabled: typeof window !== "undefined" && !!id && !!sessionId,
  });
  const bank = data?.bank;
  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("access_token")).data
      .access;
    async function getBank() {
      const res = await fetch("/api/getFetchedTransactions", {
        method: "POST",
        body: JSON.stringify({
          id,
          access_token: token,
        }),
        headers: {
          Authorization: "Bearer " + sessionId.value,
        },
      });
      if (!res.ok || res.status === 404) {
        ///manage not-foind
      }
      const data = await res.json();
    }
    getBank();
  }, []);
  return (
    <section className="h-screen w-full bg-[#0A0A20]">
      <div className="text-white text-xl flex border-b p-4 max-w-5xl m-auto">
        <div className="flex items-center gap-4 w-full ">
          <img className="w-20 h-20" src={bank?.logo} alt="" />
          <h1 className="text-4xl font-bold">{bank?.name}</h1>
        </div>
        <div className=" w-full flex flex-col items-end gap-4">
          <Button variant="outline" className="px-4 py-2 w-fit flex gap-3">
            Atnaujinti
            <RefreshCw size={28} stroke="var(--color-secondary)"/>
          </Button>
          <div className="flex gap-2 items-end justify-end">
            <p className="text-sm">Paskutinį kartą atnaujinta: </p>
            <span className="text-sm text-gray-400">
              {bank?._lastFetched || formatDate(new Date())}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BankTransactionPage;
