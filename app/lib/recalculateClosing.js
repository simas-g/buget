import { getCurrentMonthDate } from "../util/format";
import BankConnection from "./models/bankConnection";
import MonthSummary from "./models/monthSummary";

export async function recalculateCurrentClosing(userId) {
  const balances = await BankConnection.find(
    { userId },
    { balance: 1, _id: 0 }
  ).lean();
  const totalNet = balances.reduce((acc, bank) => {
    acc += bank.balance;
    return acc;
  }, 0);
  const month = getCurrentMonthDate();
  const summary = await MonthSummary.findOne(
    {
      getCurrentMonthDate,
      userId,
    },
    { inflow: 0, outflow: 0, closingBalance: 1, categories: 0, _id: 0 }
  ).lean();
  if (summary?.closingBalance !== totalNet) {
    await MonthSummary.updateOne(
      {
        userId,
        month,
      },
      {
        $set: {
          closingBalance: totalNet,
        },
      }
    );
  }
}
