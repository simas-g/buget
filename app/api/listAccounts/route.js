import { validateToken } from "@/app/lib/auth/session";
import { NextResponse } from "next/server";

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { requisitionId, access_token } = body;
  try {
    const res = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}/`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + access_token,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

// curl -X GET "https://bankaccountdata.gocardless.com/api/v2/requisitions/8126e9fb-93c9-4228-937c-68f0383c2df7/" \
//   -H  "accept: application/json" \
//   -H  "Authorization: Bearer ACCESS_TOKEN"
