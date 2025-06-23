import { NextResponse } from "next/server";
// [
//    {
//       "id":"ABNAMRO_ABNAGB2LXXX",
//       "name":"ABN AMRO Bank Commercial",
//       "bic":"ABNAGB2LXXX",
//       "transaction_total_days":"540",
//       "countries":[
//          "GB"
//       ],
//       "logo":"https://cdn-logos.gocardless.com/ais/ABNAMRO_FTSBDEFAXXX.png",
//       "max_access_valid_for_days": "180"
//    },
//    {
//       "..."
//    },
//    {
//       "id":"REVOLUT_REVOGB21",
//       "name":"Revolut",
//       "bic":"REVOGB21",
//       "transaction_total_days":"730",
//       "countries":[
//          "GB"
//       ],
//       "logo":"https://cdn-logos.gocardless.com/ais/REVOLUT_REVOGB21.png",
//       "max_access_valid_for_days": "90"
//    }
// ]

export async function POST(req) {
  const body = await req.json();
  const { access } = body.data;
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
