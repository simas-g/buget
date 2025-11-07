"use client";
import { formatCurrency, getCurrentMonthDate } from "@/app/util/format";
import { fetchMonthlySummary, fetchCategorizedTransactions } from "@/app/util/http";
import SharedNav from "@/components/Dashboard/SharedNav";
import Button from "@/components/UI/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Receipt, Calendar, ChevronLeft, ChevronRight, Edit2, Save, X, Plus, Wallet, Split } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import BoxWrapper from "@/components/Dashboard/BoxWrapper";
import Loading from "@/components/UI/Loading";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";
import Dialog from "@/components/UI/Dialog";
import SplitTransactionModal from "@/components/Dashboard/SplitTransactionModal";
import Select from "@/components/UI/Select";

export default () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  const { userId } = useSelector((state) => state.user);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthDate());
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingAmount, setEditingAmount] = useState("");
  const [editingSplitTransaction, setEditingSplitTransaction] = useState(null);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [transactionSplits, setTransactionSplits] = useState({});
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualTransaction, setManualTransaction] = useState({
    categoryName: "",
    amount: "",
    bookingDate: new Date().toISOString().split('T')[0]
  });
  const queryClient = useQueryClient();

  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ["summary", userId, selectedMonth],
    queryFn: async () => fetchMonthlySummary(userId, selectedMonth),
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["categorized", userId],
    queryFn: async () => {
      const txns = await fetchCategorizedTransactions(userId);
      
      const splitTxns = txns.filter(t => t.type === "split");
      const splitPromises = splitTxns.map(async (txn) => {
        try {
          const res = await fetch(`/api/category/split?transactionId=${txn.transactionId}`);
          if (res.ok) {
            const data = await res.json();
            return { transactionId: txn.transactionId, splits: data.split.splits };
          }
        } catch (error) {
          console.error("Error fetching split:", error);
        }
        return null;
      });
      
      const splitResults = await Promise.all(splitPromises);
      const splitsMap = {};
      splitResults.forEach(result => {
        if (result) {
          splitsMap[result.transactionId] = result.splits;
        }
      });
      setTransactionSplits(splitsMap);
      
      return txns;
    },
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

  const updateSplitMutation = useMutation({
    mutationFn: async ({ transactionId, splits, bookingDate }) => {
      const month = bookingDate.slice(0, 7);
      
      const res = await fetch("/api/category/split", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          month,
          transactionId,
          splits,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update split");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categorized", userId]);
      queryClient.invalidateQueries(["summary", userId, selectedMonth]);
      setEditingSplitTransaction(null);
      setShowSplitModal(false);
    },
  });

  const addManualTransactionMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/transactions/addManual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to add manual transaction");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categorized", userId]);
      queryClient.invalidateQueries(["summary", userId, selectedMonth]);
      setIsManualModalOpen(false);
      setManualTransaction({
        categoryName: "",
        amount: "",
        bookingDate: new Date().toISOString().split('T')[0]
      });
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
    const newMonthStr = `${newYear}-${newMonth}`;
    
    // Prevent navigating to future months
    const currentMonthStr = getCurrentMonthDate();
    if (direction > 0 && newMonthStr > currentMonthStr) {
      return;
    }
    
    setSelectedMonth(newMonthStr);
  };

  const isCurrentMonth = () => {
    return selectedMonth >= getCurrentMonthDate();
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction.transactionId);
    setSelectedCategory(transaction.categoryName);
    setEditingAmount(transaction.amount.toString());
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setSelectedCategory("");
    setEditingAmount("");
  };

  const handleSaveCategory = (transaction) => {
    const categoryChanged = selectedCategory && selectedCategory !== transaction.categoryName;
    const isManual = transaction.type === "manual";
    const amountChanged = isManual && editingAmount && parseFloat(editingAmount) !== transaction.amount;
    
    if (categoryChanged || amountChanged) {
      // For manual transactions, use the amount directly as entered (can be negative or positive)
      const finalAmount = isManual && amountChanged 
        ? parseFloat(editingAmount)
        : transaction.amount;
      
      updateCategoryMutation.mutate({
        transactionId: transaction.transactionId,
        categoryName: selectedCategory || transaction.categoryName,
        amount: finalAmount,
        oldCategoryName: transaction.categoryName,
        bookingDate: transaction.bookingDate,
      });
    } else {
      handleCancelEdit();
    }
  };

  const handleEditSplit = (transaction) => {
    setEditingSplitTransaction(transaction);
    setShowSplitModal(true);
  };

  const handleSaveSplit = (splits) => {
    if (editingSplitTransaction) {
      updateSplitMutation.mutate({
        transactionId: editingSplitTransaction.transactionId,
        splits,
        bookingDate: editingSplitTransaction.bookingDate,
      });
    }
  };

  const filteredTransactions = transactions?.filter(t => {
    const transactionMonth = t.bookingDate.slice(0, 7);
    return transactionMonth === selectedMonth;
  }) || [];

  const handleAddManualTransaction = () => {
    if (!manualTransaction.categoryName || !manualTransaction.amount) {
      return;
    }

    addManualTransactionMutation.mutate({
      userId,
      categoryName: manualTransaction.categoryName,
      amount: parseFloat(manualTransaction.amount),
      bookingDate: manualTransaction.bookingDate,
    });
  };

  return (
    <>
      <SharedNav />
      <SplitTransactionModal
        open={showSplitModal}
        onClose={() => {
          setShowSplitModal(false);
          setEditingSplitTransaction(null);
        }}
        transaction={editingSplitTransaction}
        categories={categories.map(cat => [cat, 0])}
        onSplit={handleSaveSplit}
        loading={updateSplitMutation.isLoading}
      />
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
                disabled={isCurrentMonth()}
                className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
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
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentTheme.orbSecondary} to-transparent rounded-full blur-lg -mr-12 -mt-12`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
            <div className="flex items-center flex-wrap gap-4 justify-between mb-6 relative z-10">
              <div>
                <h2 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
                  Kategorizuotos operacijos
                </h2>
                <p className={`${currentTheme.textMuted} mt-1`}>
                  {filteredTransactions.length} {filteredTransactions.length === 1 ? 'operacija' : 'operacijos'}
                </p>
              </div>
              <Button
                variant="ctaPrimary"
                onClick={() => setIsManualModalOpen(true)}
                className="px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4" />
                <span>Pridėti grynais</span>
              </Button>
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
              <div className="space-y-3 relative z-10" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
                {filteredTransactions.map((transaction) => {
                  const isEditing = editingTransaction === transaction.transactionId;
                  const amount = transaction.amount;
                  const amountStyle = amount < 0 ? "text-[#EB2563]" : "text-[#63EB25]";
                  const isSplit = transaction.type === "split";
                  const splits = transactionSplits[transaction.transactionId] || [];

                  return (
                    <div
                      key={transaction.transactionId}
                      className={`p-4 rounded-xl ${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.cardHover} transition-all duration-150 group relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap relative z-10">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${isSplit ? 'bg-[#8B5CF6]' : 'bg-[#2563EB]'} shadow-sm ${isSplit ? 'shadow-[#8B5CF6]/50' : 'shadow-[#2563EB]/50'}`}></div>
                            <span className={`${currentTheme.textMuted} text-sm`}>
                              {transaction.bookingDate.split("T")[0]}
                            </span>
                            {transaction.type === "manual" && (
                              <span className="px-2 py-1 text-xs rounded-full bg-[#63EB25]/20 text-[#63EB25] border border-[#63EB25]/30 flex items-center gap-1">
                                <Wallet className="w-3 h-3" />
                                Grynais
                              </span>
                            )}
                            {isSplit && (
                              <span className="px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-medium flex items-center gap-1">
                                <Split className="w-3 h-3" />
                                Padalinta
                              </span>
                            )}
                          </div>
                          
                          {isEditing && !isSplit ? (
                            <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                <Select
                                  value={selectedCategory}
                                  onChange={setSelectedCategory}
                                  options={categories.map(cat => ({ value: cat, label: cat }))}
                                  placeholder="Pasirink kategoriją"
                                  className="min-w-[200px]"
                                />
                                {transaction.type === "manual" && (
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={editingAmount}
                                        onChange={(e) => setEditingAmount(e.target.value)}
                                        placeholder="Suma"
                                        className={`w-32 px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.cardBorder} border ${currentTheme.textPrimary} placeholder:${currentTheme.textMuted} focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all`}
                                      />
                                      <span className={`text-sm ${currentTheme.textMuted}`}>€</span>
                                    </div>
                                    <p className={`text-xs ${currentTheme.textMuted} flex items-center gap-1`}>
                                      <span className="inline-block w-1 h-1 rounded-full bg-[#EB2563]"></span>
                                      Neigiama išlaidoms,
                                      <span className="inline-block w-1 h-1 rounded-full bg-[#63EB25]"></span>
                                      teigiama pajamoms
                                    </p>
                                  </div>
                                )}
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
                            </div>
                          ) : isSplit ? (
                            <div className="space-y-2">
                              {splits.map((split, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <span className={`${currentTheme.textPrimary} font-medium capitalize text-sm`}>
                                    {split.categoryName}
                                  </span>
                                  <span className={`text-xs ${currentTheme.textMuted}`}>
                                    {formatCurrency(Math.abs(split.amount))}
                                  </span>
                                </div>
                              ))}
                              <button
                                onClick={() => handleEditSplit(transaction)}
                                className={`mt-2 p-1.5 rounded-lg ${currentTheme.iconBg} ${currentTheme.cardBorder} hover:bg-[#8B5CF6]/20 hover:border-[#8B5CF6]/30 ${currentTheme.textMuted} hover:text-[#8B5CF6] transition-all hover:scale-110 active:scale-95 flex items-center gap-1 text-xs`}
                              >
                                <Edit2 className="w-3 h-3" />
                                Redaguoti
                              </button>
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

      <Dialog open={isManualModalOpen} onClose={() => setIsManualModalOpen(false)}>
        <div className={`${theme === 'dark' ? 'bg-[#1A1A40]' : 'bg-white'} ${currentTheme.cardBorder} border p-8 rounded-2xl min-w-[90vw] sm:min-w-[500px] shadow-2xl relative overflow-visible`}>
          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentTheme.orbSecondary} to-transparent rounded-full blur-lg -mr-12 -mt-12`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className={`p-4 rounded-2xl ${currentTheme.iconBg} shadow-lg`}>
              <Wallet className="w-7 h-7 text-[#2563EB]" />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
                Pridėti grynųjų operaciją
              </h3>
              <p className={`text-sm ${currentTheme.textMuted} mt-1`}>
                Registruokite grynųjų pinigų operacijas
              </p>
            </div>
          </div>

          <div className="space-y-5 relative z-10">
            <div>
              <label className={`block text-sm font-semibold ${currentTheme.textPrimary} mb-2`}>
                Kategorija
              </label>
              <Select
                value={manualTransaction.categoryName}
                onChange={(value) => setManualTransaction({...manualTransaction, categoryName: value})}
                options={categories.map(cat => ({ value: cat, label: cat }))}
                placeholder="Pasirink kategoriją"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold ${currentTheme.textPrimary} mb-2`}>
                Suma (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={manualTransaction.amount}
                onChange={(e) => setManualTransaction({...manualTransaction, amount: e.target.value})}
                placeholder="0.00"
                className={`w-full h-10 px-4 py-3 rounded-xl ${currentTheme.card} ${currentTheme.cardBorder} border ${currentTheme.textPrimary} placeholder:${currentTheme.textMuted} focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all shadow-sm hover:shadow-md`}
              />
              <p className={`text-xs ${currentTheme.textMuted} mt-2 flex items-center gap-1`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#EB2563]"></span>
                Neigiama suma išlaidoms,
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#63EB25]"></span>
                teigiama pajamoms
              </p>
            </div>

            <div>
              <label className={`block text-sm font-semibold ${currentTheme.textPrimary} mb-2`}>
                Data
              </label>
              <input
                type="date"
                value={manualTransaction.bookingDate}
                onChange={(e) => setManualTransaction({...manualTransaction, bookingDate: e.target.value})}
                className={`w-full px-4 py-3 rounded-xl ${currentTheme.card} ${currentTheme.cardBorder} border ${currentTheme.textPrimary} focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all shadow-sm hover:shadow-md`}
                style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
              />
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                variant="ctaPrimary"
                onClick={handleAddManualTransaction}
                disabled={!manualTransaction.categoryName || !manualTransaction.amount || addManualTransactionMutation.isLoading}
                className="flex-1 py-3.5 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                {addManualTransactionMutation.isLoading ? "Pridedama..." : "Pridėti"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsManualModalOpen(false)}
                className="flex-1 py-3.5 text-base font-semibold"
              >
                Atšaukti
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

