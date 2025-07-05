import { Book, Plus } from "lucide-react";
import BoxWrapper from "./BoxWrapper";
import Transaction from "./Transaction";
import Button from "../UI/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchCategorizedTransactions } from "@/app/util/http";
import { useSelector } from "react-redux";
export default function Categorized({ operations = [] }) {
  const user = useSelector((state) => state.user);
  if (!user) {
    return;
  }
  const { data: cTransactions, isLoading } = useQuery({
    queryFn: async () => fetchCategorizedTransactions(user.userId),
    queryKey: ["categorized", user.userId],
  });
  return (
    <BoxWrapper className="flex flex-col p-5 gap-y-4 w-full">
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
