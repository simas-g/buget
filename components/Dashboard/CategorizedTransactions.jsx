import { Book, Plus } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import Transaction from "./Transaction";
import Button from "../UI/Button";
export default function Categorized({ operations = [] }) {
  return (
    <BoxWrapper className="flex flex-col gap-y-4 w-full">
      <div className="flex flex-wrap gap-4 justify-between">
        <h5 className="text-xl font-bold flex items-center gap-x-2">
          <Book size={24} stroke="var(--color-secondary)" />
          Kategorizuotos operacijos
        </h5>
        <Button variant="outline" className="px-4 py-2 absolute top-4 right-4">
          <span>Valdyti</span>
        </Button>
      </div>

      <ul className="space-y-4">
        {operations.map((op) => (
          <Transaction operation={op} key={`${op.category}-${op.amount}`} />
        ))}
      </ul>
      {operations.length > 0 && (
        <button className="text-left underline w-fit">Peržiūrėti visas</button>
      )}
    </BoxWrapper>
  );
}
