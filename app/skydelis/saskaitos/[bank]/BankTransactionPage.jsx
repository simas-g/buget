"use client";

import { formatDate } from "@/app/util/format";
import { fetchBankDetails, getBankData } from "@/app/util/http";
import Transaction from "@/components/Dashboard/Transaction";
import Button from "@/components/UI/Button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import Loading from "@/components/UI/Loading";
import { useState, useEffect } from "react";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";
import DashboardBackground from "@/components/Dashboard/DashboardBackground";
import SharedNav from "@/components/Dashboard/SharedNav";
const BankTransactionPage = ({ id }) => {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;

  const [token, setToken] = useState(null);
  const [loadingNewT, setLoadingNewT] = useState(false);
  const [error, setError] = useState({});
  
  const getGoCardlessToken = async () => {
    const tokenData = sessionStorage.getItem("access_token");
    if (tokenData) {
      try {
        const parsed = JSON.parse(tokenData);
        return parsed?.data?.access;
      } catch (e) {
        console.error("Failed to parse access token:", e);
      }
    }
    
    try {
      const res = await fetch("/api/go/goCardLessToken");
      if (!res.ok) throw new Error("Failed to fetch token");
      const data = await res.json();
      sessionStorage.setItem("access_token", JSON.stringify(data));
      return data?.data?.access;
    } catch (error) {
      console.error("Error fetching GoCardless token:", error);
      return null;
    }
  };
  useEffect(() => {
    const initializeToken = async () => {
      const goCardlessToken = await getGoCardlessToken();
      setToken(goCardlessToken);
    };
    initializeToken();
  }, []);

  async function getTransactions() {
    const currentToken = token || await getGoCardlessToken();
    if (!currentToken) {
      return;
    }
    const res = await fetch(
      `/api/transactions/getInitialTransactions?id=${id}`,
      {
        headers: {
          "Banking-Token": currentToken,
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
    refetch,
  } = useQuery({
    queryKey: ["transactions", id],
    queryFn: async () => getTransactions(),
    enabled: typeof window !== "undefined",
  });
  const bank = dataB?.bank;
  const transactions = dataT?.availableTransactions || [];
  const handleRefresh = async () => {
    setLoadingNewT(true);
    setError({});
    try {
      const currentToken = token || await getGoCardlessToken();
      if (!currentToken) {
        setError((prev) => ({
          ...prev,
          refreshError: "Nepavyko gauti prieigos rakto",
        }));
        return;
      }
      
      const res = await fetchBankDetails(
        bank._id,
        bank.accountId,
        currentToken,
        bank.userId
      );
      if (res === null) {
        throw new Error("Failed to fetch bank details");
      }
      if (res === "Rate limit exceeded") {
        setError((prev) => ({
          ...prev,
          refreshError: "Per dieną galima atnaujinti 4 kartus",
        }));
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      queryClient.invalidateQueries({ queryKey: ["bankId", id] });
    } catch (error) {
      console.error("Error refreshing transactions:", error);
      setError((prev) => ({
        ...prev,
        refreshError: "Nepavyko atnaujinti",
      }));
    } finally {
      setLoadingNewT(false);
    }
  };

  return (
    <DashboardBackground>
      <div className="min-h-screen relative">
        <SharedNav />
        <section className="h-full pb-4 min-h-screen w-full relative z-10">
          <div className={`${currentTheme.textPrimary} text-xl flex border-b ${currentTheme.navBorder} p-4 max-w-5xl m-auto gap-4 flex-col sm:flex-row`}>
            <div className="flex items-center gap-4 w-full ">
              <img className="w-20 h-20 rounded-xl" src={bank?.logo} alt="" />
              <h1 className={`text-4xl font-bold ${currentTheme.textHeading}`}>{bank?.name}</h1>
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
              <span className="text-xs text-[#EB2563] sm:absolute -bottom-2">
                {error?.refreshError || dataT === "Rate limit exceeded"
                  ? "Per dieną galima atnaujinti 4 kartus"
                  : ""}
              </span>
            </div>
          </div>
          <div className="flex gap-2 max-w-5xl m-auto flex-col">
            <div className={`flex ${currentTheme.textPrimary} gap-2 p-4`}>
              <p className={`text-sm ${currentTheme.textSecondary}`}>Paskutinį kartą atnaujinta: </p>
              <span className={`text-sm ${currentTheme.textMuted}`}>
                {bank && formatDate(bank?.lastFetched)}
              </span>
            </div>

            <ul className={`space-y-3 ${currentTheme.textPrimary} px-4 m-auto w-full`} style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
              {isLoadingT === true ? (
                <Loading />
              ) : (
                transactions?.map((t) => (
                  <Transaction
                    key={t._id}
                    refetch={refetch}
                    id={bank?.userId}
                    operation={t}
                    type="uncategorized"
                  />
                ))
              )}
              {/**test transaction */}
              <Transaction
                    operation={{
                      transactionId: "test_user_001_000_000",
                      amount: 100.00,
                      bookingDate: "2025-01-01",
                      type: "uncategorized",
                      categoryName: "Pajamos",
                    }}
                    type="uncategorized"
                  />
            </ul>
            {!isLoadingT &&
              typeof window !== "undefined" &&
              transactions?.length === 0 && (
                <p className={`${currentTheme.textPrimary} w-full text-center`}>
                  Naujų operacijų nėra
                </p>
              )}
          </div>
        </section>
      </div>
    </DashboardBackground>
  );
};

export default BankTransactionPage;
