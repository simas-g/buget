'use client'
import TransactionsPage from "./TransactionsPage";
import QueryWrapper from "@/app/lib/QueryWrapper";
import ClientLayoutWrapper from "@/app/lib/ClientLayoutWrapper";
import DashboardBackground from "@/components/Dashboard/DashboardBackground";
import { getClientUser } from "@/app/util/http";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "@/components/Dashboard/userStore";
import { isTestMode, getTestUser } from "@/app/lib/testMode";
import TestModeBanner from "@/components/UI/TestModeBanner";

export default () => {
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
        dispatch(userActions.setUser({ userId: user._id, sessionId }));
      }
    };
    loadUser();
  }, [dispatch]);

  return (
    <QueryWrapper>
      <ClientLayoutWrapper>
        <DashboardBackground>
          <div className="flex min-h-screen relative">
            <div className="w-full flex flex-col relative z-10">
              <TestModeBanner />
              <TransactionsPage />
            </div>
          </div>
        </DashboardBackground>
      </ClientLayoutWrapper>
    </QueryWrapper>
  );
}

