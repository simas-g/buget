import { NextResponse } from "next/server";
import connect from "@/app/lib/connectToDB";
import MonthSummary from "@/app/lib/models/monthSummary";
import { validateToken } from "@/app/lib/auth/session";
import Transaction from "@/app/lib/models/transaction";
export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, name, userId, month, transactionId } = body;
  console.log(amount, 'amount')
  if (amount === undefined || amount === null || !name || !userId || !month || !transactionId) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 });
  }

  try {
    await connect();

    const existingTransaction = await Transaction.findOne({ transactionId });
    
    // Remove old amount from MonthSummary if transaction was already categorized or manual
    if (existingTransaction && existingTransaction.categoryName && 
        (existingTransaction.type === "categorized" || existingTransaction.type === "manual")) {
      const oldCategoryField = `categories.${existingTransaction.categoryName}`;
      const oldAmount = existingTransaction.amount;
      const oldUpdates = {
        $inc: {
          [oldCategoryField]: -oldAmount,
        },
      };

      if (oldAmount > 0) {
        oldUpdates.$inc.inflow = -oldAmount;
      } else if (oldAmount < 0) {
        oldUpdates.$inc.outflow = -oldAmount;
      }

      await MonthSummary.updateOne(
        { month, userId },
        oldUpdates
      );
    }

    const updateField = `categories.${name}`;
    const updates = {
      $inc: {
        [updateField]: amount,
      },
      $set: {
        categoriesInitialized: true,
      },
    };

    if (amount > 0) {
      updates.$inc.inflow = amount;
    } else if (amount < 0) {
      updates.$inc.outflow = amount;
    }

    const result = await MonthSummary.updateOne(
      { month, userId },
      updates
    );

    if (result.matchedCount === 0) {
      const prevMonth = new Date(month);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
      
      const prevMonthSummary = await MonthSummary.findOne({
        month: prevMonthStr,
        userId,
      }).lean();
      
      let categories = { [name]: amount };
      let closingBalance = 0;
      
      if (prevMonthSummary) {
        closingBalance = prevMonthSummary.closingBalance || 0;
        if (prevMonthSummary.categories) {
          Object.keys(prevMonthSummary.categories).forEach((catName) => {
            if (catName !== name) {
              categories[catName] = 0;
            }
          });
        }
      }

      await MonthSummary.create({
        month,
        userId,
        closingBalance,
        categories,
        categoriesInitialized: true,
        inflow: amount > 0 ? amount : 0,
        outflow: amount < 0 ? amount : 0,
      });
    }

    // Build the update object (reuse existingTransaction from earlier)
    const transactionUpdate = {
      $set: { 
        categoryName: name,
        // Only set type to "categorized" if it's not already "manual" or "split"
        type: existingTransaction?.type === "manual" ? "manual" : "categorized"
      },
    };
    
    // Update amount if it's a manual transaction and amount has changed
    if (existingTransaction?.type === "manual" && existingTransaction.amount !== amount) {
      transactionUpdate.$set.amount = amount;
    }
    
    await Transaction.updateOne(
      { transactionId },
      transactionUpdate
    );
    return NextResponse.json(
      { message: "Update successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
