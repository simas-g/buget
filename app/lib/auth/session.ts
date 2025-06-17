"use server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Constants
const SESSION_KEY = "SESSION_KEY"; // Cookie name
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
const JWT_SECRET = process.env.JWT_SECRET;

interface UserSession {
  id: string;
  plan: "basic" | "advanced";
}

// Create User Session (JWT Generation)
export async function createUserSession(user: UserSession, cookies) {
  // Create the JWT payload
  const payload = {
    id: user.id,
    plan: user.plan,
  };

  // Sign the JWT
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: SESSION_EXPIRATION_SECONDS,
  });

  // Set the token in an HttpOnly, secure cookie
  await cookies.set(SESSION_KEY, token, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000),
  });
}

// Get User from Session (JWT Decoding)
export async function getUserFromSession(cookies) {
  // Get the token from cookies
  const token = cookies.get(SESSION_KEY)?.value;

  if (!token) {
    return null;
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // The user payload
  } catch (error) {
    console.error("Invalid or expired JWT:", error);
    return null; // Token invalid or expired
  }
}

// Delete User Session (JWT Removal)
export async function deleteUserSession() {
  // Remove the session cookie
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
  return NextResponse.redirect('/prisijungti')
}
