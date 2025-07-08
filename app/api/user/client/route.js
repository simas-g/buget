import { validateToken } from "@/app/lib/auth/session";
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
  const { id } = isValidRequest;
  const user = await User.findOne({ _id: id }, { password: 0, email: 0 });
  console.log(isValidRequest, "ISVALID", user, "user");
  return NextResponse.json({ user, sessionId: id }, { status: 200 });
}
