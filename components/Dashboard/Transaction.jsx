import { formatCurrencyVisually, formatDate } from "@/app/util/format";
import { color } from "motion";

const Transaction = ({ type = "uncategorized", operation = {} }) => {
  let content;
  const currency = formatCurrencyVisually(operation.amount);
  if (type === "uncategorized") {
    content = (
      <li className="flex gap-4 flex-wrap p-3 overflow-hidden rounded-full relative justify-between w-full bg-[#0A0A20]/50 border border-white/10">
        <div className="flex gap-x-2 items-center w-fit">
          <div className={`w-2 h-2 rounded-full bg-secondary`}></div>
          <p>{operation?.category}</p> |
          <p className="text-gray-300 w-full">{operation?.date}</p>
        </div>

        <p className={currency.style + " text-right"}>
          {currency.amount}
        </p>
        <div className="absolute inset-0">
          <div
            className={`absolute top-[60%] left-[20%] h-[40px] w-[250px] rounded-full blur-[100px] bg-[${operation.color}]`}
          />
        </div>
      </li>
    );
  }
  return <>{content}</>;
};

export default Transaction;
