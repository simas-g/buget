import { NextResponse } from "next/server";
import connect from "@/app/lib/connectToDB";
import MonthSummary from "@/app/lib/models/monthSummary";
import { validateToken } from "@/app/lib/auth/session";
import Transaction from "@/app/lib/models/transaction";
import TransactionSplit from "@/app/lib/models/transactionSplit";

export const POST = async (req) => {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, month, transactionId, splits } = body;

  if (!userId || !month || !transactionId || !splits || !Array.isArray(splits) || splits.length === 0) {
    return NextResponse.json({ message: "Missing or invalid data" }, { status: 400 });
  }

  const totalSplitAmount = splits.reduce((sum, split) => sum + split.amount, 0);
  
  try {
    await connect();

    const existingTransaction = await Transaction.findOne({ transactionId });
    if (!existingTransaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    if (Math.abs(totalSplitAmount - existingTransaction.amount) > 0.01) {
      return NextResponse.json({ 
        message: "Split amounts must equal transaction amount",
        expected: existingTransaction.amount,
        received: totalSplitAmount
      }, { status: 400 });
    }

    if (existingTransaction.type === "categorized" && existingTransaction.categoryName) {
      const oldCategoryField = `categories.${existingTransaction.categoryName}`;
      const oldAmount = existingTransaction.amount;
      const oldUpdates = {
        $inc: {
          [oldCategoryField]: -oldAmount,
        },
      };

      if (oldAmount > 0) {
        oldUpdates.$inc.inflow = -oldAmount;
      } else if (oldAmount < 0) {
        oldUpdates.$inc.outflow = -oldAmount;
      }

      await MonthSummary.updateOne(
        { month, userId },
        oldUpdates
      );
    } else if (existingTransaction.type === "split") {
      const existingSplit = await TransactionSplit.findOne({ transactionId });
      if (existingSplit) {
        for (const split of existingSplit.splits) {
          const categoryField = `categories.${split.categoryName}`;
          const updates = {
            $inc: {
              [categoryField]: -split.amount,
            },
          };

          if (split.amount > 0) {
            updates.$inc.inflow = -split.amount;
          } else if (split.amount < 0) {
            updates.$inc.outflow = -split.amount;
          }

          await MonthSummary.updateOne(
            { month, userId },
            updates
          );
        }
      }
    }

    const existingSummary = await MonthSummary.findOne({ month, userId });
    
    if (!existingSummary) {
      const prevMonth = new Date(month);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
      
      const prevMonthSummary = await MonthSummary.findOne({
        month: prevMonthStr,
        userId,
      }).lean();
      
      let categories = {};
      let closingBalance = 0;
      
      if (prevMonthSummary) {
        closingBalance = prevMonthSummary.closingBalance || 0;
        if (prevMonthSummary.categories) {
          Object.keys(prevMonthSummary.categories).forEach((catName) => {
            categories[catName] = 0;
          });
        }
      }

      splits.forEach((split) => {
        categories[split.categoryName] = (categories[split.categoryName] || 0) + split.amount;
      });

      let inflow = 0;
      let outflow = 0;
      splits.forEach((split) => {
        if (split.amount > 0) {
          inflow += split.amount;
        } else if (split.amount < 0) {
          outflow += split.amount;
        }
      });

      await MonthSummary.create({
        month,
        userId,
        closingBalance,
        categories,
        categoriesInitialized: true,
        inflow,
        outflow,
      });
    } else {
      for (const split of splits) {
        const updateField = `categories.${split.categoryName}`;
        const updates = {
          $inc: {
            [updateField]: split.amount,
          },
          $set: {
            categoriesInitialized: true,
          },
        };

        if (split.amount > 0) {
          updates.$inc.inflow = split.amount;
        } else if (split.amount < 0) {
          updates.$inc.outflow = split.amount;
        }

        await MonthSummary.updateOne(
          { month, userId },
          updates
        );
      }
    }

    await TransactionSplit.findOneAndUpdate(
      { transactionId },
      { 
        userId,
        splits,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    await Transaction.updateOne(
      { transactionId },
      {
        $set: { type: "split" },
        $unset: { categoryName: "" }
      }
    );

    return NextResponse.json(
      { message: "Split successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Split failed:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const transactionId = searchParams.get("transactionId");

  if (!transactionId) {
    return NextResponse.json({ message: "Missing transactionId" }, { status: 400 });
  }

  try {
    await connect();
    const split = await TransactionSplit.findOne({ transactionId });
    
    if (!split) {
      return NextResponse.json({ message: "Split not found" }, { status: 404 });
    }

    return NextResponse.json({ split }, { status: 200 });
  } catch (error) {
    console.error("Failed to get split:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};

