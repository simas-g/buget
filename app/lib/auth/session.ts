"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";
import { cache } from "react";


// Constants
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
    httpOnly: true,
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
  return 'deleted session cookie'
}

export const validateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Sync call
    return decoded;
  } catch (error) {
    console.error("Token validation error:", error.message);
    return null;
  }
}
