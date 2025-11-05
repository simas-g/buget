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
  if (!amount || !name || !userId || !month || !transactionId) {
    return NextResponse.json({ message: "Missing data" }, { status: 400 });
  }

  try {
    await connect();

    const existingTransaction = await Transaction.findOne({ transactionId });
    
    if (existingTransaction?.type === "categorized" && existingTransaction?.categoryName) {
      const oldCategoryField = `categories.${existingTransaction.categoryName}`;
      const oldUpdates = {
        $inc: {
          [oldCategoryField]: -amount,
        },
      };

      if (amount > 0) {
        oldUpdates.$inc.inflow = -amount;
      } else if (amount < 0) {
        oldUpdates.$inc.outflow = -amount;
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
    };

    if (amount > 0) {
      updates.$inc.inflow = amount;
    } else if (amount < 0) {
      updates.$inc.outflow = amount;
    }

    const result = await MonthSummary.updateOne(
      { month, userId },
      updates,
      {
        upsert: true,
      }
    );
    await Transaction.updateOne(
      { transactionId },
      {
        $set: { type: "categorized", categoryName: name },
      }
    );
    return NextResponse.json(
      { message: "Update successful", result },
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
