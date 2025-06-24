import { Coins } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { formatCurrency } from "@/app/util/format";

export default function Summary({
  total = 449723.1,
  change = 1515.5,
  type = "Grynoji vertė",
  message = "per paskutinį mėn.",
  index = 0,
}) {
  const formattedTotal = formatCurrency(total);
  const formattedChange =
    change > 0 ? `+${formatCurrency(change)}` : formatCurrency(change);
  return (
    <BoxWrapper className="flex flex-col gap-2 max-w-60">
      <h5 className={`flex gap-2 ${index == 1 ? "text-lg" : "text-sm"} text-white/80`}>
        <Coins stroke="var(--color-secondary)" /> {type}
      </h5>
      <div>
        <p className={`${index == 1 ? "text-3xl font-semibold" : "text-lg text-white/90 "}`}>
          {formattedTotal}
        </p>
        <p className={`text-sm ${change > 0 ? "text-primary" : "text-accent"}`}>
          {formattedChange} {message}
        </p>
      </div>
    </BoxWrapper>
  );
}
