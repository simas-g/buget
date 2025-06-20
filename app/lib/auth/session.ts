"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SESSION_KEY = "SESSION_KEY"; // Cookie name
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
const JWT_SECRET = process.env.JWT_SECRET;

interface UserSession {
  id: string;
  plan: "basic" | "advanced";
}

export async function createUserSession(user: UserSession, cookies) {
  const payload = {
    id: user.id,
    plan: user.plan,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: SESSION_EXPIRATION_SECONDS,
  });

  await cookies.set(SESSION_KEY, token, {
    secure: true,
    httpOnly: false,
    sameSite: "lax",
    expires: new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000),
  });
}

export async function getUserFromSession(cookies) {
  const token = cookies.get(SESSION_KEY)?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Invalid or expired JWT:", error);
    return null;
  }
}

export async function deleteUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
  return "deleted session cookie";
}


export const validateToken = async (headers) => {
  const authorization = headers.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.warn("Authorization header is missing or malformed.");
    return null;
  }

  // Extract the token
  const token = authorization.split("Bearer ")[1]?.trim();
  if (!token) {
    console.warn("Token is missing in the Authorization header.");
    return null;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('our object decoedd', decoded)
    return decoded;
  } catch (error) {
    console.log('error with token')
    return null;
  }
};
