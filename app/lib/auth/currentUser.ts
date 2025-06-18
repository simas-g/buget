"use server";
import { cache } from "react";
import { getUserFromSession } from "./session";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const getCurrentUser = cache(async () => {
  return await getUserFromSession(await cookies());
});
export const getFullUser = cache(async () => {
  const cookiesStore = await cookies();
  const sessionKey = cookiesStore.get("SESSION_KEY")?.value;
  if (!sessionKey) {
    console.error("Session key not found");
    return null;
  }

  try {
    const response = await fetch(process.env.BASE_URL + "/api/user", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return null
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
});
