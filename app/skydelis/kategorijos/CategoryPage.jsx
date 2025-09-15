"use client";
import { formatCurrency, getCurrentMonthDate } from "@/app/util/format";
import { fetchMonthlySummary } from "@/app/util/http";
import SharedNav from "@/components/Dashboard/SharedNav";
import Button from "@/components/UI/Button";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Plus, TrendingUp, Calendar, PieChartIcon, Box } from "lucide-react";
import { CreationModal, DeletionModal } from "./ActionModals";
import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PieChart from "@/components/UI/charts/ModifiedPie";
import BoxWrapper from "@/components/Dashboard/BoxWrapper";

export default function CategoryPage() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.user);
  const [isOpenConfirmDeletion, setIsOpenConfirmDeletion] = useState({
    isOpen: false,
    name: "",
  });
  const [isOpenCreation, setIsOpenCreation] = useState(false);
  const newCategory = useRef();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["summary", userId],
    queryFn: async () => fetchMonthlySummary(userId, getCurrentMonthDate()),
  });
  let categories = [];
  let totalFlow = 0;
  if (data) {
    categories = Object.entries(data.categories);
    totalFlow = data.inflow - data.outflow;
  }

  const pieData = useMemo(() => {
    if (!data) return null;
    const filtered = categories.filter(([, amount]) => amount > 0);
    const colors = [
      "#63EB25",
      "#2563EB",
      "#EB2563",
    ];
    return {
      labels: filtered.map((item) => item[0]),
      datasets: [
        {
          data: filtered.map((item) => item[1]),
          backgroundColor: colors.slice(0, filtered.length),
          borderWidth: 0,
          hoverBorderWidth: 2,
          hoverBorderColor: "hsl(var(--primary))",
        },
      ],
    };
  }, [data]);

  const calculatePercentage = (amount) => {
    if (totalFlow === 0) return 0;
    return Math.abs(((amount / totalFlow) * 100).toFixed(1));
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

  const handleCategoryCreation = () => {
    // Logic for category creation
    setIsOpenCreation(false);
  };

  const handleDeleteCategory = () => {
    // Logic for category deletion
    setIsOpenConfirmDeletion({ isOpen: false, name: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <SharedNav />

      {/* Hero Section */}
      <div className="px-6 pt-8 pb-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-primary/10">
              <PieChartIcon className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">
              Išlaidų kategorijos
            </h1>
          </div>
          <p className="text-lg">
            Priskirk operacijoms kategorijas, kad matytum jas čia.
          </p>
        </div>
      </div>

      <main className="px-6 pb-8 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Enhanced left column */}
            <div className="lg:col-span-2 space-y-6 bord">
              {/* Summary Card */}
              <BoxWrapper className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {getCurrentMonthDate()}
                    </div>
                    <h2 className="text-xl font-semibold text-card-foreground">
                      Mėnesio apžvalga
                    </h2>
                  </div>
                  <Button
                    onClick={handleCreate}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Pridėti kategoriją
                  </Button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Iš viso:</p>
                    <p className="text-2xl font-bold text-card-foreground">
                      {formatCurrency(totalFlow)}
                    </p>
                  </div>
                </div>
              </BoxWrapper>

              {/* Redesigned category list */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold ">
                  Kategorijos
                </h3>
                {categories
                  ?.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                  .map(([category, amount]) => {
                    const percentage = calculatePercentage(amount);
                    return (
                      <BoxWrapper
                        key={category}
                        className="p-4"
                      >
                        <div className="flex items-center">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium capitalize">
                                {category}
                              </h4>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {formatCurrency(amount)}
                                </p>
                                <p className="text-sm text-gray-300">
                                  {percentage}% 
                                </p>
                              </div>
                            </div>

                            {/* Enhanced progress bar */}
                            <div className="w-full border border-gray-400 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => handleTrashConfirm(category)}
                            className="m-4 p-2 rounded-lg border"
                          >
                            <Trash2 className="w-6 h-6 cursor-pointer" />
                          </button>
                        </div>
                      </BoxWrapper>
                    );
                  })}
              </div>
            </div>

            {/* Enhanced right column */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm sticky top-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-6">
                  Išlaidų pasiskirstymas
                </h3>
                <div className="flex justify-center items-center min-h-[300px]">
                  {pieData ? (
                    <div className="w-full max-w-[280px]">
                      <PieChart data={pieData} />
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <PieChartIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Nėra duomenų</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals remain unchanged */}
      {isOpenCreation && (
        <CreationModal
          open={isOpenCreation}
          onClose={handleTrashCancel}
          ref={newCategory}
          onCreate={handleCategoryCreation}
        />
      )}
      {isOpenConfirmDeletion.isOpen && (
        <DeletionModal
          open={isOpenConfirmDeletion}
          onClose={handleTrashCancel}
          onDelete={handleDeleteCategory}
        />
      )}
    </div>
  );
}
