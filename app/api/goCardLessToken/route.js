import { validateToken } from "@/app/lib/auth/session";
import { NextResponse } from "next/server";
export async function GET(req) {
  const validToken = await validateToken(req.headers);
  if (!validToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const response = await fetch(
      "https://bankaccountdata.gocardless.com/api/v2/token/new/",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret_id: process.env.GO_CARDLESS_SECRET_ID,
          secret_key: process.env.GO_CARDLESS_SECRET_KEY,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch token: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return NextResponse.json({data}, {status: 200}); 
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json({error: error}, {status: 400})
  }
}
