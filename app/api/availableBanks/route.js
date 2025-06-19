import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { token } = body;
  const { access } = token.data;
  const res = await fetch(
    "https://bankaccountdata.gocardless.com/api/v2/institutions/?country=lt",
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access,
        accept: "application/json",
      },
    }
  );
  const data = await res.json();
  return NextResponse.json({ data }, { status: 200 });
}
// curl -X GET "https://bankaccountdata.gocardless.com/api/v2/institutions/?country=gb" \
//   -H  "accept: application/json" \
//   -H  "Authorization: Bearer ACCESS_TOKEN"
