"use client";
import Dashboard from "@/components/Dashboard/Dashboard";
import { notFound } from "next/navigation";
import ClientLayoutWrapper from "@/app/lib/ClientLayoutWrapper";
import QueryProvider from "../lib/QueryWrapper";
import { getClientUser } from "../util/http";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { summaryActions, userActions } from "@/components/Dashboard/userStore";

export default function Page() {
  const dispatch = useDispatch();
  useEffect(() => {
    async function getUser() {
      const userObject = await getClientUser();
      const { user, sessionId } = userObject;
      if (!user || !sessionId) return;
      dispatch(userActions.setUser({ userId: user._id, sessionId }));
    }
    getUser();
  }, []);

  return (
    <div className="min-h-screen w-full text-white">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[5%] left-[5%] h-[300px] w-[300px] rounded-full bg-[#2563EB]/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-[#EB2563]/10 blur-[100px]" />
        <div className="absolute top-[60%] left-[70%] h-[250px] w-[250px] rounded-full bg-[#63EB25]/10 blur-[100px]" />
      </div>
      <QueryProvider>
        <ClientLayoutWrapper>
          <Dashboard />
        </ClientLayoutWrapper>
      </QueryProvider>
    </div>
  );
}
