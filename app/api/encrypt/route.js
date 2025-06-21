import { validateToken } from "@/app/lib/auth/session";
import { NextResponse } from "next/server";
import crypto from "crypto";
const ALGORITHM = "aes-256-gcm";

const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET;
export async function POST(req) {
  const isValidRequest = validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { text } = body;

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv);

  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();
  const fullCipher = [iv.toString("hex"), encrypted, authTag.toString("hex")].join(":")
  return NextResponse.json({data: fullCipher });
}
