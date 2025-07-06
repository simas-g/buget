///first we fetch fetched transactions !
///if some are found we return them
///if none are found, we fetch from /api/bankDetails

import { validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import MonthSummary from "@/app/lib/models/monthSummary";
import Transaction from "@/app/lib/models/transaction";
import { calculateClosing } from "@/app/util/calculateClosing";
import { NextResponse } from "next/server";
export async function GET(req) {
  const cookie = req.headers.get("cookie");
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.nextUrl);
  const details = Object.fromEntries(searchParams);
  const { id } = details;
  const token = new Headers(req.headers).get("banking-token");
  if (!id || !token) {
    return NextResponse.json({ erorr: "missing data" }, { status: 400 });
  }
  let availableTransactions = await Transaction.find({
    bankId: id,
    type: "fetched",
  })
    .sort({ bookingDate: "desc" })
    .lean();

  const isEmpty = await Transaction.exists({ bankId: id });
  if (isEmpty !== null || availableTransactions.length > 0) {
    return NextResponse.json({ availableTransactions }, { status: 200 });
  }
  const bankConnection = await BankConnection.findOne(
    { _id: id },
    "accountId userId"
  );

  let rawData;

  const result = await fetch(
    process.env.BASE_URL + "/api/transactions/bankDetails",
    {
      headers: {
        Cookie: cookie,
      },
      method: "POST",
      body: JSON.stringify({
        bankId: id,
        access_token: token,
        id: bankConnection.accountId,
        type: "transactions",
        userId: bankConnection.userId,
      }),
    }
  );
  if (result.status === 429) {
    return NextResponse.json(
      { message: "Rate limit exceeded" },
      { status: 429 }
    );
  }
  rawData = await result.json();
  const { allTransactions } = rawData;
  return NextResponse.json(
    { availableTransactions: allTransactions },
    { status: 200 }
  );
}
