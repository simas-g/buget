import { validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import FetchedTransaction from "@/app/lib/models/fetchedTransaction";
import { NextResponse } from "next/server";

////available to fetch max 4 times a day

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const {userId, bankId, id, type, access_token } = body;
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
    if (!res.ok) {
      return NextResponse.json({ message: "error" }, { status: 404 });
    }

    const data = await res.json();
    console.log(data, "fetch transsacoa");
    const { last_updated, transactions } = data;

    ///update docs and check for duplicated
    const booked = transactions.booked;
    const transformed = booked.map((t) => ({
      amount: t.transactionAmount.amount,
      userId: userId,
      bookingDate: new Date(t.bookingDate),
      creditorName: t?.creditorName || t.debtorName,
      transactionId: t.transactionId,
      bankId,
    }));
    const currentDate = (new Date()).toISOString().split("T")[0]
    await BankConnection.findOneAndUpdate({_id: bankId}, {lastFetched: currentDate })
    await FetchedTransaction.insertMany(transformed);
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
// curl -X GET "https://bankaccountdata.gocardless.com/api/v2/accounts/account-id-1/transactions/" \
//   -H "accept: application/json" \
//   -H "Authorization: Bearer ACCESS_TOKEN"
