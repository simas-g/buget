export async function encrypt(text, sessionId) {
  const res = await fetch("/api/encrypt", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionId,
    },
    body: JSON.stringify({ text }),
  });
  const parsed = await res.json();
  const { data } = parsed;
  return data;
}

export async function decrypt(text, sessionId) {
  const isClient = typeof window !== "undefined";
let url;
  if (isClient) {
    url = '/api/decrypt'
  } else {
    url = process.env.BASE_URL + "/api/decrypt"
  }
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + sessionId,
    },
    body: JSON.stringify({ text }),
  });
  const parsed = await res.json();
  const { data } = parsed;
  return data;
}
