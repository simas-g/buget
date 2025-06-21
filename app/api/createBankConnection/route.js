// import { validateToken } from "@/app/lib/auth/session";
// import BankConnection from "@/app/lib/models/bankConnection";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   const isValidRequest = await validateToken(req.headers);
//   if (!isValidRequest) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }
//   const body = await req.json();
//   const { tempBank, accounts } = body;

//   const connection = await BankConnection.create({
//     name,
//   });
// }
