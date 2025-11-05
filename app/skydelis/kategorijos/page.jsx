'use client'
import CategoryPage from "./CategoryPage";
import QueryWrapper from "@/app/lib/QueryWrapper";
import ClientLayoutWrapper from "@/app/lib/ClientLayoutWrapper";
import { getClientUser } from "@/app/util/http";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { summaryActions, userActions } from "@/components/Dashboard/userStore";

export default function Page() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      const userObject = await getClientUser();
      const { user, sessionId } = userObject;
      if (!user || !sessionId) return;
      dispatch(userActions.setUser({ userId: user._id, sessionId }));
    }
    getUser();
  }, []);
  return (
    <QueryWrapper>
      <ClientLayoutWrapper>
        <CategoryPage />
      </ClientLayoutWrapper>
    </QueryWrapper>
  );
}
