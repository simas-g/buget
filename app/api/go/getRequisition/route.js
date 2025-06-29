import { validateToken } from "@/app/lib/auth/session";
import { NextResponse } from "next/server";
// {
// "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "created": "2025-05-14T11:05:56.276Z",
//   "redirect": "http://www.yourwebpage.com",
//   "status": "CR",
//   "institution_id": "string",
//   "agreement": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
//   "reference": "string",
//   "accounts": [],
//   "user_language": “EN”,
//   "link": "https://ob.gocardless.com/psd2/start/3fa85f64-5717-4562-b3fc-2c963f66afa6/{$INSTITUTION_ID}",
//   "ssn": "string",
//   "account_selection": false,
//   "redirect_immediate": false
// }

export async function POST(req) {
  const isValidRequest = await validateToken(req.headers);
  if (!isValidRequest) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { bank, accessToken } = body;
  try {
    const res = await fetch(
      "https://bankaccountdata.gocardless.com/api/v2/requisitions/",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          institution_id: bank.id,
          redirect: process.env.BASE_URL + "/skydelis",
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error in fetchRequisitions:", error.message);
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
