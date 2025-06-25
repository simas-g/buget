import { ChartBar } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import Button from "../UI/Button";
import { Plus } from "lucide-react";
export default function Categories({ categories = [], total}) {
  const calculatePercentage = (amount) => {
    return ((amount / total) * 100).toFixed(1);
  };
  const sortedCategories = [...categories].sort((a, b) => b.amount - a.amount);
  return (
    <BoxWrapper className={"relative w-full"}>
      <h5 className="flex items-center gap-2 text-xl font-bold">
        <ChartBar stroke="var(--color-secondary)" size={24} />
        Kategorijos
      </h5>
      <button className="flex absolute right-4 top-4 items-center space-x-2 rounded-lg bg-secondary px-4 py-2 text-white font-medium transition-all cursor-pointer duration-300">
        <Plus className="h-4 w-4" />
        <span>Pridėti</span>
      </button>
      <ul className="mt-4 space-y-3">
        {sortedCategories.map((category) => (
          <li className="flex flex-col gap-2" key={category.color}>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 mr-2 rounded-full"
                style={{ backgroundColor: category.color }}
              ></span>
              {category.name}{" "}
              <span className="text-gray-400 text-xs">
                ({calculatePercentage(category.amount)}%)
              </span>
            </div>

            <div className="w-full relative h-2 rounded-full bg-white/10">
              <div
                style={{
                  width: `${calculatePercentage(category.amount)}%`,
                  backgroundColor: category.color,
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
