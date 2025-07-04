import { formatCurrencyVisually } from "@/app/util/format";
import DialogWrapper from "../UI/Dialog";
import { useEffect, useState } from "react";
import Button from "../UI/Button";

const Transaction = ({ id, type = "uncategorized", operation = {}, refetch }) => {
  let content;
  const currency = formatCurrencyVisually(operation.amount);
  const [loading, setLoading] = useState(false)
  const [showEdit, setShowEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = JSON.parse(sessionStorage.getItem("monthlySummary"));
    const array = Array.from(Object.entries(data.categories));
    setCategories(array);
  }, []);
  const handleOpenCategorize = () => {
    setShowEdit(true);
  };
  const handleCategorizeClose = () => {
    setShowEdit(false);
  };

  const handleCategorize = async (key) => {
    try {
      setLoading(true)
      const res = await fetch("/api/category/assign", {
        method: "POST",
        body: JSON.stringify({
          userId: id,
          name: key,
          month: operation.bookingDate.slice(0, 7),
          amount: operation.amount,
          transactionId: operation.transactionId
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return true;
      }
    } catch (error) {
      return false;
    } finally {
      setLoading(false)
      await refetch()
      handleCategorizeClose()
    }
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
      <>
        {showEdit && (
          <DialogWrapper
            open={showEdit}
            onClose={handleCategorizeClose}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="kategorija"
                className="border outline-none px-4 py-2 rounded-lg placeholder:text-sm placeholder:text-gray-400"
              />
              <button className="w-fit border px-4 py-2 rounded-lg cursor-pointer bg-primary">
                Pridėti naują
              </button>
            </div>
            {categories?.map(([key, value], i) => (
              <Button onClick={() => handleCategorize(key)} className="px-4 py-2 border-gray-400 border bg-gray-100">
                {key}
              </Button>
            ))}
          </DialogWrapper>
        )}
        <li
          onClick={handleOpenCategorize}
          className="flex gap-4 hover:bg-black cursor-pointer flex-wrap p-3 overflow-hidden rounded-lg relative justify-between w-full bg-[#0A0A20]/50 border border-white/40"
        >
          <div className="flex gap-x-2 items-center w-fit">
            <p className="text-white">
              {operation?.creditorName || "nežinoma"} |{" "}
            </p>
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
      </>
    );
  }
  return <>{content}</>;
};

export default Transaction;
