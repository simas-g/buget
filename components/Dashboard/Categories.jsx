"use client";
import { ChartBar } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import Link from "next/link";
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState([]);

  const summaryStore = useSelector((state) => state.summary);
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
    return Math.abs(((amount / total) * 100).toFixed(1));
  };
  
  const sortedCategories = [...categories].sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  return (
    <BoxWrapper className={"relative w-full p-5"}>
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
              {name}{" "}
              <span className="text-gray-400 text-xs">
                ({calculatePercentage(amount)}%)
              </span>
            </div>

            <div className="w-full relative h-2 rounded-full bg-white/10">
              <div
                style={{
                  width: `${calculatePercentage(amount)}%`,
                }}
                className="h-2 bg-gradient-to-r from-secondary  to-secondary/30 border border-gray-400 rounded-full"
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </BoxWrapper>
  );
}
