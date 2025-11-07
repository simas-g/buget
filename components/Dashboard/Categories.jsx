"use client";
import { ChartBar } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../UI/Button";
import Link from "next/link";
import Loading from "../UI/Loading";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function Categories() {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState([]);
  const [loading, setLoading] = useState(true);
  const summaryStore = useSelector((state) => state.summary);
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = sessionStorage.getItem("monthlySummary");
      if (!raw) {
        return;
      }

      const data = JSON.parse(raw);
      const { categories } = data?.summary;
      const array = Array.from(Object.entries(categories))
      const flow = data.summary.inflow - data.summary.outflow;

      setTotal(flow);
      setCategories(array);
    } catch (err) {
      console.error("Failed to load or parse summary data:", err);
      setCategories([]);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [summaryStore]);

  const calculatePercentage = (amount) => {
    if (amount === 0) return 0;
    return Math.abs(((Math.abs(amount) / total) * 100).toFixed(1));
  };

  const sortedCategories = categories.sort(
    (a, b) => Math.abs(b[1]) - Math.abs(a[1])
  );
  console.log(sortedCategories, "soreteds");
  
  return (
    <BoxWrapper className={"relative flex flex-col w-full lg:h-full p-6 overflow-hidden"}>
      <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${currentTheme.orbSecondary} to-transparent rounded-full blur-lg -mr-14 -mt-14`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
      <div className="flex w-full justify-between items-center mb-6 relative z-10">
        <h5 className={`flex items-center gap-3 text-xl font-bold ${currentTheme.textPrimary}`}>
          <div className={`p-2 rounded-lg ${currentTheme.iconBg}`}>
            <ChartBar stroke="var(--color-secondary)" size={24} />
          </div>
          <div className="flex flex-col">
            <span>Kategorijos</span>
            <span className={`text-xs ${currentTheme.textMuted} font-normal`}>(šio mėnesio)</span>
          </div>
        </h5>
        <Link href="/skydelis/kategorijos" prefetch>
          <Button variant="outline" className={`px-4 py-2 ${currentTheme.buttonHover} transition-colors`}>
            <span>Valdyti</span>
          </Button>
        </Link>
      </div>
      {sortedCategories.length === 0 && !loading && (
        <p className={`${currentTheme.textMuted} text-sm relative z-10`}>Sukurtų kategorijų nėra</p>
      )}
      <ul className="space-y-4 relative z-10">
        {sortedCategories.slice(0, 5).map(([name, amount]) => (
          <li className="flex flex-col gap-3 group" key={name}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-[#2563EB]`} />
                <span className={`${currentTheme.textPrimary} font-medium`}>{name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${currentTheme.textMuted} text-xs`}>
                  {calculatePercentage(amount)}%
                </span>
                <span className={`text-sm font-semibold ${amount >= 0 ? 'text-[#63EB25]' : 'text-[#EB2563]'}`}>
                  {amount >= 0 ? '+' : ''}{Math.abs(amount).toFixed(2)}€
                </span>
              </div>
            </div>

            <div className={`w-full relative h-2.5 rounded-full ${currentTheme.progressBg} overflow-hidden ${currentTheme.progressBgHover} transition-colors`}>
              <div
                style={{
                  width: `${calculatePercentage(amount)}%`,
                }}
                className="h-full bg-gradient-to-r from-[#2563EB] via-[#2563EB]/80 to-[#2563EB]/50 rounded-full shadow-lg shadow-[#2563EB]/30 transition-all duration-500"
              ></div>
            </div>
          </li>
        ))}
      </ul>
      {loading && <Loading />}
    </BoxWrapper>
  );
}
