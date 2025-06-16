'use server'
import client from "@/app/redis/redis";
import crypto from "crypto"
interface UserSession {
  id: string;
  plan: "basic" | "advanced";
}
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;
export async function createUserSession(user: UserSession, cookies) {
  const sessionId = crypto.randomBytes(128).toString("hex");
  await client.set(`session:${sessionId}`, JSON.stringify(user), {
    EX: SESSION_EXPIRATION_SECONDS
  });
  await setCookies(sessionId, cookies);
}
const SESSION_KEY = "SESSION_KEY"
async function setCookies(sessionId: string, cookies) {
  await cookies.set(SESSION_KEY, sessionId, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
  });
}
export async function getUserFromSession(cookies) {
    const sessionId = cookies.get(SESSION_KEY).value
    if(sessionId === null) {
        return null
    }
    return getUserDataBySessionId(sessionId)
}
async function getUserDataBySessionId(sessionId: string) {
    const user = await client.get(`session:${sessionId}`)
    return user
}
