import { Book, Plus } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import Transaction from "./Transaction";
import Button from "../UI/Button";
export default function Categorized({
  operations = [
    { category: "food", amount: -57, date: "2025-03-01", color: "#000000" },
    { category: "salary", amount: 5000, date: "2025-03-11", color: "#000000" },
    { category: "education", amount: -40, date: "2025-03-04", color: "#000000" },
    { category: "entertainment", amount: -1515, date: "2025-03-21", color: "#000000" },
  ],
}) {
  return (
    <BoxWrapper className="flex flex-col gap-y-4 items-">
      <div className="flex flex-wrap gap-4 justify-between">
        <h5 className="text-xl font-bold flex items-center gap-x-2">
          <Book size={24} stroke="var(--color-secondary)" />
          Kategorizuotos operacijos
        </h5>
        <Button variant="outline" className="px-4 py-1">
          Pridėti rankiniu būdu
        </Button>
      </div>

      <ul className="space-y-4">
        {operations.map((op) => (
          <Transaction operation={op} key={`${op.category}-${op.amount}`} />
        ))}
      </ul>
      <button className="text-left underline w-fit">Peržiūrėti visas</button>
    </BoxWrapper>
  );
}
