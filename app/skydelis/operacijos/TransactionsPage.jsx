"use client";
import { formatCurrency, getCurrentMonthDate } from "@/app/util/format";
import { fetchMonthlySummary, fetchCategorizedTransactions } from "@/app/util/http";
import SharedNav from "@/components/Dashboard/SharedNav";
import Button from "@/components/UI/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Receipt, Calendar, ChevronLeft, ChevronRight, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import BoxWrapper from "@/components/Dashboard/BoxWrapper";
import Loading from "@/components/UI/Loading";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  const { userId } = useSelector((state) => state.user);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthDate());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const queryClient = useQueryClient();

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["summary", userId, selectedMonth],
    queryFn: async () => fetchMonthlySummary(userId, selectedMonth),
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["categorized", userId],
    queryFn: async () => fetchCategorizedTransactions(userId),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ transactionId, categoryName, amount, oldCategoryName, bookingDate }) => {
      const month = bookingDate.slice(0, 7);
      
      const res = await fetch("/api/category/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: categoryName,
          month,
          amount,
          transactionId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update category");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categorized", userId]);
      queryClient.invalidateQueries(["summary", userId, selectedMonth]);
      setEditingTransaction(null);
      setSelectedCategory("");
    },
  });

  const categories = summaryData ? Object.keys(summaryData.categories) : [];

  const formatMonthDisplay = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' });
  };

  const navigateMonth = (direction) => {
    const [year, month] = selectedMonth.split('-').map(Number);
    const newDate = new Date(year, month - 1 + direction);
    const newYear = newDate.getFullYear();
    const newMonth = String(newDate.getMonth() + 1).padStart(2, '0');
    setSelectedMonth(`${newYear}-${newMonth}`);
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction.transactionId);
    setSelectedCategory(transaction.categoryName);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setSelectedCategory("");
  };

  const handleSaveCategory = (transaction) => {
    if (selectedCategory && selectedCategory !== transaction.categoryName) {
      updateCategoryMutation.mutate({
        transactionId: transaction.transactionId,
        categoryName: selectedCategory,
        amount: transaction.amount,
        oldCategoryName: transaction.categoryName,
        bookingDate: transaction.bookingDate,
      });
    } else {
      handleCancelEdit();
    }
  };

  const filteredTransactions = transactions?.filter(t => {
    const transactionMonth = t.bookingDate.slice(0, 7);
    return transactionMonth === selectedMonth;
  }) || [];

  return (
    <>
      <SharedNav />
      <div className="px-6 pt-8 pb-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${currentTheme.iconBg}`}>
                <Receipt size={28} stroke="var(--color-secondary)" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${currentTheme.textPrimary}`}>
                  Operacijų valdymas
                </h1>
                <p className={`${currentTheme.textMuted} mt-1`}>
                  Keisk operacijų kategorijas pagal poreikius
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-3 ${currentTheme.card} ${currentTheme.cardBorder} backdrop-blur-sm rounded-2xl p-2 shadow-lg`}>
              <button
                onClick={() => navigateMonth(-1)}
                className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-all duration-200 hover:scale-110 active:scale-95`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-4 min-w-[200px] justify-center">
                <Calendar className="w-4 h-4 text-[#2563EB]" />
                <span className={`font-semibold capitalize ${currentTheme.textPrimary}`}>
                  {formatMonthDisplay(selectedMonth)}
                </span>
              </div>
              <button
                onClick={() => navigateMonth(1)}
                className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-all duration-200 hover:scale-110 active:scale-95`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="px-6 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <BoxWrapper className="p-6 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentTheme.orbSecondary} to-transparent rounded-full blur-2xl -mr-16 -mt-16`} />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div>
                <h2 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
                  Kategorizuotos operacijos
                </h2>
                <p className={`${currentTheme.textMuted} mt-1`}>
                  {filteredTransactions.length} {filteredTransactions.length === 1 ? 'operacija' : 'operacijos'}
                </p>
              </div>
            </div>

            {(transactionsLoading || summaryLoading) && <Loading />}

            {!transactionsLoading && !summaryLoading && filteredTransactions.length === 0 && (
              <div className="text-center py-12 relative z-10">
                <div className={`p-4 rounded-full ${currentTheme.iconBg} w-fit mx-auto mb-3`}>
                  <Receipt className="w-12 h-12 opacity-50" />
                </div>
                <p className={`${currentTheme.textPrimary} font-medium`}>Nėra kategorizuotų operacijų</p>
                <p className={`text-sm ${currentTheme.textMuted} mt-1`}>
                  Šiuo metu nėra operacijų šiam mėnesiui
                </p>
              </div>
            )}

            {!transactionsLoading && !summaryLoading && filteredTransactions.length > 0 && (
              <div className="space-y-3 relative z-10">
                {filteredTransactions.map((transaction) => {
                  const isEditing = editingTransaction === transaction.transactionId;
                  const amount = transaction.amount;
                  const amountStyle = amount < 0 ? "text-[#EB2563]" : "text-[#63EB25]";

                  return (
                    <div
                      key={transaction.transactionId}
                      className={`p-4 rounded-xl ${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.cardHover} transition-all duration-300 group relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className={`absolute top-[50%] left-[20%] h-[60px] w-[200px] rounded-full blur-[80px] ${currentTheme.orbSecondary}`} />
                      </div>
                      <div className="flex items-center justify-between gap-4 flex-wrap relative z-10">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-sm shadow-[#2563EB]/50 animate-pulse"></div>
                            <span className={`${currentTheme.textMuted} text-sm`}>
                              {transaction.bookingDate.split("T")[0]}
                            </span>
                          </div>
                          
                          {isEditing ? (
                            <div className="flex items-center gap-3 flex-wrap">
                              <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className={`px-4 py-2 rounded-lg ${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.textPrimary} focus:outline-none focus:border-[#2563EB]/50 transition-colors`}
                              >
                                <option value="">Pasirink kategoriją</option>
                                {categories.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveCategory(transaction)}
                                  disabled={updateCategoryMutation.isLoading}
                                  className="p-2 rounded-lg bg-[#63EB25]/20 border border-[#63EB25]/30 hover:bg-[#63EB25]/30 text-[#63EB25] transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  disabled={updateCategoryMutation.isLoading}
                                  className="p-2 rounded-lg bg-[#EB2563]/20 border border-[#EB2563]/30 hover:bg-[#EB2563]/30 text-[#EB2563] transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className={`${currentTheme.textPrimary} font-semibold capitalize`}>
                                {transaction.categoryName}
                              </span>
                              <button
                                onClick={() => handleEditClick(transaction)}
                                className={`p-1.5 rounded-lg ${currentTheme.iconBg} ${currentTheme.cardBorder} hover:bg-[#2563EB]/20 hover:border-[#2563EB]/30 ${currentTheme.textMuted} hover:text-[#2563EB] transition-all hover:scale-110 active:scale-95`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="text-right">
                          <p className={`text-xl font-bold ${amountStyle}`}>
                            {formatCurrency(Math.abs(amount))}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </BoxWrapper>
        </div>
      </main>
    </>
  );
}

