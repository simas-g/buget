import { formatCurrencyVisually } from "@/app/util/format";

const Transaction = ({ type = "uncategorized", operation = {} }) => {
  let content;
  const currency = formatCurrencyVisually(operation.amount);
  const handleCategorize = () => {
    ///create function to delete fetched transaction
    ///after successfull categorization
  };
  if (type === "categorized") {
    content = (
      <li className="flex gap-4 flex-wrap p-3 overflow-hidden rounded-full relative justify-between w-full bg-[#0A0A20]/50 border border-white/10">
        <div className="flex gap-x-2 items-center w-fit">
          <div className={`w-2 h-2 rounded-full bg-secondary`}></div>
          <p>{operation?.category}</p> |
          <p className="text-gray-300">{operation?.date}</p>
        </div>

        <p className={currency.style + " text-right"}>{currency.amount}</p>
        <div className="absolute inset-0">
          <div
            className={`absolute top-[60%] left-[20%] h-[40px] w-[250px] rounded-full blur-[100px] bg-[${operation.color}]`}
          />
        </div>
      </li>
    );
  } else if (type === "uncategorized") {
    content = (
      <li className="flex gap-4 hover:bg-black cursor-pointer flex-wrap p-3 overflow-hidden rounded-lg relative justify-between w-full bg-[#0A0A20]/50 border border-white/40">
        <div className="flex gap-x-2 items-center w-fit">
          <p className="text-white">{operation?.creditorName || 'nežinoma'} | </p>
          <p className="text-gray-400">
            {operation?.bookingDate.split("T")[0]}
          </p>
        </div>
        <p className={currency.style + " text-right"}>{currency.amount}</p>
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
