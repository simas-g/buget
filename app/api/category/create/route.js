import { validateToken } from "@/app/lib/auth/session";
import MonthSummary from "@/app/lib/models/monthSummary";
import { NextResponse } from "next/server";
import { getPreviousMonthDate } from "@/app/util/format";
import { getCurrentMonthDate } from "@/app/util/format";
export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { name, userId, date } = body;
  ///date to be '2020-02' format
  if (!name || !userId || !date) {
    return NextResponse.json({ message: "missing data" }, { status: 400 });
  }
  const update = await MonthSummary.updateOne(
    { userId, month: date },
    { $set: { [`categories.${name}`]: 0 } } 
  );

  const { matchedCount } = update;
  //create summary if doesnt exsist already
  if (matchedCount == 0) {
    const lastMonthSummary = await MonthSummary.findOne({
      month: getPreviousMonthDate(),
      userId,
    }).lean();
    let closingBalance = 0;
    if (lastMonthSummary) {
      closingBalance = lastMonthSummary.closingBalance || 0;
    }
    const summary = await MonthSummary.create({
      month: getCurrentMonthDate(),
      userId,
      closingBalance,
      categories: {
        [name]: 0,
      },
    });
    console.log(summary, "our summary");
  }
  return NextResponse.json({ message: "success" }, { status: 200 });
}
