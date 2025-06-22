"use client";
import { CreditCard, Plus } from "lucide-react";
import BankConnection from "./BankConnection";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { getConnectedBanks, initializeBankConnection } from "@/app/util/http";
import { useSelector } from "react-redux";
import { useFetch } from "@/app/hooks/useFetch";
const mockData = {
  accounts: [
    {
      id: 1,
      name: "Swedbank",
      balance: 2847.32,
      currency: "EUR",
      lastSync: "2024-01-15T10:30:00Z",
      status: "connected",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "SEB",
      balance: 15420.18,
      currency: "EUR",
      lastSync: "2024-01-15T09:15:00Z",
      status: "connected",
      logo: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Revolut",
      balance: 543.67,
      currency: "EUR",
      lastSync: "2024-01-15T11:00:00Z",
      status: "connected",
      logo: "/placeholder.svg?height=40&width=40",
    },
  ],
  gmail: {
    connected: true,
    email: "simas@gmail.com",
    lastSync: "2024-01-15T11:30:00Z",
    receiptsFound: 23,
    billsFound: 8,
  },
  transactions: [
    {
      id: 1,
      description: "Maxima",
      amount: -45.67,
      category: "Maistas",
      date: "2024-01-15",
      account: "Swedbank",
      type: "expense",
    },
    {
      id: 2,
      description: "Atlyginimas",
      amount: 2500.0,
      category: "Pajamos",
      date: "2024-01-15",
      account: "Swedbank",
      type: "income",
    },
    {
      id: 3,
      description: "Netflix",
      amount: -12.99,
      category: "Pramogos",
      date: "2024-01-14",
      account: "Revolut",
      type: "expense",
    },
    {
      id: 4,
      description: "Elektros sąskaita",
      amount: -89.34,
      category: "Komunaliniai",
      date: "2024-01-14",
      account: "Swedbank",
      type: "expense",
    },
  ],
  analytics: {
    totalBalance: 18811.17,
    monthlyIncome: 2500.0,
    monthlyExpenses: 1247.83,
    savingsRate: 50.1,
    categories: [
      { name: "Maistas", amount: 456.78, percentage: 36.6, color: "#2563EB" },
      {
        name: "Transportas",
        amount: 234.56,
        percentage: 18.8,
        color: "#EB2563",
      },
      { name: "Pramogos", amount: 189.34, percentage: 15.2, color: "#63EB25" },
      {
        name: "Komunaliniai",
        amount: 167.89,
        percentage: 13.4,
        color: "#F59E0B",
      },
      { name: "Kita", amount: 199.26, percentage: 16.0, color: "#8B5CF6" },
    ],
  },
};
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
        console.log('we should be here')
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
    <div className=" gap-8 mb-8 p-8 md:px-16">
      {/* Bank Accounts */}
      <div className="lg:col-span-2">
        <div className="bg-[#1A1A40]/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-[#2563EB]" />
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
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
