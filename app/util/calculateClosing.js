import connect from "../lib/connectToDB";
import MonthSummary from "../lib/models/monthSummary";

export async function calculateClosing(userId) {
  await connect();
  const allMonthSummaries = await MonthSummary.find({
    userId,
  }).lean();
  const sortedSummaries = allMonthSummaries.sort((a, b) => b.month - a.month);
  let updates = [];
  let lastSummary = {
    closed: sortedSummaries[0].closingBalance,
    flow: sortedSummaries[0].inflow * -1 + sortedSummaries[0].outflow * -1,
  };
  for (let i = 1; i < sortedSummaries.length; i++) {
    const cycleClosed = lastSummary.closed + lastSummary.flow;
    lastSummary = {
      closed: cycleClosed,
      flow: sortedSummaries[i].inflow * -1 + sortedSummaries[i].outflow * -1,
    };
    updates.push(lastSummary);
  }
  console.log(updates, 'our updates')
}
