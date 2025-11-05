import { validateToken } from "@/app/lib/auth/session";
import MonthSummary from "@/app/lib/models/monthSummary";
import Transaction from "@/app/lib/models/transaction";
import connect from "@/app/lib/connectToDB";
import { NextResponse } from "next/server";
export async function DELETE(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { name, userId, date } = body;
  if (!name || !userId || !date) {
    return NextResponse.json({ message: "missing data" }, { status: 400 });
  }

  try {
    await connect();

    const summary = await MonthSummary.findOne({ userId, month: date });
    if (!summary) {
      return NextResponse.json({ message: "Summary not found" }, { status: 404 });
    }

    const categoryAmount = summary.categories?.get(name) || 0;

    const updates = {
      $unset: { [`categories.${name}`]: 0 }
    };

    if (categoryAmount !== 0) {
      updates.$inc = {};
      if (categoryAmount > 0) {
        updates.$inc.inflow = -categoryAmount;
      } else if (categoryAmount < 0) {
        updates.$inc.outflow = -categoryAmount;
      }
    }

    await MonthSummary.updateOne(
      { userId, month: date },
      updates
    );

    await Transaction.updateMany(
      { userId, categoryName: name },
      { $set: { type: "fetched", categoryName: null } }
    );

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
