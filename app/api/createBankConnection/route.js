import { getUserFromSession, validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
import { decrypt } from "@/app/util/crypting";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const user = await getUserFromSession(await cookies());
    const userOid = new mongoose.Types.ObjectId(user.id);

    const body = await req.json();
    const { tempBank, accounts: encrypted } = body;
    const accounts = await decrypt(encrypted, isValidRequest.sessionId);
    console.log("Accounts:", accounts);
    const existingConnection = await BankConnection.findOne({
      userId: userOid,
      accountId: accounts,
    });
    if (existingConnection) {
      return NextResponse.json(
        { message: "Created connections successfully" },
        { status: 200 }
      );
    }
    await BankConnection.create({
      name: JSON.parse(tempBank).name,
      logo: JSON.parse(tempBank).logo,
      accountId: accounts,
      userId: userOid,
    });

    return NextResponse.json(
      { message: "Created connections successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating bank connections:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
