import { validateToken } from "@/app/lib/auth/session";
import connect from "@/app/lib/connectToDB";
import Category from "@/app/lib/models/category";
import { NextResponse } from "next/server";

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { userId, name } = body;
  if (!userId || !name) {
    return NextResponse.json({ error: "missing data" }, { status: 400 });
  }
  await connect()
  await Category.create({
    userId,
    name,
    amount: 0
  });

  return NextResponse.json({ message: "success" }, { status: 200 });
}
