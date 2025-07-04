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

    const updateField = `categories.${name}`;
    const result = await MonthSummary.updateOne(
      { month, userId },
      {
        $inc: {
          [updateField]: amount,
        },
      },
      {
        upsert: true,
      }
    );
    await Transaction.updateOne(
      { transactionId },
      {
        $set: { type: "categorized" },
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
