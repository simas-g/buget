import { validateToken } from "@/app/lib/auth/session";
import connect from "@/app/lib/connectToDB";
import Transaction from "@/app/lib/models/transaction";
import MonthSummary from "@/app/lib/models/monthSummary";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, categoryName, amount, bookingDate } = body;

  if (!userId || !categoryName || amount === undefined || !bookingDate) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  await connect();

  try {
    const month = bookingDate.slice(0, 7);
    const transactionId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const manualBankId = new mongoose.Types.ObjectId();

    const transaction = await Transaction.create({
      userId,
      amount: Number(amount),
      bookingDate: new Date(bookingDate),
      bankId: manualBankId,
      transactionId,
      type: "manual",
      categoryName,
    });

    const updateResult = await MonthSummary.updateOne(
      { userId, month },
      { 
        $inc: { [`categories.${categoryName}`]: Number(amount) },
        $set: { categoriesInitialized: true }
      }
    );

    if (updateResult.matchedCount === 0) {
      const lastMonth = new Date(bookingDate);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const prevMonth = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
      
      const lastMonthSummary = await MonthSummary.findOne({
        month: prevMonth,
        userId,
      }).lean();
      
      let closingBalance = 0;
      let categories = { [categoryName]: Number(amount) };
      
      if (lastMonthSummary) {
        closingBalance = lastMonthSummary.closingBalance || 0;
        if (lastMonthSummary.categories) {
          Object.keys(lastMonthSummary.categories).forEach((catName) => {
            if (catName !== categoryName) {
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
      });
    }

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("Error creating manual transaction:", error);
    return NextResponse.json({ message: "Failed to create transaction", error: error.message }, { status: 500 });
  }
};

