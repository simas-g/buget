"use client";
import { CreditCard, Plus } from "lucide-react";
import BankConnection from "./BankConnection";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { getConnectedBanks, initializeBankConnection } from "@/app/util/http";
import { useSelector } from "react-redux";
import { useFetch } from "@/app/hooks/useFetch";
import BoxWrapper from "./BoxWrapper";
import Loading from "../UI/Loading";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function Connected() {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
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
        const tempBank = sessionStorage.getItem("temp_bank");
        // Check if this is a revalidation - use stored bank info if available
        const revalidateBankName = sessionStorage.getItem("revalidate_bank_name");
        if (revalidateBankName && !tempBank) {
          // Use the revalidating bank info
          const revalidateBankLogo = sessionStorage.getItem("revalidate_bank_logo");
          sessionStorage.setItem("temp_bank", JSON.stringify({
            name: revalidateBankName,
            logo: revalidateBankLogo
          }));
        }
        
        // Get encrypted account data from sessionStorage
        const encryptedDataStr = sessionStorage.getItem("data");
        if (!encryptedDataStr) {
          console.error("No account data found in sessionStorage for bank connection");
          // Clear any revalidation flags if data is missing
          sessionStorage.removeItem("revalidate_bank_id");
          sessionStorage.removeItem("revalidate_account_id");
          sessionStorage.removeItem("revalidate_bank_name");
          sessionStorage.removeItem("revalidate_bank_logo");
          return;
        }
        
        let encryptedData;
        try {
          encryptedData = JSON.parse(encryptedDataStr);
        } catch (parseError) {
          console.error("Failed to parse encrypted data from sessionStorage:", parseError);
          return;
        }
        
        const res = await initializeBankConnection(
          encryptedData,
          tempBank || sessionStorage.getItem("temp_bank"),
          userState.sessionId
        );
        if (res.ok) {
          router.push('skydelis')
        }
      }
    }
    checkParamsAndBeginConnection();
  }, [params]);
  const shouldFetch = !!userState.userId && !!userState.sessionId;
  const fetchBanks = useCallback(() => {
    if (!shouldFetch) return;
    return getConnectedBanks(userState.userId, userState.sessionId);
  }, [userState.userId]);

  const { data: banks, isLoading } = useFetch(fetchBanks, shouldFetch);
  return (
    <BoxWrapper className={'p-6 overflow-hidden relative'}>
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${currentTheme.orbAccent} to-transparent rounded-full blur-lg -mr-14 -mt-14`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
      <div className="lg:col-span-2 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${currentTheme.textPrimary} flex items-center gap-3`}>
            <div className={`p-2 rounded-lg ${currentTheme.iconBg}`}>
              <CreditCard size={24} className="text-[#2563EB]" />
            </div>
            <span>Sąskaitos</span>
          </h3>
          <button
            onClick={() => navigateToAddConnection()}
            className={`flex items-center space-x-2 rounded-lg ${currentTheme.buttonPrimary} px-5 py-2.5 text-white font-medium transition-all cursor-pointer duration-150 hover:shadow-lg hover:shadow-secondary/30`}
          >
            <Plus className="h-4 w-4" />
            <span>Pridėti</span>
          </button>
        </div>
        <ul className="space-y-4">
          {isLoading === true ? (
            <Loading />
          ) : (
            Array.isArray(banks?.data) && banks.data.map((account) => (
              <li key={account.name}>
                <BankConnection
                  bank={account.name}
                  currentBalance={account.balance}
                  lastConnected={account.lastFetched}
                  logo={account.logo}
                  id={account._id}
                  accountId={account.accountId}
                  connected={account.connected}
                  validUntil={account.validUntil}
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </BoxWrapper>
  );
}
