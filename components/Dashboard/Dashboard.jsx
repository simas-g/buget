"use client";

import { useEffect, useMemo } from "react";
import SharedNav from "./SharedNav";
import { useFetch } from "@/app/hooks/useFetch";
import Connected from "./Connected";
import { fetchMonthlySummary, getToken, listAccounts } from "@/app/util/http";
import { useDispatch } from "react-redux";
import { summaryActions, userActions } from "./userStore";
import LeftSidebar from "./LeftSidebar";
import Summary from "./Summary";
import Categories from "./Categories";
import CategorizedTransactions from "./CategorizedTransactions";
import { useQuery } from "@tanstack/react-query";
import { getCurrentMonthDate, getPreviousMonthDate } from "@/app/util/format";
export default function Dashboard({ user, sessionId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !sessionId) return;
    dispatch(userActions.setUser({ userId: user._id, sessionId }));
  }, [user, sessionId]);

  const fetchToken = useMemo(() => {
    if (!sessionId) return null;
    return () => getToken(sessionId);
  }, [sessionId]);
  const {
    data: monthSummary,
    isLoading: loadingSummary,
    refetch,
  } = useQuery({
    queryKey: ["summary", user.id],
    queryFn: async () => fetchMonthlySummary(user?._id, getCurrentMonthDate()),
  });
  const { data: prevMonthSummary } = useQuery({
    queryKey: ["summary", user.id, getPreviousMonthDate()],
    queryFn: async () => fetchMonthlySummary(user?._id, getPreviousMonthDate()),
  });
  useEffect(() => {
    if (!monthSummary || !prevMonthSummary) {
      return;
    }
    dispatch(summaryActions.setSummary({ summary: monthSummary, lastSummary: prevMonthSummary }));

    sessionStorage.setItem("monthlySummary", JSON.stringify({ summary: monthSummary, lastSummary: prevMonthSummary }));
  }, [monthSummary, prevMonthSummary]);
  const { data: token } = useFetch(fetchToken, !!sessionId);

  const shouldFetchAccounts = !!token;

  const fetchAccounts = useMemo(() => {
    if (!token || !sessionId) return null;
    return () => listAccounts(token, sessionId);
  }, [token, sessionId]);

  useFetch(fetchAccounts, shouldFetchAccounts);

  return (
    <div className="bg-dark-backgroud flex min-h-screen">
      <LeftSidebar />
      <div className="w-full max-w-7xl">
        <SharedNav />
        <div className="flex flex-col gap-4 p-4">
          <section className="flex gap-4 sm:flex-row flex-col">
            <Summary type="main" change={10} total={12299} />
            <div className="flex gap-4 flex-wrap flex-col sm:w-[40%]">
              <Summary type="month-in" />
              <Summary type="month-out" />
            </div>
          </section>
          <div className="flex w-full gap-4 flex-wrap lg:flex-nowrap">
            <Categories />
            <CategorizedTransactions/>
          </div>
          <Connected />
        </div>
      </div>
    </div>
  );
}
