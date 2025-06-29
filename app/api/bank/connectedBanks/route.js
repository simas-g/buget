import { validateToken } from "@/app/lib/auth/session";
import connect from "@/app/lib/connectToDB";
import BankConnection from "@/app/lib/models/bankConnection";
import { NextResponse } from "next/server";

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { userId } = body;
  await connect()
  try {
    const banks = await BankConnection.find({ userId });
    console.log(banks, "connected banks");
    return NextResponse.json({ data: banks }, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error: "error getting data" }, { status: 500 });
  }
}
