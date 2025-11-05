"use client";

import { useEffect, useMemo } from "react";
import SharedNav from "./SharedNav";
import { useFetch } from "@/app/hooks/useFetch";
import Connected from "./Connected";
import { fetchMonthlySummary, getToken, listAccounts } from "@/app/util/http";
import { useDispatch, useSelector } from "react-redux";
import { summaryActions, userActions } from "./userStore";
import LeftSidebar from "./LeftSidebar";
import Summary from "./Summary";
import Categories from "./Categories";
import CategorizedTransactions from "./CategorizedTransactions";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMonthDate, getPreviousMonthDate } from "@/app/util/format";
export default function Dashboard() {
  const { userId, sessionId } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const fetchToken = useMemo(() => {
    if (!sessionId || sessionId === "test_session") return null;
    return () => getToken(sessionId);
  }, [sessionId]);
  const {
    data: monthSummary,
    isLoading: loadingSummary,
    refetch,
  } = useQuery({
    queryKey: ["summary", userId, getCurrentMonthDate()],
    queryFn: async () => fetchMonthlySummary(userId, getCurrentMonthDate()),
    enabled: !!userId,
  });
  const { data: prevMonthSummary } = useQuery({
    queryKey: ["summary", userId, getPreviousMonthDate()],
    queryFn: async () => fetchMonthlySummary(userId, getPreviousMonthDate()),
    enabled: !!userId,
  });
  useEffect(() => {
    if (!monthSummary || !prevMonthSummary) {
      return;
    }
    dispatch(
      summaryActions.setSummary({
        summary: monthSummary,
        lastSummary: prevMonthSummary,
      })
    );

    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "monthlySummary",
        JSON.stringify({ summary: monthSummary, lastSummary: prevMonthSummary })
      );
    }
  }, [monthSummary, prevMonthSummary]);
  const { data: token } = useFetch(fetchToken, !!sessionId);

  const shouldFetchAccounts = !!token;

  const fetchAccounts = useMemo(() => {
    if (!token || !sessionId) return null;
    return () => listAccounts(token, sessionId);
  }, [token, sessionId]);

  useFetch(fetchAccounts, shouldFetchAccounts);

  return (
    <>
      <SharedNav />
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
        <section className="flex gap-6 sm:flex-row flex-col">
          <Summary type="main" change={10} total={12299} />
          <div className="flex gap-6 flex-wrap flex-col sm:w-[40%]">
            <Summary type="month-in" />
            <Summary type="month-out" />
          </div>
        </section>
        <div className="flex w-full gap-6 flex-wrap lg:flex-nowrap">
          <Categories />
          <CategorizedTransactions />
        </div>
        <Connected />
      </div>
    </>
  );
}
