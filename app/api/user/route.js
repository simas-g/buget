import { validateToken } from "@/app/lib/auth/session";
import connect from "@/app/lib/connectToDB";
import User from "@/app/lib/models/user";
import { NextResponse } from "next/server";

export async function GET(request) {
  const isValidRequest = await validateToken(request.headers);
  if (!isValidRequest) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired token" },
      { status: 401 }
    );
  }
  await connect();
  try {
    const user = await User.findOne({ _id: isValidRequest.id });
    if (!user) {
      throw new Error("Vartotojas nerastas");
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
