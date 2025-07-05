import { validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import MonthSummary from "@/app/lib/models/monthSummary";
import Transaction from "@/app/lib/models/transaction";
import { NextResponse } from "next/server";

////available to fetch max 4 times a day

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { bankId, id, access_token, userId } = body;
  if (!bankId || !id || !access_token || !userId) {
    return NextResponse.json({ error: "missing details" }, { status: 400 });
  }
  ///fetch transactions
  try {
    const res = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/accounts/${id}/transactions`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
          accept: "application/json",
        },
      }
    );
    const data = await res.json();

    if (data.status_code == 429) {
      return NextResponse.json(
        { message: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const { last_updated, transactions } = data;

    ///update docs skip duplicates
    const all = [...transactions.booked];
    const transformed = all.map((t) => ({
      amount: t.transactionAmount.amount,
      bookingDate: new Date(t.bookingDate),
      creditorName: t?.creditorName || t.debtorName,
      transactionId: t.transactionId,
      bankId,
      type: "fetched",
      userId
    }));

    ///new transaction insert
    let inserted;
    try {
      const insertion = await Transaction.insertMany(transformed, {
        ordered: false,
        rawResult: true,
      });
      inserted = insertion.mongoose.results;
    } catch (err) {
      inserted = err.insertedDocs;
      console.log(
        "Some or all transactions already exist. Skipped duplicates."
      );
    }
    ///monthly summaries update based on inserted
    const summaries = inserted.reduce((acc, tx) => {
      const month = tx.bookingDate.toISOString().slice(0, 7); // "2025-07"

      if (!acc[month]) {
        acc[month] = {
          inflow: 0,
          outflow: 0,
        };
      }

      if (tx.amount > 0) {
        acc[month].inflow += tx.amount;
      } else if (tx.amount < 0) {
        acc[month].outflow += tx.amount;
      }

      return acc;
    }, {});

    ///e.g - summaries
    // const dummySummary = {
    //   "2025-06": { inflow: 1505.75, outflow: -558.95 },
    //   "2025-05": { inflow: 150, outflow: -165.83000000000004 },
    //   "2025-04": { inflow: 144.67000000000002, outflow: -91.83 },
    // };
    const array = Object.entries(summaries);
    const updates = array.map(([month, { inflow, outflow }]) => {
      return MonthSummary.updateOne(
        { month, userId },
        {
          $inc: {
            inflow,
            outflow,
          },
        },
        { upsert: true }
      );
    });
    await Promise.all(updates);
    ///fetch bank balance
    try {
      const resBalance = await fetch(
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${id}/balances`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + access_token,
            accept: "application/json",
          },
        }
      );
      const dataBalance = await resBalance.json();

      ///TO DO: GET ALL MULTIPLE BALANCES IF EXIST

      const { amount } = dataBalance.balances[0].balanceAmount;

      ///last fetched date + balance update
      await BankConnection.findOneAndUpdate(
        { _id: bankId },
        { lastFetched: last_updated, balance: amount }
      );
    } catch (error) {
      console.log(error, "error");
      return NextResponse.json({ error }, { status: 400 });
    }
    const allTransactions = await Transaction.find({ bankId });
    return NextResponse.json({ allTransactions }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
