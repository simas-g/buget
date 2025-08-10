"use client";
import { Book, Plus } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import Transaction from "./Transaction";
import Button from "../UI/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchCategorizedTransactions } from "@/app/util/http";
import { useSelector } from "react-redux";
import Loading from "../UI/Loading";
export default function Categorized() {
  if (typeof window === "undefined") {
    return;
  }
  const user = useSelector((state) => state.user);
  const { data: cTransactions, isLoading } = useQuery({
    queryFn: async () => fetchCategorizedTransactions(user.userId, 5),
    queryKey: ["categorized", user.userId],
  });
  console.log(cTransactions, "ttt");
  return (
    <BoxWrapper className="flex flex-col p-5 w-full">
      <div className="flex flex-wrap gap-4 justify-between">
        <h5 className="text-xl font-bold flex items-center gap-x-2">
          <Book size={24} stroke="var(--color-secondary)" />
          Kategorizuotos operacijos
        </h5>
        <Button variant="outline" className="px-4 py-2">
          <span>Valdyti</span>
        </Button>
      </div>
      {cTransactions?.length === 0 && !isLoading && user.userId && (
        <p className="text-gray-500 text-sm">Kategorizuotų operacijų nėra</p>
      )}

      <ul className={`space-y-3 mt-6`}>
        {cTransactions?.map((op) => (
          <Transaction
            type="categorized"
            operation={op}
          />
        ))}
      </ul>
      {isLoading && <Loading />}
    </BoxWrapper>
  );
}
