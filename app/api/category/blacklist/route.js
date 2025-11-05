import { validateToken } from "@/app/lib/auth/session";
import Transaction from "@/app/lib/models/transaction";
import MonthSummary from "@/app/lib/models/monthSummary";
import connect from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { transactionId } = body;
  try {
    await connect();
    
    const transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    if (transaction.type === "categorized" && transaction.categoryName) {
      const month = transaction.bookingDate.toISOString().slice(0, 7);
      const categoryField = `categories.${transaction.categoryName}`;
      
      const updates = {
        $inc: {
          [categoryField]: -transaction.amount,
        },
      };

      if (transaction.amount > 0) {
        updates.$inc.inflow = -transaction.amount;
      } else if (transaction.amount < 0) {
        updates.$inc.outflow = -transaction.amount;
      }

      await MonthSummary.updateOne(
        { month, userId: transaction.userId },
        updates
      );
    }

    await Transaction.updateOne({ transactionId }, { type: "blacklisted", categoryName: null });
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
