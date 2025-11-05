import { formatCurrencyVisually, sliceString } from "@/app/util/format";
import DialogWrapper from "../UI/Dialog";
import { useEffect, useState } from "react";
import Button from "../UI/Button";
import Link from "next/link";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

const Transaction = ({
  id,
  type = "uncategorized",
  operation = {},
  refetch,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  let content;
  const currency = formatCurrencyVisually(operation.amount);
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = JSON.parse(sessionStorage?.getItem("monthlySummary"));
    if(!data) return
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
        className={`flex gap-4 flex-wrap p-4 overflow-hidden rounded-xl relative justify-between w-full ${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.cardHover} transition-all duration-300 group`}
      >
        <div className="flex gap-x-3 items-center w-fit">
          <div className={`w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-sm shadow-[#2563EB]/50 animate-pulse`}></div>
          <p className={`${currentTheme.textPrimary} font-medium`}>{operation?.categoryName}</p>
          <span className={theme === 'dark' ? "text-white/30" : "text-slate-400"}>|</span>
          <p className={`${currentTheme.textMuted} text-sm`}>
            {operation?.bookingDate.split("T")[0]}
          </p>
        </div>

        <p className={`${currency.style} text-right font-semibold`}>{currency.amount}</p>
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div
            className={`absolute top-[50%] left-[20%] h-[60px] w-[200px] rounded-full blur-[80px] ${currentTheme.orbSecondary}`}
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
            {categories.length === 0 ? (
              <>
                <p className="text-sm mb-1">Kategorijų nėra.</p>
                <Link
                  href="/skydelis/kategorijos"
                  className="w-full border rounded-lg p-2"
                >
                  Sukurti naują
                </Link>
              </>
            ) : (
              <>
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
                    className="bg-black w-full text-white p-2"
                  >
                    Naikinti
                  </Button>
                </div>
              </>
            )}
          </DialogWrapper>
        )}
        <li
          onClick={handleOpenCategorize}
          className={`flex gap-4 cursor-pointer flex-wrap p-4 overflow-hidden rounded-xl relative justify-between w-full ${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.cardHover} transition-all duration-300 group`}
        >
          <div className="flex gap-x-3 items-center w-fit">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EB2563]/50 group-hover:bg-[#EB2563] transition-colors"></div>
            <p className={`${currentTheme.textPrimary} font-medium`}>
              {sliceString(operation?.creditorName || "", 18) || "nežinoma"}
            </p>
            <span className={theme === 'dark' ? "text-white/30" : "text-slate-400"}>|</span>
            <p className={`${currentTheme.textMuted} text-sm`}>
              {operation?.bookingDate.split("T")[0]}
            </p>
          </div>
          <p className={`${currency.style} text-right font-semibold`}>{currency.amount}</p>
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              className={`absolute top-[50%] left-[20%] h-[60px] w-[200px] rounded-full blur-[80px] ${currentTheme.orbAccent}`}
            />
          </div>
        </li>
      </div>
    );
  }
  return content;
};

export default Transaction;
