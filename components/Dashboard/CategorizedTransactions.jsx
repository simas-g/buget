"use client";
import { Book, Plus } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import Transaction from "./Transaction";
import Button from "../UI/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchCategorizedTransactions } from "@/app/util/http";
import { useSelector } from "react-redux";
import Loading from "../UI/Loading";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";
import Link from "next/link";

export default function Categorized() {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  if (typeof window === "undefined") {
    return;
  }
  const user = useSelector((state) => state.user);
  const { data: cTransactions, isLoading } = useQuery({
    queryFn: async () => fetchCategorizedTransactions(user.userId, 5),
    queryKey: ["categorized", user.userId],
    enabled: !!user.userId,
  });
  console.log(cTransactions, "ttt");
  return (
    <BoxWrapper className="flex flex-col p-6 w-full overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${currentTheme.orbPrimary} to-transparent rounded-full blur-3xl -mr-20 -mt-20`} />
      <div className="flex flex-wrap gap-4 justify-between items-center mb-6 relative z-10">
        <h5 className={`text-xl font-bold flex items-center gap-3 ${currentTheme.textPrimary}`}>
          <div className={`p-2 rounded-lg ${currentTheme.iconBg}`}>
            <Book size={24} stroke="var(--color-secondary)" />
          </div>
          <span>Kategorizuotos operacijos</span>
        </h5>
        <Link href="/skydelis/operacijos">
          <Button variant="outline" className={`px-4 py-2 ${currentTheme.buttonHover} transition-colors`}>
            <span>Valdyti</span>
          </Button>
        </Link>
      </div>
      {cTransactions?.length === 0 && !isLoading && user.userId && (
        <p className={`${currentTheme.textMuted} text-sm relative z-10`}>Kategorizuotų operacijų nėra</p>
      )}

      <ul className={`space-y-3 relative z-10`}>
        {Array.isArray(cTransactions) && cTransactions.map((op) => (
          <li key={op.transactionId}>
            <Transaction type="categorized" operation={op} />
          </li>
        ))}
      </ul>
      {isLoading && <Loading />}
    </BoxWrapper>
  );
}
