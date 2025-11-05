import { useMemo } from "react";
import { 
  isTestMode, 
  getTestTransactions, 
  getTestBankConnections, 
  getTestMonthSummaries 
} from "../lib/testMode";

export const useTestModeData = (dataType) => {
  return useMemo(() => {
    if (!isTestMode()) return null;
    
    switch (dataType) {
      case "transactions":
        return getTestTransactions();
      case "bankConnections":
        return getTestBankConnections();
      case "monthSummaries":
        return getTestMonthSummaries();
      default:
        return null;
    }
  }, [dataType]);
};

export const getTestMonthSummary = (month) => {
  if (!isTestMode()) return null;
  
  const summaries = getTestMonthSummaries();
  return summaries.find(s => s.month === month) || null;
};

