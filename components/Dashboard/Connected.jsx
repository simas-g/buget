"use client";
import { CreditCard, Plus } from "lucide-react";
import BankConnection from "./BankConnection";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { getConnectedBanks, initializeBankConnection } from "@/app/util/http";
import { useSelector } from "react-redux";
import { useFetch } from "@/app/hooks/useFetch";
import BoxWrapper from "./BoxWrapper";

export default function Connected() {
  const router = useRouter();
  const navigateToAddConnection = () => {
    router.push("/skydelis/nauja-saskaita");
  };
  const userState = useSelector((state) => state.user);
  const params = useSearchParams();
  ///check for new connections
  useEffect(() => {
    async function checkParamsAndBeginConnection() {
      const error = params.get("error");
      let ref = params.get("ref");
      if (error) {
        return;
      } else if (ref) {
        console.log("we should be here");
        const tempBank = sessionStorage.getItem("temp_bank");
        const res = await initializeBankConnection(
          JSON.parse(sessionStorage.getItem("data")),
          tempBank,
          userState.sessionId
        );
        if (res.ok) {
          // router.push('skydelis')
        }
      }
    }
    checkParamsAndBeginConnection();
  }, [params]);
  const shouldFetch = !!userState.userId && !!userState.sessionId;
  console.log(shouldFetch, userState.userId, userState.sessionId);
  const fetchBanks = useCallback(() => {
    if (!shouldFetch) return;
    return getConnectedBanks(userState.userId, userState.sessionId);
  }, [userState.userId]);

  const { data: banks, isLoading } = useFetch(fetchBanks, shouldFetch);
  console.log(banks, "banks");
  return (
    <BoxWrapper>
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <CreditCard size={24} className="text-[#2563EB]" />
            <span>Sąskaitos</span>
          </h3>
          <button
            onClick={() => navigateToAddConnection()}
            className="flex items-center space-x-2 rounded-lg bg-secondary px-4 py-2 text-white font-medium transition-all cursor-pointer duration-300"
          >
            <Plus className="h-4 w-4" />
            <span>Pridėti</span>
          </button>
        </div>

        <ul className="space-y-4">
          {banks?.data.map((account) => (
            <li key={account.name}>
              <BankConnection
                bank={account.name}
                currentBalance={account.balance}
                lastConnected={account.createdAt}
                logo={account.logo}
                id={account.accountId}
              />
            </li>
          ))}
        </ul>
      </div>
    </BoxWrapper>
  );
}
