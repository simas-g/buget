import { validateToken } from "@/app/lib/auth/session";
import { NextResponse } from "next/server";
// {
//    "id":"8126e9fb-93c9-4228-937c-68f0383c2df7",
//    "status":"LN",
//    "agreements":"2dea1b84-97b0-4cb4-8805-302c227587c8",
//    "accounts":[
//       "065da497-e6af-4950-88ed-2edbc0577d20",
//       "bc6d7bbb-a7d8-487e-876e-a887dcfeea3d"
//    ],
//    "reference":"124151"
// }

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
