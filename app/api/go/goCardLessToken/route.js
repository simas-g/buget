import { validateToken } from "@/app/lib/auth/session";
import { NextResponse } from "next/server";
// {  
//   "access": "string",
//   "access_expires": 86400,  
//   "refresh": "string",  
//   "refresh_expires": 2592000 
//  }
export async function GET(req) {
  const validToken = await validateToken(req.headers);
  if (!validToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  if (!process.env.GO_CARDLESS_SECRET_ID || !process.env.GO_CARDLESS_SECRET_KEY) {
    console.error("GoCardless credentials are not configured");
    return NextResponse.json(
      { error: "GoCardless credentials not configured" },
      { status: 500 }
    );
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
      const errorData = await response.json().catch(() => ({}));
      console.error("GoCardless API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json(
        { 
          error: "Failed to fetch GoCardless token",
          details: errorData 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({data}, {status: 200}); 
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
