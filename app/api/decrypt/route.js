import { validateToken } from "@/app/lib/auth/session";
import crypto from "crypto";
import { NextResponse } from "next/server";

const ENCRYPTION_KEY = process.env.ENCRYPTION_SECRET;

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Validate encryption key exists
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY === undefined) {
    console.error("ENCRYPTION_SECRET environment variable is not set");
    return NextResponse.json(
      { message: "Server configuration error", data: null },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { text } = body;
    console.log(text, 'text')
    
    // Check if text is null or undefined before trying to split
    if (!text || text === null || text === undefined) {
      console.error("Decryption failed: text is null or undefined");
      return NextResponse.json({ data: null }, { status: 400 });
    }
    
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
    return NextResponse.json({ data: null }, { status: 500 });
  }
}
