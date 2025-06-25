import { Coins, TrendingDown, TrendingUp } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { formatCurrency } from "@/app/util/format";

export default function Summary({
  total = '',
  change = '0',
  type = "",
  message = "",
}) {
  const formattedTotal = formatCurrency(total);
  let formattedChange = formatCurrency(change)
  if(change > 0) {
    formattedChange = `+` + formattedChange
  }
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
    message = "Mėnesio pajamos";
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

  return (
    <BoxWrapper className={`flex flex-col justify-center ${type == 'main' ? "gap-4" : 'gap-2'} p-3 ${box?.width}`}>
      <h5 className={`flex items-center gap-2 ${box.heading}`}>
        {box?.icon}
        <span>{message}</span>
      </h5>
      <div className="flex flex-col gap-1">
        <p className={box.amount}>{formattedTotal}</p>
        {type === "main" && (
          <p
            className={`text-sm font-medium ${
              change > 0 ? "text-primary" : change == 0 ? 'text-gray-500': "text-accent"
            }`}
          >
            {formattedChange} <span className="text-white">šį mėnesį</span> 
          </p>
        )}
      </div>
    </BoxWrapper>
  );
}
