"use client";
import { formatCurrency, getCurrentMonthDate } from "@/app/util/format";
import { fetchMonthlySummary, createCategory, deleteCategory } from "@/app/util/http";
import { exportMonthlyReportToPDF } from "@/app/util/pdfExport";
import SharedNav from "@/components/Dashboard/SharedNav";
import Button from "@/components/UI/Button";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Plus, TrendingUp, Calendar, PieChartIcon, Box, ChevronLeft, ChevronRight, Loader2, Download } from "lucide-react";
import { CreationModal, DeletionModal } from "./ActionModals";
import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PieChart from "@/components/UI/charts/ModifiedPie";
import BoxWrapper from "@/components/Dashboard/BoxWrapper";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";
import DashboardBackground from "@/components/Dashboard/DashboardBackground";

export default function CategoryPage() {
  const dispatch = useDispatch();
  const { userId, sessionId } = useSelector((state) => state.user);
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthDate());
  const [isOpenConfirmDeletion, setIsOpenConfirmDeletion] = useState({
    isOpen: false,
    name: "",
  });
  const [isOpenCreation, setIsOpenCreation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const newCategory = useRef();
  const pieChartRef = useRef();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["summary", userId, selectedMonth],
    queryFn: async () => fetchMonthlySummary(userId, selectedMonth),
  });
  let categories = [];
  let totalOutflow = 0;
  let totalInflow = 0;
  let totalFlow = 0;
  if (data) {
    categories = Object.entries(data.categories);
    totalOutflow = data.outflow;
    totalInflow = data.inflow;
    totalFlow = data.inflow + data.outflow;
  }

  const sortedExpenseCategories = useMemo(() => {
    return categories
      .filter(([, amount]) => amount < 0)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  }, [categories]);

  const pieData = useMemo(() => {
    if (!data || sortedExpenseCategories.length === 0) return null;
    
    const colors = [
      "#ef4444",
      "#f59e0b",
      "#8b5cf6",
      "#06b6d4",
      "#ec4899",
      "#84cc16",
      "#3b82f6",
      "#14b8a6",
      "#f97316",
      "#a855f7",
      "#10b981",
      "#facc15",
    ];
    return {
      labels: sortedExpenseCategories.map((item) => item[0]),
      datasets: [
        {
          data: sortedExpenseCategories.map((item) => Math.abs(item[1])),
          backgroundColor: colors.slice(0, sortedExpenseCategories.length),
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          hoverBorderWidth: 3,
          hoverBorderColor: "rgba(255, 255, 255, 0.5)",
        },
      ],
    };
  }, [data, sortedExpenseCategories]);

  const calculatePercentage = (amount) => {
    if (totalOutflow === 0) return 0;
    return Math.abs(((amount / totalOutflow) * 100).toFixed(1));
  };

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
    
    if (direction > 0 && newMonthStr > getCurrentMonthDate()) {
      return;
    }
    
    setSelectedMonth(newMonthStr);
  };

  const isCurrentMonth = selectedMonth >= getCurrentMonthDate();
  const isExactCurrentMonth = selectedMonth === getCurrentMonthDate();

  const getCategoryColor = (categoryName) => {
    const colors = [
      "#ef4444",
      "#f59e0b",
      "#8b5cf6",
      "#06b6d4",
      "#ec4899",
      "#84cc16",
      "#3b82f6",
      "#14b8a6",
      "#f97316",
      "#a855f7",
      "#10b981",
      "#facc15",
    ];
    const index = sortedExpenseCategories.findIndex(([name]) => name === categoryName);
    if (index === -1) return colors[0];
    return colors[index % colors.length];
  };

  const handleCreate = () => {
    setIsOpenCreation(true);
  };

  const handleTrashConfirm = (category) => {
    setIsOpenConfirmDeletion({ isOpen: true, name: category });
  };

  const handleTrashCancel = () => {
    setIsOpenConfirmDeletion({ isOpen: false, name: "" });
  };

  const handleCloseCreation = () => {
    setIsOpenCreation(false);
  };

  const handleCategoryCreation = async () => {
    const categoryName = newCategory.current?.value?.trim();
    if (!categoryName) {
      return;
    }
    
    const result = await createCategory(categoryName, userId, selectedMonth, sessionId);
    if (result.ok) {
      refetch();
      newCategory.current.value = "";
    } else {
      alert("Nepavyko sukurti kategorijos");
    }
    setIsOpenCreation(false);
  };

  const handleDeleteCategory = async () => {
    const result = await deleteCategory(
      isOpenConfirmDeletion.name,
      userId,
      selectedMonth,
      sessionId
    );
    if (result.ok) {
      refetch();
    } else {
      alert(result.data?.message || "Nepavyko ištrinti kategorijos");
    }
    setIsOpenConfirmDeletion({ isOpen: false, name: "" });
  };

  const handleExportPDF = async () => {
    if (!data || isLoading) return;
    
    setIsExporting(true);
    try {
      await exportMonthlyReportToPDF(data, selectedMonth, pieChartRef);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DashboardBackground>
      <div className="min-h-screen relative">
        <SharedNav />

        <div className="px-6 pt-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${currentTheme.iconBg}`}>
                  <PieChartIcon stroke="var(--color-secondary)" size={28} />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${currentTheme.textHeading}`}>
                    Išlaidų kategorijos
                  </h1>
                  <p className={`${currentTheme.textMuted} mt-1`}>
                    Priskirk operacijoms kategorijas, kad matytum jas čia
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className={`flex items-center gap-3 ${currentTheme.card} backdrop-blur-md rounded-2xl p-2 border ${currentTheme.cardBorder} shadow-lg`}>
                  <button
                    onClick={() => navigateMonth(-1)}
                    className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-all duration-200 hover:scale-110 active:scale-95`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2 px-4 min-w-[200px] justify-center">
                    <Calendar className="w-4 h-4" stroke="var(--color-secondary)" />
                    <span className={`font-semibold capitalize ${currentTheme.textPrimary}`}>
                      {formatMonthDisplay(selectedMonth)}
                    </span>
                  </div>
                  <button
                    onClick={() => navigateMonth(1)}
                    disabled={isCurrentMonth}
                    className={`p-2 ${currentTheme.buttonHover} rounded-xl transition-all duration-200 ${isCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  onClick={handleExportPDF}
                  disabled={isLoading || !data || isExporting}
                  className={`flex items-center gap-2 px-4 py-2 ${currentTheme.card} backdrop-blur-md rounded-2xl border ${currentTheme.cardBorder} shadow-lg ${currentTheme.buttonHover} transition-all duration-200 hover:scale-105 active:scale-95 ${(isLoading || !data || isExporting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Eksportuoti į PDF"
                >
                  {isExporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" stroke="var(--color-secondary)" />
                  ) : (
                    <Download className="w-5 h-5" stroke="var(--color-secondary)" />
                  )}
                  <span className={`font-semibold ${currentTheme.textPrimary}`}>
                    {isExporting ? 'Generuojama...' : 'PDF'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <main className="px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <BoxWrapper className="p-6 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentTheme.orbSecondary} to-transparent rounded-full blur-lg -mr-12 -mt-12`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="space-y-2">
                      <h2 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
                        Mėnesio apžvalga
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${currentTheme.iconBg}`}>
                            <TrendingUp stroke="var(--color-secondary)" className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`text-xs ${currentTheme.textMuted}`}>Bendras balansas</p>
                            {isLoading ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-6 h-6 animate-spin" stroke="var(--color-secondary)" />
                                <p className={`text-xl font-bold ${currentTheme.textPrimary}`}>Kraunama...</p>
                              </div>
                            ) : (
                              <p className={`text-3xl font-bold ${totalFlow >= 0 ? 'text-[#63EB25]' : 'text-[#EB2563]'}`}>
                                {totalFlow >= 0 ? '+' : ''}{formatCurrency(totalFlow)}
                              </p>
                            )}
                          </div>
                        </div>
                        {!isLoading && (
                          <div className="flex gap-6 pl-14">
                            <div>
                              <p className={`text-xs ${currentTheme.textMuted}`}>Pajamos</p>
                              <p className={`text-lg font-semibold text-[#63EB25]`}>
                                +{formatCurrency(totalInflow)}
                              </p>
                            </div>
                            <div>
                              <p className={`text-xs ${currentTheme.textMuted}`}>Išlaidos</p>
                              <p className={`text-lg font-semibold text-[#EB2563]`}>
                                -{formatCurrency(Math.abs(totalOutflow))}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handleCreate}
                      variant="outline"
                      disabled={!isExactCurrentMonth}
                      className={`px-4 py-2 ${currentTheme.buttonHover} flex items-center gap-2 ${!isExactCurrentMonth ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={!isExactCurrentMonth ? 'Kategorijas galima pridėti tik einamajam mėnesiui' : ''}
                    >
                      <Plus className="w-5 h-5" />
                      Pridėti kategoriją
                    </Button>
                  </div>
                </BoxWrapper>

                <BoxWrapper className="p-6 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${currentTheme.orbSecondary} to-transparent rounded-full blur-lg -mr-14 -mt-14`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className={`text-xl font-bold ${currentTheme.textPrimary}`}>
                      Kategorijos
                    </h3>
                    <span className={`text-sm ${currentTheme.textMuted}`}>
                      {categories.length} {categories.length === 1 ? 'kategorija' : 'kategorijos'}
                    </span>
                  </div>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 relative z-10">
                      <Loader2 className="w-8 h-8 animate-spin mb-3" stroke="var(--color-secondary)" />
                      <p className={`${currentTheme.textMuted} text-sm`}>Kraunama...</p>
                    </div>
                  ) : categories.length === 0 ? (
                    <p className={`${currentTheme.textMuted} text-sm relative z-10`}>Nėra kategorijų šiam mėnesiui</p>
                  ) : (
                    <ul className="space-y-4 relative z-10" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 500px' }}>
                      {categories
                        ?.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                        .map(([category, amount]) => {
                          const percentage = calculatePercentage(amount);
                          const color = getCategoryColor(category);
                          return (
                            <li className="flex flex-col gap-3 group" key={category}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                                  <span className={`${currentTheme.textPrimary} font-medium`}>{category}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`${currentTheme.textMuted} text-xs`}>
                                    {percentage}%
                                  </span>
                                  <span className={`text-sm font-semibold ${amount >= 0 ? 'text-[#63EB25]' : 'text-[#EB2563]'}`}>
                                    {amount >= 0 ? '+' : ''}{Math.abs(amount).toFixed(2)}€
                                  </span>
                                  <button
                                    onClick={() => handleTrashConfirm(category)}
                                    disabled={!isExactCurrentMonth}
                                    className={`p-2 rounded-lg ${currentTheme.buttonHover} transition-all duration-200 ${isExactCurrentMonth ? 'hover:scale-110 active:scale-95' : 'opacity-30 cursor-not-allowed'} group`}
                                    title={!isExactCurrentMonth ? 'Kategorijas galima trinti tik einamajam mėnesiui' : ''}
                                  >
                                    <Trash2 className="w-4 h-4 text-[#EB2563]" />
                                  </button>
                                </div>
                              </div>

                              <div className={`w-full relative h-2.5 rounded-full ${currentTheme.progressBg} overflow-hidden ${currentTheme.progressBgHover} transition-colors`}>
                                <div
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: color
                                  }}
                                  className="h-full rounded-full shadow-lg transition-all duration-500"
                                />
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  )}
                </BoxWrapper>
              </div>

              <div className="lg:col-span-1">
                <BoxWrapper className="p-6 relative overflow-hidden sticky top-6">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentTheme.orbSecondary} to-transparent rounded-full blur-lg -mr-12 -mt-12`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
                  <div className="flex items-center gap-2 mb-6 relative z-10">
                    <div className={`p-2 rounded-lg ${currentTheme.iconBg}`}>
                      <PieChartIcon stroke="var(--color-secondary)" className="w-5 h-5" />
                    </div>
                    <h3 className={`text-xl font-bold ${currentTheme.textPrimary}`}>
                      Išlaidų pasiskirstymas
                    </h3>
                  </div>
                  <div className="flex justify-center items-center min-h-[300px] relative z-10">
                    {isLoading ? (
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3" stroke="var(--color-secondary)" />
                        <p className={`font-medium ${currentTheme.textPrimary}`}>Kraunama...</p>
                      </div>
                    ) : pieData ? (
                      <div ref={pieChartRef} className="w-full space-y-4">
                        <div className="w-full max-w-[300px] mx-auto">
                          <PieChart data={pieData} />
                        </div>
                        <div className={`pt-4 border-t ${currentTheme.cardBorder}`}>
                          <div className="space-y-3">
                            {sortedExpenseCategories
                              .slice(0, 8)
                              .map(([category, amount]) => {
                                const color = getCategoryColor(category);
                                return (
                                  <div key={category} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                      <span className={`capitalize ${currentTheme.textPrimary} font-medium`}>{category}</span>
                                    </div>
                                    <span className={`font-semibold ${currentTheme.textSecondary}`}>{formatCurrency(Math.abs(amount))}</span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className={`p-4 rounded-full ${currentTheme.iconBg} w-fit mx-auto mb-3`}>
                          <PieChartIcon stroke="var(--color-secondary)" className="w-12 h-12" />
                        </div>
                        <p className={`font-medium ${currentTheme.textPrimary}`}>Nėra duomenų</p>
                        <p className={`text-sm mt-1 ${currentTheme.textMuted}`}>Pridėk kategorijas ir operacijas</p>
                      </div>
                    )}
                  </div>
                </BoxWrapper>
              </div>
            </div>
          </div>
        </main>

      {/* Modals remain unchanged */}
      {isOpenCreation && (
        <CreationModal
          open={isOpenCreation}
          onClose={handleCloseCreation}
          ref={newCategory}
          onCreate={handleCategoryCreation}
        />
      )}
      {isOpenConfirmDeletion.isOpen && (
        <DeletionModal
          open={isOpenConfirmDeletion.isOpen}
          onClose={handleTrashCancel}
          onDelete={handleDeleteCategory}
        />
      )}
      </div>
    </DashboardBackground>
  );
}
