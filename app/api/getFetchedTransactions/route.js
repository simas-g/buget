///first we fetch fetched transactions !
///if some are found we return them
///if none are found, we fetch from /api/bankDetails

import { validateToken } from "@/app/lib/auth/session";
import FetchedTransaction from "@/app/lib/models/fetchedTransaction";
import { NextResponse } from "next/server";

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { access_token, id } = await req.json();

  const availableTransactions = await FetchedTransaction.find({bankId: id})
  if(availableTransactions.length === 0) {
    
  }
  return NextResponse.json({ message: "success" }, { status: 200 });
}
