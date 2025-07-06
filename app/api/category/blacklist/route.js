import { validateToken } from "@/app/lib/auth/session";
import Transaction from "@/app/lib/models/transaction";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { transactionId } = body;
  try {
    await Transaction.updateOne({ transactionId }, { type: "blacklisted" });
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
