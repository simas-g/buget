import { validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import { NextResponse } from "next/server";

export async function GET(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const bankId = await req.headers.get("bank-id")
  console.log(bankId, 'our bank iD')
  const bank = await BankConnection.findOne({ _id: bankId });
  if (!bank) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }
  return NextResponse.json({ bank }, { status: 200 });
}
