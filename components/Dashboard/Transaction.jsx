import { formatCurrencyVisually, sliceString } from "@/app/util/format";
import DialogWrapper from "../UI/Dialog";
import { useEffect, useState } from "react";
import Button from "../UI/Button";
import Link from "next/link";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";
import SplitTransactionModal from "./SplitTransactionModal";
import { Wallet } from "lucide-react";

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
  const [showSplit, setShowSplit] = useState(false);
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
  const handleOpenSplit = () => {
    setShowSplit(true);
  };
  const handleSplitClose = () => {
    setShowSplit(false);
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
  const handleSplit = async (splits) => {
    try {
      setLoading(true);
      const res = await fetch("/api/category/split", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          month: operation.bookingDate.slice(0, 7),
          transactionId: operation.transactionId,
          splits,
        }),
      });
      if (res.ok) {
        return true;
      }
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
      await refetch();
      handleSplitClose();
      handleCategorizeClose();
    }
  };
  if (type === "categorized") {
    content = (
      <div
        key={operation.transactionId}
        className={`flex gap-4 flex-wrap p-4 overflow-hidden rounded-xl relative justify-between w-full ${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.cardHover} transition-all duration-150 group`}
      >
        <div className="flex gap-x-3 items-center w-fit">
          <div className={`w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-sm shadow-[#2563EB]/50`}></div>
          <p className={`${currentTheme.textPrimary} font-medium`}>{operation?.categoryName}</p>
          <span className={theme === 'dark' ? "text-white/30" : "text-slate-400"}>|</span>
          <p className={`${currentTheme.textMuted} text-sm`}>
            {operation?.bookingDate.split("T")[0]}
          </p>
          {operation?.type === "manual" && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-[#63EB25]/20 text-[#63EB25] border border-[#63EB25]/30 flex items-center gap-1">
              <Wallet className="w-3 h-3" />
              Grynais
            </span>
          )}
        </div>

        <p className={`${currency.style} text-right font-semibold`}>{currency.amount}</p>
      </div>
    );
  } else if (type === "uncategorized") {
    content = (
      <div key={operation?._id}>
        <SplitTransactionModal
          open={showSplit}
          onClose={handleSplitClose}
          transaction={operation}
          categories={categories}
          onSplit={handleSplit}
          loading={loading}
        />
        {showEdit && (
          <DialogWrapper
            open={showEdit}
            onClose={handleCategorizeClose}
          >
            <div className={`${theme === 'dark' ? 'bg-[#1A1A40]' : 'bg-white'} ${currentTheme.cardBorder} border p-6 rounded-2xl shadow-2xl relative overflow-hidden max-w-md w-full`}>
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentTheme.orbPrimary} to-transparent rounded-full blur-lg -mr-12 -mt-12`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
              
              <div className="flex flex-col gap-4 relative z-10">
                <div>
                  <h3 className={`text-xl font-bold ${currentTheme.textPrimary} mb-1`}>
                    Kategorizuoti operaciją
                  </h3>
                  <p className={`text-sm ${currentTheme.textMuted}`}>
                    Pasirink kategoriją arba padalink į kelias
                  </p>
                </div>

            {categories.length === 0 ? (
              <div className={`text-center py-6 ${currentTheme.card} ${currentTheme.cardBorder} border rounded-xl`}>
                <p className={`text-sm mb-3 ${currentTheme.textPrimary}`}>Kategorijų nėra.</p>
                <Link
                  href="/skydelis/kategorijos"
                  className={`inline-block rounded-lg px-4 py-2 ${currentTheme.card} ${currentTheme.cardBorder} border ${currentTheme.textPrimary} hover:bg-[#2563EB]/10 transition-colors font-medium`}
                >
                  Sukurti naują
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 -mr-2">
                  {categories?.map(([key, value], i) => (
                    <Button
                      key={i}
                      onClick={() => handleCategorize(key)}
                      className={`w-full px-4 py-3 ${currentTheme.card} ${currentTheme.cardBorder} border ${currentTheme.textPrimary} ${currentTheme.buttonHover} font-medium transition-all text-left shadow-sm hover:shadow-md`}
                    >
                      {key}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={handleOpenSplit}
                  className="w-full px-4 py-3 border-[#2563EB] border bg-[#2563EB]/10 text-[#2563EB] font-medium hover:bg-[#2563EB]/20 transition-all hover:scale-[1.01] shadow-sm hover:shadow-md"
                >
                  Padalinti į kelias kategorijas
                </Button>

                <div className={`flex gap-3 w-full pt-4 border-t ${currentTheme.cardBorder}`}>
                  <Button 
                    onClick={handleCategorizeClose} 
                    className={`flex-1 ${currentTheme.textMuted} hover:${currentTheme.textPrimary} transition-colors`}
                  >
                    Praleisti
                  </Button>
                  <Button
                    onClick={handleBlacklist}
                    className="flex-1 bg-[#EB2563]/20 border border-[#EB2563]/30 hover:bg-[#EB2563]/30 text-[#EB2563] font-medium py-2 transition-all hover:scale-[1.02]"
                  >
                    Naikinti
                  </Button>
                </div>
              </>
            )}
              </div>
            </div>
          </DialogWrapper>
        )}
        <li
          onClick={handleOpenCategorize}
          className={`flex gap-4 cursor-pointer flex-wrap p-4 overflow-hidden rounded-xl relative justify-between w-full ${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.cardHover} transition-all duration-150 group`}
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
        </li>
      </div>
    );
  }
  return content;
};

export default Transaction;
