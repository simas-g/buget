import MonthSummary from "@/app/lib/models/monthSummary";
import { getCurrentMonthDate, getPreviousMonthDate } from "@/app/util/format";
import { NextResponse } from "next/server";
import { validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import connect from "@/app/lib/connectToDB";
export async function GET(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  await connect();
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const month = url.searchParams.get("month");
    if (!userId || !month) {
      throw new Error();
    }
    const balances = await BankConnection.find(
      { userId },
      { balance: 1, _id: 0 }
    ).lean();
    const totalNet = balances.reduce((acc, bank) => {
      acc += bank.balance;
      return acc;
    }, 0);
    const allSummaries = await MonthSummary.find(
      { userId },
      { categories: 1, _id: 0 }
    ).lean();
    
    let allDefinedCategories = new Set();
    allSummaries.forEach((prevSummary) => {
      if (prevSummary?.categories) {
        Object.keys(prevSummary.categories).forEach((key) => {
          allDefinedCategories.add(key);
        });
      }
    });

    let summary = await MonthSummary.findOne(
      {
        month,
        userId,
      },
      { inflow: 1, outflow: 1, closingBalance: 1, categories: 1, _id: 0 }
    ).lean();
    
    if (!summary) {
      let categories = new Map();
      allDefinedCategories.forEach((categoryName) => {
        categories.set(categoryName, 0);
      });
      
      await MonthSummary.create({
        month,
        userId,
        inflow: 0,
        outflow: 0,
        closingBalance: totalNet,
        categories,
      });
      
      summary = await MonthSummary.findOne(
        {
          month,
          userId,
        },
        { inflow: 1, outflow: 1, closingBalance: 1, categories: 1, _id: 0 }
      ).lean();
    } else {
      const missingCategories = {};
      let hasMissingCategories = false;
      
      allDefinedCategories.forEach((categoryName) => {
        if (!summary.categories || !(categoryName in summary.categories)) {
          missingCategories[`categories.${categoryName}`] = 0;
          hasMissingCategories = true;
        }
      });
      
      if (hasMissingCategories || summary.closingBalance !== totalNet) {
        const updateFields = { ...missingCategories };
        if (summary.closingBalance !== totalNet) {
          updateFields.closingBalance = totalNet;
        }
        
        await MonthSummary.updateOne(
          {
            userId,
            month,
          },
          {
            $set: updateFields,
          }
        );
        
        summary = await MonthSummary.findOne(
          {
            month,
            userId,
          },
          { inflow: 1, outflow: 1, closingBalance: 1, categories: 1, _id: 0 }
        ).lean();
      }
    }

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      { message: error.message || "Unknown error" },
      { status: 400 }
    );
  }
}
