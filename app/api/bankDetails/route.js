import { validateToken } from "@/app/lib/auth/session";
import { NextResponse } from "next/server";

////available to fetch max 4 times a day

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, type, access_token } = body;
  if (!id || !type || !access_token) {
    return NextResponse.json({ error: "missing details" }, { status: 400 });
  }
  try {
    const res = await fetch(
      `https://bankaccountdata.gocardless.com/api/v2/accounts/${id}/${type}/`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
          accept: "application/json",
        },
      }
    );
    // if (!res.ok) {
    //   return NextResponse.json({ message: "error" }, { status: 404 });
    // }
    const data = await res.json();
    console.log(data, 'fetch transsacoa')
    const { last_updated, transactions } = data;

    ///update docs
    
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error }, { status: 400 });
  }
}
// curl -X GET "https://bankaccountdata.gocardless.com/api/v2/accounts/account-id-1/transactions/" \
//   -H "accept: application/json" \
//   -H "Authorization: Bearer ACCESS_TOKEN"
