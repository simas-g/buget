"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { themes } from "@/app/lib/themes";
import { Settings, Moon, Sun, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteUserSession } from "@/app/lib/auth/session";
import { useFetch } from "@/app/hooks/useFetch";
import Link from "next/link";
import Connected from "./Connected";
import { getToken, listAccounts } from "@/app/util/http";
import { useDispatch } from "react-redux";
import { summaryActions, userActions } from "./userStore";
import LeftSidebar from "./LeftSidebar";
import Summary from "./Summary";
import Categories from "./Categories";
import CategorizedTransactions from "./CategorizedTransactions";
import { useQuery } from "@tanstack/react-query";
export default function Dashboard({ user, sessionId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  async function fetchMonthlySummary() {
    try {
      const res = await fetch("/api/bank/getMonthlySummary?userId=" + user._id);
      if (!res.ok) {
        throw new Error();
      }
      const data = await res.json();

      const { summary } = data;
      return summary;
    } catch (error) {
      console.log(error, "error");
      return null;
    }
  }
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    if (!user || !sessionId) return;
    dispatch(userActions.setUser({ userId: user._id, sessionId }));
  }, [user, sessionId]);

  const fetchToken = useMemo(() => {
    if (!sessionId) return null;
    return () => getToken(sessionId);
  }, [sessionId]);
  const { data: monthSummary, isLoading: loadingSummary, refetch } = useQuery({
    queryKey: ["summary", user.id],
    queryFn: async () => fetchMonthlySummary(),
  });
  useEffect(() => {
    if (!monthSummary) {
      return;
    }
    dispatch(summaryActions.setSummary({summary: monthSummary}));

    sessionStorage.setItem('monthlySummary', JSON.stringify(monthSummary))
  }, [monthSummary]);
  const { data: token } = useFetch(fetchToken, !!sessionId);

  const shouldFetchAccounts = !!token;

  const fetchAccounts = useMemo(() => {
    if (!token || !sessionId) return null;
    return () => listAccounts(token, sessionId);
  }, [token, sessionId]);

  useFetch(fetchAccounts, shouldFetchAccounts);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const logout = async () => {
    await deleteUserSession();
    router.push("/prisijungti");
  };

  const currentTheme = themes[theme];

  return (
    <div className=" flex h-fit">
      <LeftSidebar />
      <div className="w-full max-w-7xl z-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link
              href={"/"}
              className="flex gap-2 items-center bg-[#1A1A40]/50 rounded-lg px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300"
            >
              <Home className="w-4 h-4" />

              <p className="hidden sm:inline">Pradžia </p>
            </Link>
            <div className="flex items-center space-x-4">
              <button className="flex cursor-pointer items-center gap-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Nustatymai</span>
              </button>
              <button
                onClick={logout}
                className="flex cursor-pointer items-center gap-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Atsijungti</span>
              </button>
              <button
                onClick={toggleTheme}
                className={`flex w-16 cursor-pointer p-1 border h-8 rounded-full items-center transition-all duration-300 ${
                  currentTheme.toggleBg
                } ${theme === "light" ? "justify-end" : "justify-start"}`}
              >
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 700, damping: 30 }}
                  className="h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-sm"
                >
                  {theme === "dark" ? (
                    <Moon className="h-3 w-3 text-gray-700" />
                  ) : (
                    <Sun className="h-3 w-3 text-yellow-500" />
                  )}
                </motion.div>
              </button>
              <button className="text-white">{user.name}</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-4">
          <section className="flex gap-4 sm:flex-row flex-col">
            <Summary type="main" change={10} total={12299} />
            <div className="flex gap-4 flex-wrap flex-col sm:w-[40%]">
              <Summary type="month-in"/>
              <Summary type="month-out" />
            </div>
          </section>
          <div className="flex w-full gap-4 flex-wrap lg:flex-nowrap">
            <Categories refetch={refetch} />
            <CategorizedTransactions />
          </div>
          <Connected />
        </div>
      </div>
    </div>
  );
}
