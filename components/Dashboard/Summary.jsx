import { Coins, DollarSign } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import { formatCurrency } from "@/app/util/format";

export default function Summary({ total = 447923.1, change = 1515.5 }) {
  const formattedTotal = formatCurrency(total);
  const formattedChange =
    change > 0 ? `+${formatCurrency(change)}` : `-${formatCurrency(change)}`;
  return (
    <div className="gap-8 mb-8 p-8 md:px-16 w-fit max-w-3xl">
      <BoxWrapper className="flex flex-col gap-2">
        <h5 className="font-bold text-xl flex gap-2">
          <Coins stroke="var(--color-secondary)" /> Grynoji vertė
        </h5>
        <div>
          <p>{formattedTotal}</p>
          <p className={`${change > 0 ? "text-primary" : "text-accent"}`}>
            {formattedChange} per paskutinį mėn.
          </p>
        </div>
      </BoxWrapper>
    </div>
  );
}
