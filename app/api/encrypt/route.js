import { validateToken } from "@/app/lib/auth/session";
import { NextResponse } from "next/server";
import crypto from "crypto";
const ALGORITHM = "aes-256-gcm";

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
      { message: "Server configuration error" },
      { status: 500 }
    );
  }
  
  try {
    const body = await req.json();
    const { text } = body;
    
    // Validate input text
    if (!text || text === null || text === undefined || text === "") {
      console.error("Encryption failed: text is null, undefined, or empty");
      return NextResponse.json(
        { message: "Missing or invalid text to encrypt" },
        { status: 400 }
      );
    }
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, "hex"), iv);

    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();
    const fullCipher = [iv.toString("hex"), encrypted, authTag.toString("hex")].join(":");
    return NextResponse.json({ data: fullCipher });
  } catch (error) {
    console.error("Encryption failed:", error);
    return NextResponse.json(
      { message: "Encryption failed", error: error.message },
      { status: 500 }
    );
  }
}
