import { validateToken } from "@/app/lib/auth/session";
import MonthSummary from "@/app/lib/models/monthSummary";
import { NextResponse } from "next/server";
export async function DELETE(req) {
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
    { $unset: { [`categories.${name}`]: 0 } } 
  );

  const { matchedCount } = update;
  return NextResponse.json({ message: "success" }, { status: 200 });
}
