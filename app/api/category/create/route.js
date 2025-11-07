import { validateToken } from "@/app/lib/auth/session";
import MonthSummary from "@/app/lib/models/monthSummary";
import { NextResponse } from "next/server";
import { getPreviousMonthDate } from "@/app/util/format";
import { getCurrentMonthDate } from "@/app/util/format";
import connect from "@/app/lib/connectToDB";

export async function POST(req) {
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
    
    const update = await MonthSummary.updateOne(
      { userId, month: date },
      { $set: { [`categories.${name}`]: 0, categoriesInitialized: true } } 
    );

    const { matchedCount } = update;
    
    if (matchedCount == 0) {
      const lastMonthSummary = await MonthSummary.findOne({
        month: getPreviousMonthDate(date),
        userId,
      }).lean();
      let closingBalance = 0;
      let categories = { [name]: 0 };
      if (lastMonthSummary) {
        closingBalance = lastMonthSummary.closingBalance || 0;
        if (lastMonthSummary.categories) {
          Object.keys(lastMonthSummary.categories).forEach((categoryName) => {
            if (categoryName !== name) {
              categories[categoryName] = 0;
            }
          });
        }
      }
      const summary = await MonthSummary.create({
        month: date,
        userId,
        closingBalance,
        categories,
        categoriesInitialized: true,
      });
      console.log(summary, "our summary");
    }
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("Create category failed:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
