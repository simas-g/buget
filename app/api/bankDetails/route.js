import { validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import Transaction from "@/app/lib/models/transaction";
import { NextResponse } from "next/server";

////available to fetch max 4 times a day

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    console.log(req.headers, "our headers");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { userId, bankId, id, type, access_token } = body;
  if (!userId || !bankId || !id || !type || !access_token) {
    return NextResponse.json({ error: "missing details" }, { status: 400 });
  }
  try {
    const res = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/accounts/${id}/${type}/`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
          accept: "application/json",
        },
      }
    );
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ data }, { status: 404 });
    }

    console.log(data, "fetch transactions");
    const { last_updated, transactions } = data;

    ///update docs skip duplicates
    const booked = transactions.booked;
    const transformed = booked.map((t) => ({
      amount: t.transactionAmount.amount,
      bookingDate: new Date(t.bookingDate),
      creditorName: t?.creditorName || t.debtorName,
      transactionId: t.transactionId,
      bankId,
      type: "fetched",
    }));
    await Transaction.insertMany(transformed, { ordered: false });

    ///updating last fetched date for the bank connection
    const currentDate = new Date().toISOString().split("T")[0];
    await BankConnection.findOneAndUpdate(
      { _id: bankId },
      { lastFetched: currentDate }
    );
    const allTransactions = await Transaction.find({ bankId });
    return NextResponse.json({ allTransactions }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
