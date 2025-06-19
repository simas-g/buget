"use server";

export async function fetchRequisitions(bank, accessToken, sessionId) {
  const res = await fetch(process.env.BASE_URL + "/api/getRequisition", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionId.value}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bank,
      accessToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch requisitions: ${res.status}`);
  }

  const parsed = await res.json();
  console.log(parsed)
  return parsed.data.link; 
}
