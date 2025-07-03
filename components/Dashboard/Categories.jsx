"use client";
import { ChartBar } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DialogWrapper from "@/components/UI/Dialog";
import { useSelector } from "react-redux";
import { getCurrentMonthDate } from "@/app/util/format";
import Button from "../UI/Button";
import Link from "next/link";
export default function Categories({ refetch }) {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const user = useSelector((state) => state.user);
  const summaryStore = useSelector((state) => state.summary);
  const newCategory = useRef();
  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = JSON.parse(sessionStorage.getItem("monthlySummary"));
    if (!data) {
      return;
    }
    const { categories } = data;
    const array = Array.from(Object.entries(categories));
    const flow = data.inflow - data.outflow;
    setTotal(flow);
    setCategories(array);
  }, [summaryStore]);
  const calculatePercentage = (amount) => {
    if (amount === 0) return 0;
    return ((amount / total) * 100).toFixed(1);
  };
  const handleAddCategory = () => {
    setShowAddCategory(true);
  };
  const handleCancelCategory = () => {
    setError("");
    setShowAddCategory(false);
  };
  const handleSubmitCategory = async () => {
    const name = newCategory.current?.value.trim();
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId,
          name,
          date: getCurrentMonthDate(),
        }),
      });

      if (res.ok) {
        setLoading(false);
        setShowAddCategory(false);
        return;
      } else {
        throw new Error();
      }
    } catch (error) {
      setLoading(false);
      setError("Įvyko klaida " + error);
    } finally {
      refetch();
    }
  };
  async function fetchCategories() {}
  const sortedCategories = [...categories].sort((a, b) => b[1] - a[1]);
  return (
    <BoxWrapper className={"relative w-full"}>
      {showAddCategory && (
        <DialogWrapper open={showAddCategory} onClose={handleCancelCategory}>
          <div className="flex flex-col gap-2">
            <input
              ref={newCategory}
              type="text"
              placeholder="kategorija"
              className="border outline-none px-4 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400"
            />
            {error && <p className="text-accent">{error}</p>}
            <button
              onClick={handleSubmitCategory}
              disabled={loading}
              className="w-fit border px-4 py-2 rounded-lg cursor-pointer bg-primary"
            >
              Pridėti
            </button>
          </div>
        </DialogWrapper>
      )}
      <h5 className="flex items-center gap-2 text-xl font-bold">
        <ChartBar stroke="var(--color-secondary)" size={24} />
        Kategorijos
      </h5>
      <Link href="/skydelis/kategorijos" prefetch>
        <Button
          variant="outline"
          className="px-4 py-2 absolute top-4 right-4"
        >
          <span>Valdyti</span>
        </Button>
      </Link>

      <ul className="mt-4 space-y-3">
        {sortedCategories.map(([name, amount]) => (
          <li className="flex flex-col gap-2" key={name}>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 mr-2 rounded-full"
                style={{ backgroundColor: "#ccc" }} // default or static color
              ></span>
              {name}{" "}
              <span className="text-gray-400 text-xs">
                ({calculatePercentage(amount)}%)
              </span>
            </div>

            <div className="w-full relative h-2 rounded-full bg-white/10">
              <div
                style={{
                  width: `${calculatePercentage(amount)}%`,
                  backgroundColor: "#ccc", // match the dot color
                }}
                className="h-2 rounded-full"
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </BoxWrapper>
  );
}
