"use client";
import { useState, useEffect } from "react";
import DialogWrapper from "../UI/Dialog";
import Button from "../UI/Button";
import Select from "../UI/Select";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

const SplitTransactionModal = ({ open, onClose, transaction, categories, onSplit, loading }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  const [splits, setSplits] = useState([{ categoryName: "", amount: "" }]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setSplits([{ categoryName: "", amount: "" }]);
      setError("");
    }
  }, [open]);

  const transactionAmount = transaction?.amount || 0;

  const addSplit = () => {
    setSplits([...splits, { categoryName: "", amount: "" }]);
  };

  const removeSplit = (index) => {
    if (splits.length > 1) {
      setSplits(splits.filter((_, i) => i !== index));
    }
  };

  const updateSplit = (index, field, value) => {
    const newSplits = [...splits];
    newSplits[index][field] = value;
    setSplits(newSplits);
    setError("");
  };

  const calculateRemaining = () => {
    const allocated = splits.reduce((sum, split) => {
      const amount = parseFloat(split.amount) || 0;
      return sum + amount;
    }, 0);
    return transactionAmount - allocated;
  };

  const validateAndSubmit = () => {
    const validSplits = splits.filter(s => s.categoryName && s.amount);
    
    if (validSplits.length === 0) {
      setError("Pridėk bent vieną padalinimą");
      return;
    }

    const totalAllocated = validSplits.reduce((sum, split) => {
      return sum + parseFloat(split.amount);
    }, 0);

    if (Math.abs(totalAllocated - transactionAmount) > 0.01) {
      setError(`Suma turi būti ${Math.abs(transactionAmount).toFixed(2)}€ (dabar: ${totalAllocated.toFixed(2)}€)`);
      return;
    }

    const categoryCounts = {};
    for (const split of validSplits) {
      if (categoryCounts[split.categoryName]) {
        setError("Negalima naudoti tos pačios kategorijos kelis kartus");
        return;
      }
      categoryCounts[split.categoryName] = true;
    }

    const formattedSplits = validSplits.map(split => ({
      categoryName: split.categoryName,
      amount: parseFloat(split.amount)
    }));

    onSplit(formattedSplits);
  };

  const remaining = calculateRemaining();
  const isValid = Math.abs(remaining) < 0.01;

    return (
    <DialogWrapper open={open} onClose={onClose}>
      <div className={`${theme === 'dark' ? 'bg-[#1A1A40]' : 'bg-white'} ${currentTheme.cardBorder} border p-8 rounded-2xl max-w-2xl w-[90vw] shadow-2xl relative`}>
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentTheme.orbPrimary} to-transparent rounded-full blur-lg -mr-12 -mt-12`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
        
        <div className="flex flex-col gap-6 relative z-10">
          <div>
            <h3 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
              Padalinti operaciją
            </h3>
            <p className={`text-sm ${currentTheme.textMuted} mt-1`}>
              Operacijos suma: <span className="font-semibold">{Math.abs(transactionAmount).toFixed(2)}€</span>
            </p>
          </div>

          <div className={`p-4 rounded-xl ${isValid ? 'bg-[#63EB25]/10 border border-[#63EB25]/30' : 'bg-yellow-500/10 border border-yellow-500/30'} shadow-sm`}>
            <p className={`text-sm font-semibold ${isValid ? 'text-[#63EB25]' : 'text-yellow-600'}`}>
              Likutis: {remaining.toFixed(2)}€
            </p>
          </div>

          <div className="space-y-3 pr-2 -mr-2">
            {splits.map((split, index) => (
              <div key={index} className={`flex gap-2 p-4 flex-wrap gap-4 rounded-xl ${currentTheme.card} ${currentTheme.cardBorder} border shadow-sm`}>
                <div className="flex-1 w-full">
                  <Select
                    value={split.categoryName}
                    onChange={(value) => updateSplit(index, "categoryName", value)}
                    options={categories.map(cat => ({ value: cat[0], label: cat[0] }))}
                    placeholder="Kategorija"
                  />
                </div>
                <div className="w-fit">
                  <input
                    type="number"
                    step="0.01"
                    value={split.amount}
                    onChange={(e) => updateSplit(index, "amount", e.target.value)}
                    placeholder="0.00"
                    className={`px-4 h-10 py-3 rounded-xl ${theme === 'dark' ? 'bg-[#1A1A40]' : 'bg-white'} ${currentTheme.cardBorder} border ${currentTheme.textPrimary} placeholder:${currentTheme.textMuted} focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all`}
                  />
                </div>
                {splits.length > 1 && (
                  <button
                    onClick={() => removeSplit(index)}
                    className="p-2.5 rounded-lg bg-[#EB2563]/20 border border-[#EB2563]/30 hover:bg-[#EB2563]/30 text-[#EB2563] transition-all hover:scale-110 active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={addSplit}
            variant="outline"
            className={`w-full py-3 flex items-center justify-center gap-2 font-medium`}
          >
            <Plus className="w-4 h-4" />
            Pridėti kategoriją
          </Button>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#EB2563]/10 border border-[#EB2563]/30">
              <AlertCircle className="w-5 h-5 text-[#EB2563] flex-shrink-0" />
              <p className="text-sm font-medium text-[#EB2563]">{error}</p>
            </div>
          )}

          <div className={`flex gap-3 pt-4 border-t ${currentTheme.cardBorder}`}>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outline"
              className="flex-1 py-3 font-semibold"
            >
              Atšaukti
            </Button>
            <Button
              onClick={validateAndSubmit}
              disabled={loading || !isValid}
              className={`flex-1 py-3 bg-[#63EB25] hover:bg-[#63EB25]/90 text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl`}
            >
              {loading ? "Saugoma..." : "Išsaugoti"}
            </Button>
          </div>
        </div>
      </div>
    </DialogWrapper>
  );
};

export default SplitTransactionModal;

