import { getUserFromSession, validateToken } from "@/app/lib/auth/session";
import BankConnection from "@/app/lib/models/bankConnection";
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
    const { tempBank, accounts } = body;
    const accountList = accounts?.data?.accounts || [];
    for (let i = 0; i < accountList.length; i++) {
      const existingConnection = await BankConnection.findOne({
        userId: userOid,
        accountId: accountList[i],
      });
      if (existingConnection) {
        continue;
      }
      await BankConnection.create({
        name:
          JSON.parse(tempBank).name +
          (accountList.length > 1 ? ` ${i + 1}` : ""),
        logo: JSON.parse(tempBank).logo,
        accountId: accountList[i],
        userId: userOid,
      });
    }

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
