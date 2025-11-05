import { validateToken } from "@/app/lib/auth/session";
import connect from "@/app/lib/connectToDB";
import MonthSummary from "@/app/lib/models/monthSummary";
import Transaction from "@/app/lib/models/transaction";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  try {
    await connect();

    const categorizedTransactions = await Transaction.find({
      userId,
      type: "categorized",
    }).lean();

    const summaryMap = {};

    categorizedTransactions.forEach((tx) => {
      const month = tx.bookingDate.toISOString().slice(0, 7);

      if (!summaryMap[month]) {
        summaryMap[month] = {
          inflow: 0,
          outflow: 0,
          categories: {},
        };
      }

      if (tx.amount > 0) {
        summaryMap[month].inflow += tx.amount;
      } else if (tx.amount < 0) {
        summaryMap[month].outflow += tx.amount;
      }

      if (tx.categoryName) {
        if (!summaryMap[month].categories[tx.categoryName]) {
          summaryMap[month].categories[tx.categoryName] = 0;
        }
        summaryMap[month].categories[tx.categoryName] += tx.amount;
      }
    });

    const updates = Object.entries(summaryMap).map(([month, data]) => {
      const categoriesMap = new Map(Object.entries(data.categories));
      
      return MonthSummary.updateOne(
        { month, userId },
        {
          $set: {
            inflow: data.inflow,
            outflow: data.outflow,
            categories: categoriesMap,
          },
        },
        { upsert: true }
      );
    });

    await Promise.all(updates);

    return NextResponse.json(
      {
        message: "Summaries recalculated successfully",
        monthsUpdated: Object.keys(summaryMap).length,
        transactionsProcessed: categorizedTransactions.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recalculation failed:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};

