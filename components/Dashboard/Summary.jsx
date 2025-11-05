"use client";
import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { formatCurrency } from "@/app/util/format";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function Summary({
  total = 0,
  change = 0,
  type = "",
  message = "",
}) {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  let box;
  if (type === "main") {
    message = "Grynoji vertė";
    box = {
      width: "w-full",
      heading: `text-xl font-semibold ${currentTheme.textSecondary}`,
      amount: `sm:text-5xl text-4xl font-bold ${currentTheme.amountGradient}`,
      icon: <Coins stroke="var(--color-secondary)" size={36} />,
    };
  } else if (type === "month-in") {
    message = "Mėnesio įplaukos";
    box = {
      width: "w-full",
      heading: `text-sm font-medium ${currentTheme.textSecondary}`,
      amount: "text-xl font-semibold text-[#63EB25]",
      icon: <TrendingUp stroke="var(--color-primary)" className="w-5 h-5" />,
    };
  } else if (type === "month-out") {
    message = "Mėnesio išlaidos";
    box = {
      width: "w-full",
      heading: `text-sm font-medium ${currentTheme.textSecondary}`,
      amount: "text-xl font-semibold text-[#EB2563]",
      icon: <TrendingDown stroke="var(--color-accent)" className="w-5 h-5" />,
    };
  }
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const summary = useSelector(
    (state) => state.summary
  );
  useEffect(() => {
    setLoading(true);
    if (typeof window === "undefined") return;
    const data = JSON.parse(sessionStorage.getItem("monthlySummary"));
    if (!data) {
      return;
    }
    if (type === "main") {
    }
    switch (type) {
      case "main":
        setData((prev) => ({
          total: data?.summary.closingBalance,
          change: data?.summary.inflow + data?.summary.outflow,
        }));
        break;
      case "month-in":
        setData((prev) => ({
          total: data?.summary.inflow,
        }));
        break;

      case "month-out":
        setData((prev) => ({
          total: data?.summary.outflow,
        }));
        break;
    }
    setLoading(false);
  }, [summary]);
  const formattedTotal = formatCurrency(data?.total || 0);
  let formattedChange = formatCurrency(data?.change || 0);
  if (data?.change > 0) {
    formattedChange = `+` + formattedChange;
  }
  return (
    <BoxWrapper
      className={`flex flex-col justify-center ${
        type == "main" ? "gap-6" : "gap-3"
      } ${type == "main" ? "p-6" : "p-5"} ${box?.width} relative overflow-hidden`}
    >
      {type === "main" && (
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${currentTheme.orbSecondary} to-transparent rounded-full blur-2xl -mr-16 -mt-16`} />
      )}
      {type === "month-in" && (
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentTheme.orbPrimary} to-transparent rounded-full blur-xl -mr-12 -mt-12`} />
      )}
      {type === "month-out" && (
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentTheme.orbAccent} to-transparent rounded-full blur-xl -mr-12 -mt-12`} />
      )}
      <h5 className={`flex items-center gap-3 ${box.heading} relative z-10`}>
        <div className={`p-2 rounded-lg ${
          type === "main" ? currentTheme.iconBg : 
          type === "month-in" ? currentTheme.iconBgPrimary : 
          currentTheme.iconBgAccent
        }`}>
          {box?.icon}
        </div>
        <span>{message}</span>
      </h5>
      <div className="flex flex-col gap-2 relative z-10">
        <p className={box.amount}>{formattedTotal}</p>
        {type === "main" && (
          <p
            className={`text-sm font-medium flex items-center gap-1 ${
              data?.change > 0
                ? "text-[#63EB25]"
                : data?.change == 0
                ? currentTheme.textMuted
                : "text-[#EB2563]"
            }`}
          >
            {data?.change > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : data?.change < 0 ? (
              <TrendingDown className="w-4 h-4" />
            ) : null}
            {formattedChange} <span className={`${currentTheme.textSecondary} text-xs`}>šį mėnesį</span>
          </p>
        )}
      </div>
    </BoxWrapper>
  );
}