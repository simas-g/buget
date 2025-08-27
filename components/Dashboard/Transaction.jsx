import { formatCurrencyVisually, sliceString } from "@/app/util/format";
import DialogWrapper from "../UI/Dialog";
import { useEffect, useState } from "react";
import Button from "../UI/Button";

const Transaction = ({
  id,
  type = "uncategorized",
  operation = {},
  refetch,
}) => {
  let content;
  const currency = formatCurrencyVisually(operation.amount);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = JSON.parse(sessionStorage.getItem("monthlySummary"));
    const array = Array.from(Object.entries(data.summary.categories));
    setCategories(array);
  }, []);
  const handleOpenCategorize = () => {
    setShowEdit(true);
  };
  const handleCategorizeClose = () => {
    setShowEdit(false);
  };
  const handleBlacklist = async (key) => {
    try {
      const res = await fetch("/api/category/blacklist", {
        method: "PATCH",
        body: JSON.stringify({ transactionId: operation.transactionId }),
      });
      if (res.ok) {
        return true;
      } else return false;
    } catch (error) {
      return false;
    } finally {
      await refetch();
      handleCategorizeClose();
    }
  };
  const handleCategorize = async (key) => {
    try {
      setLoading(true);
      const res = await fetch("/api/category/assign", {
        method: "POST",
        body: JSON.stringify({
          userId: id,
          name: key,
          month: operation.bookingDate.slice(0, 7),
          amount: operation.amount,
          transactionId: operation.transactionId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        return true;
      }
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
      await refetch();
      handleCategorizeClose();
    }
  };
  if (type === "categorized") {
    content = (
      <div
        key={operation.transactionId}
        className="flex gap-4 flex-wrap p-3 overflow-hidden rounded-full relative justify-between w-full bg-[#0A0A20]/50 border border-white/10"
      >
        <div className="flex gap-x-2 items-center w-fit">
          <div className={`w-2 h-2 rounded-full bg-secondary`}></div>
          <p>{operation?.categoryName}</p> |
          <p className="text-gray-300">
            {operation?.bookingDate.split("T")[0]}
          </p>
        </div>

        <p className={currency.style + " text-right"}>{currency.amount}</p>
        <div className="absolute inset-0">
          <div
            className={`absolute top-[60%] left-[20%] h-[40px] w-[250px] rounded-full blur-[100px] bg-[${operation.color}]`}
          />
        </div>
      </div>
    );
  } else if (type === "uncategorized") {
    content = (
      <div key={operation?._id}>
        {showEdit && (
          <DialogWrapper
            open={showEdit}
            onClose={handleCategorizeClose}
            className="flex flex-col gap-2"
          >
            {categories.length === 0 && <p>Kol kas kategorijų nėra sukurta</p>}

            {categories?.map(([key, value], i) => (
              <Button
                onClick={() => handleCategorize(key)}
                className="px-4 py-1 border-gray-400 border bg-gray-100"
              >
                {key}
              </Button>
            ))}
            <div className="flex gap-3 w-full mt-3">
              <Button onClick={handleCategorizeClose} className="underline">
                Praleisti
              </Button>
              <Button
                onClick={handleBlacklist}
                className="bg-black w-full text-white py-2"
              >
                Naikinti
              </Button>
            </div>
          </DialogWrapper>
        )}
        <li
          onClick={handleOpenCategorize}
          className="flex gap-4 hover:bg-black cursor-pointer flex-wrap p-3 overflow-hidden rounded-lg relative justify-between w-full bg-[#0A0A20]/50 border border-white/40"
        >
          <div className="flex gap-x-2 items-center w-fit">
            <p className="text-white">
              {sliceString(operation?.creditorName || '', 18) || "nežinoma"} |{" "}
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
      </div>
    );
  }
  return content;
};

export default Transaction;
