///first we fetch fetched transactions !
///if some are found we return them
///if none are found, we fetch from /api/bankDetails

import { validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import FetchedTransaction from "@/app/lib/models/fetchedTransaction";
import { NextResponse } from "next/server";
export async function GET(req) {
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
  const availableTransactions = await FetchedTransaction.find({
    bankId: id,
  }).lean();
  if (availableTransactions.length > 0) {
    return NextResponse.json({ availableTransactions }, { status: 200 });
  }
  let rawData;
  const bankConnection = await BankConnection.findOne({_id: id}, 'accountId userId')
  if (availableTransactions.length === 0) {
    const result = await fetch(process.env.BASE_URL + "/api/bankDetails", {
      method: 'POST',
      body: JSON.stringify({
        bankId: id,
        access_token: token,
        id: bankConnection.accountId,
        type: "transactions",
        userId: bankConnection.userId
      })
    });
  }
  return NextResponse.json({ message: "success" }, { status: 200 });
}
