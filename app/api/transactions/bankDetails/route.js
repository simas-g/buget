import { validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import Transaction from "@/app/lib/models/transaction";
import { NextResponse } from "next/server";

////available to fetch max 4 times a day

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { bankId, id, access_token } = body;
  if (!bankId || !id || !access_token) {
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
      return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 });
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
    }));

    ///new transaction insert
    try {
      await Transaction.insertMany(transformed, { ordered: false });
    } catch (err) {
      console.log(
        "Some or all transactions already exist. Skipped duplicates."
      );
    }

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
