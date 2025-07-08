'use client'
import CategoryPage from "./CategoryPage";
import QueryWrapper from "@/app/lib/QueryWrapper";
import { getClientUser } from "@/app/util/http";
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
    <div className="bg-dark-backgroud min-h-screen w-full">
      <QueryWrapper>
        <CategoryPage />
      </QueryWrapper>
    </div>
  );
}
