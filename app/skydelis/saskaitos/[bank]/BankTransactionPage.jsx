"use client";

import { formatDate } from "@/app/util/format";
import { fetchBankDetails, getBankData } from "@/app/util/http";
import Transaction from "@/components/Dashboard/Transaction";
import Button from "@/components/UI/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Recycle, RefreshCw } from "lucide-react";
import Loading from "@/components/UI/Loading";
import { useState } from "react";
const BankTransactionPage = ({ id }) => {
  const queryClient = useQueryClient();

  let token;
  const [loadingNewT, setLoadingNewT] = useState(false);
  const [error, setError] = useState({});
  if (typeof window !== "undefined") {
    token = JSON.parse(sessionStorage.getItem("access_token")).data.access;
  }
  async function getTransactions() {
    if (!token) {
      return;
    }
    const res = await fetch(`/api/getInitialTransactions?id=${id}`, {
      headers: {
        "Banking-Token": token,
      },
    });
    if (!res.ok || res.status === 404) {
      return null;
    }
    const data = await res.json();
    return data;
  }
  const { data: dataB, isLoading } = useQuery({
    queryKey: ["bankId", id],
    queryFn: async () => getBankData(id),
    enabled: typeof window !== "undefined" && !!id,
  });
  const { data: dataT, isLoading: isLoadingT } = useQuery({
    queryKey: ["transactions", id],
    queryFn: async () => getTransactions(),
    enabled: typeof window !== "undefined",
  });
  const bank = dataB?.bank;
  const transactions = dataT?.availableTransactions;
  const handleRefresh = async () => {
    setLoadingNewT(true);
    try {
      const res = await fetchBankDetails(bank._id, bank.accountId, token);
      if (res === null) {
        throw new Error();
      }
      if (res === "Rate limit exceeded") {
        setError((prev) => ({
          ...prev,
          refreshError: "Per dieną galima atnaujinti 4 kartus",
        }));
      }
      queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      queryClient.invalidateQueries({ queryKey: ["bankId", id] });
    } catch (error) {
      setError((prev) => ({
        ...prev,
        refreshError: "Nepavyko atnaujinti",
      }));
    } finally {
      setLoadingNewT(false);
    }
  };

  return (
    <section className="h-full pb-4 min-h-screen w-full bg-[#0A0A20]">
      <div className="text-white text-xl flex border-b p-4 max-w-5xl m-auto gap-4 flex-col sm:flex-row">
        <div className="flex items-center gap-4 w-full ">
          <img className="w-20 h-20" src={bank?.logo} alt="" />
          <h1 className="text-4xl font-bold">{bank?.name}</h1>
        </div>
        <div className=" w-full relative flex flex-col justify-center sm:items-end gap-2">
          <Button
            onClick={async () => handleRefresh()}
            variant="outline"
            className="px-4 py-2 w-fit flex gap-3"
          >
            Atnaujinti
            <RefreshCw
              className={`${loadingNewT === true && "animate-spin"}`}
              size={28}
              stroke="var(--color-secondary)"
            />
          </Button>
          <span className="text-xs text-accent sm:absolute -bottom-2">
            {error?.refreshError}
          </span>
        </div>
      </div>
      <div className="flex gap-2 max-w-5xl m-auto flex-col">
        <div className="flex text-white gap-2 p-4">
          <p className="text-sm text-whites">Paskutinį kartą atnaujinta: </p>
          <span className="text-sm text-gray-400">
            {bank && formatDate(bank?.lastFetched)}
          </span>
        </div>

        <ul className="space-y-3 text-white px-4 m-auto w-full">
          {isLoadingT === true ? (
            <Loading />
          ) : (
            transactions?.map((t) => (
              <Transaction
                key={t.transactionId}
                operation={t}
                type="uncategorized"
              />
            ))
          )}
        </ul>
      </div>
    </section>
  );
};

export default BankTransactionPage;
