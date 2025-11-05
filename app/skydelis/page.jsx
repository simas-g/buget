"use client";
import Dashboard from "@/components/Dashboard/Dashboard";
import { notFound } from "next/navigation";
import ClientLayoutWrapper from "@/app/lib/ClientLayoutWrapper";
import QueryProvider from "../lib/QueryWrapper";
import { getClientUser } from "../util/http";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { summaryActions, userActions } from "@/components/Dashboard/userStore";
import DashboardBackground from "@/components/Dashboard/DashboardBackground";
import TestModeBanner from "@/components/UI/TestModeBanner";
import { isTestMode, getTestUser } from "../lib/testMode";

export default function Page() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const loadUser = async () => {
      if (isTestMode()) {
        const testUser = getTestUser();
        if (testUser) {
          dispatch(userActions.setUser({ 
            userId: testUser.userId, 
            sessionId: "test_session",
            isTestMode: true 
          }));
        }
      } else {
        const userObject = await getClientUser();
        const { user, sessionId } = userObject;
        if (!user || !sessionId) return;
        dispatch(userActions.setUser({ 
          userId: user._id, 
          sessionId,
          isTestMode: false 
        }));
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <QueryProvider>
      <ClientLayoutWrapper>
        <DashboardBackground>
          <div className="flex min-h-screen relative">
            <div className="w-full flex flex-col relative z-10">
              <TestModeBanner />
              <Dashboard />
            </div>
          </div>
        </DashboardBackground>
      </ClientLayoutWrapper>
    </QueryProvider>
  );
}
