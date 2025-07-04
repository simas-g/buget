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
    const res = await fetch(
      `/api/transactions/getInitialTransactions?id=${id}`,
      {
        headers: {
          "Banking-Token": token,
        },
      }
    );
    const data = await res.json();
    if (res.status === 429) {
      return "Rate limit exceeded";
    }
    return data;
  }
  const { data: dataB, isLoading } = useQuery({
    queryKey: ["bankId", id],
    queryFn: async () => getBankData(id),
    enabled: typeof window !== "undefined" && !!id,
  });
  const {
    data: dataT,
    isLoading: isLoadingT,
    error: errorT,
    refetch
  } = useQuery({
    queryKey: ["transactions", id],
    queryFn: async () => getTransactions(),
    enabled: typeof window !== "undefined",
  });
  const bank = dataB?.bank;
  const transactions = dataT?.availableTransactions || [];
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
            {error?.refreshError || dataT === "Rate limit exceeded"
              ? "Per dieną galima atnaujinti 4 kartus"
              : ""}
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
                refetch={refetch}
                id={bank.userId}
                key={t.transactionId}
                operation={t}
                type="uncategorized"
              />
            ))
          )}
        </ul>
        {!isLoadingT &&
          typeof window !== "undefined" &&
          transactions.length === 0 && (
            <p className="text-white w-full text-center">
              Naujų operacijų nėra
            </p>
          )}
      </div>
    </section>
  );
};

export default BankTransactionPage;
