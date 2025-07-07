"use client";
import { ChartBar } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import Link from "next/link";
import Loading from "../UI/Loading";
export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(true);
  const summaryStore = useSelector((state) => state.summary);
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = sessionStorage.getItem("monthlySummary");
      if (!raw) throw new Error("No data in sessionStorage");

      const data = JSON.parse(raw);
      console.log(data);
      const { categories } = data.summary;

      const array = Array.from(Object.entries(categories ?? {})).slice(0, 6);
      const flow = data.inflow - data.outflow;

      setTotal(flow);
      setCategories(array);
    } catch (err) {
      console.error("Failed to load or parse summary data:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [summaryStore]);

  const calculatePercentage = (amount) => {
    if (amount === 0) return 0;
    return Math.abs(((amount / total) * 100).toFixed(1));
  };

  const sortedCategories = [...categories].sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );
  return (
    <BoxWrapper className={"relative flex flex-col w-full p-5"}>
      <div className="flex w-full justify-between">
        <h5 className="flex items-center gap-2 text-xl font-bold">
          <ChartBar stroke="var(--color-secondary)" size={24} />
          Kategorijos
        </h5>
        <Link href="/skydelis/kategorijos" prefetch>
          <Button variant="outline" className="px-4 py-2">
            <span>Valdyti</span>
          </Button>
        </Link>
      </div>
      {sortedCategories.length === 0 && !loading && (
        <p className="text-gray-500 text-sm">Sukurtų kategorijų nėra</p>
      )}
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
      {loading && <Loading />}
    </BoxWrapper>
  );
}
