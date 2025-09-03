"use client";
import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { formatCurrency } from "@/app/util/format";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
export default function Summary({
  total = 0,
  change = 0,
  type = "",
  message = "",
}) {
  let box;
  if (type === "main") {
    message = "Grynoji vertė";
    box = {
      width: "w-full",
      heading: "text-xl font-semibold text-white/90",
      amount: "sm:text-5xl text-4xl font-bold text-white",
      icon: <Coins stroke="var(--color-secondary)" size={36} />,
    };
  } else if (type === "month-in") {
    message = "Mėnesio įplaukos";
    box = {
      width: "w-full",
      heading: "text-sm font-medium text-white/80",
      amount: "text-lg font-semibold text-primary",
      icon: <TrendingUp stroke="var(--color-primary)" className="w-5 h-5" />,
    };
  } else if (type === "month-out") {
    message = "Mėnesio išlaidos";
    box = {
      width: "w-full",
      heading: "text-sm font-medium text-white/80",
      amount: "text-lg font-semibold text-accent",
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
        type == "main" ? "gap-4" : "gap-2"
      } p-3 ${box?.width}`}
    >
      <h5 className={`flex items-center gap-2 ${box.heading}`}>
        {box?.icon}
        <span>{message}</span>
      </h5>
      <div className="flex flex-col gap-1">
        <p className={box.amount}>{formattedTotal}</p>
        {type === "main" && (
          <p
            className={`text-sm font-medium ${
              data?.change > 0
                ? "text-primary"
                : data?.change == 0
                ? "text-gray-500"
                : "text-accent"
            }`}
          >
            {formattedChange} <span className="text-white">šį mėnesį</span>
          </p>
        )}
      </div>
    </BoxWrapper>
  );
}