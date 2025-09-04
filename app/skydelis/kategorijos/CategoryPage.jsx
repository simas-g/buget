"use client";
import { formatCurrency, getCurrentMonthDate } from "@/app/util/format";
import { fetchMonthlySummary } from "@/app/util/http";
import SharedNav from "@/components/Dashboard/SharedNav";
import Button from "@/components/UI/Button";
import DialogWrapper from "@/components/UI/Dialog";
import { useQuery } from "@tanstack/react-query";
import { Delete, DeleteIcon, Edit, Trash, Trash2 } from "lucide-react";
import { CreationModal, DeletionModal } from "./ActionModals";
import { useEffect, useMemo, useRef, useState } from "react";
import BoxWrapper from "@/components/Dashboard/BoxWrapper";
import { useDispatch, useSelector } from "react-redux";
import PieChart from "@/components/UI/charts/ModifiedPie";
import { ChevronDown } from "lucide-react";
import randomColor from "randomcolor";
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
    const colors = randomColor({
      count: filtered.length,
      luminosity: "dark",
      color: "#2563EB",
    });
    console.log(colors, "colors");
    return {
      labels: filtered.map((item) => item[0]),
      datasets: [
        {
          data: filtered.map((item) => item[1]),
          backgroundColor: colors,
        },
      ],
    };
  }, [data, categories]);
  const calculatePercentage = (amount) => {
    if (totalFlow === 0) return 0;
    return Math.abs(((amount / totalFlow) * 100).toFixed(1));
  };

  ///handling deletion
  const handleTrashConfirm = (category) => {
    setIsOpenConfirmDeletion((prev) => ({
      name: category,
      isOpen: true,
    }));
  };
  const handleTrashCancel = () => {
    setIsOpenConfirmDeletion({
      name: "",
      isOpen: false,
    });
  };
  const handleDeleteCategory = async () => {
    const res = await fetch("/api/category/delete", {
      method: "DELETE",
      body: JSON.stringify({
        name: isOpenConfirmDeletion.name,
        userId,
        date: getCurrentMonthDate(),
      }),
    });
    if (res.ok) {
      await refetch();
    }
    handleTrashCancel();
  };

  ///handling creation
  const handleCancelCreation = () => {
    setIsOpenCreation(false);
  };
  const handleCreate = () => {
    setIsOpenCreation(true);
  };
  const handleCategoryCreation = async () => {
    const name = newCategory.current?.value.trim();
    if (!name) return;
    const res = await fetch("/api/category/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        name,
        date: getCurrentMonthDate(),
      }),
    });
    if (res.ok) {
      await refetch();
    }
    handleCancelCreation();
  };
  return (
    <>
      <SharedNav />
      <section className="grid md:grid-cols-2 gap-8 p-6">
        {/* Categories Section */}
        <div className="text-white w-full">
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-4">
                <span className="text-gray-500 text-sm border-b p-2 rounded flex justify-between">
                  {getCurrentMonthDate()}
                  <ChevronDown />
                </span>
                <h2 className="text-xl font-semibold">Operacijų vertė:</h2>
                <p className="text-2xl">{formatCurrency(totalFlow)}</p>
              </div>

              <Button
                onClick={handleCreate}
                variant="outline"
                className="px-4 py-2 h-fit"
              >
                Pridėti
              </Button>
            </div>

            {isOpenCreation && (
              <CreationModal
                open={isOpenCreation}
                onClose={handleCancelCreation}
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

            {/* Category List */}
            <div className="space-y-4">
              {categories
                ?.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                .map(([category, amount]) => {
                  const percentage = calculatePercentage(amount);
                  return (
                    <BoxWrapper className="flex p-4 gap-4" key={category}>
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between text-sm">
                          <span>{category}</span>
                          <span>
                            {formatCurrency(amount)} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded">
                          <div
                            className="h-2 bg-gradient-to-r from-secondary to-secondary/30 border border-gray-400 rounded transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Trash2
                          className="cursor-pointer"
                          onClick={() => handleTrashConfirm(category)}
                        />
                      </div>
                    </BoxWrapper>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="flex justify-center items-center">
          {pieData && <PieChart data={pieData} />}
        </div>
      </section>
    </>
  );
}
