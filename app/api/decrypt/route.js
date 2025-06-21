import { validateToken } from "@/app/lib/auth/session";
import crypto from "crypto";
import { NextResponse } from "next/server";
const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET
export async function POST(req) {
  const isValidRequest = validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { text } = body;
    console.log(text, 'text')
    const [ivHex, encryptedHex, authTagHex] = text.split(":");
    if (!ivHex || !encryptedHex || !authTagHex) throw new Error("Invalid input format");

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, undefined, "utf-8");
    decrypted += decipher.final("utf-8");

    return NextResponse.json({ data: decrypted });
  } catch (error) {
    console.error("Decryption failed:", error);
    return NextResponse.json({ data: null });
  }
}
