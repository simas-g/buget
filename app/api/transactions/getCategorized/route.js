import { validateToken } from "@/app/lib/auth/session";
import connect from "@/app/lib/connectToDB";
import Transaction from "@/app/lib/models/transaction";
import { calculateClosing } from "@/app/util/calculateClosing";
import { NextResponse } from "next/server";

export async function GET(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = req.nextUrl.searchParams.get("userId");
  const limit = req.nextUrl.searchParams.get("limit");
  if (!userId) {
    return NextResponse.json({ message: "no data" }, { status: 400 });
  }

  await connect();
  await calculateClosing(userId);
  try {
    const transactions = await Transaction.find({
      userId,
      type: { $in: ["categorized", "manual", "split"] },
    })
      .limit(limit)
      .sort({ bookingDate: -1 })
      .lean();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
