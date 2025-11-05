export async function encrypt(text, sessionId) {
  try {
    // Validate input
    if (!text || text === null || text === undefined) {
      console.error("encrypt: text parameter is null or undefined");
      return null;
    }
    
    if (!sessionId) {
      console.error("encrypt: sessionId parameter is missing");
      return null;
    }
    
    const res = await fetch("/api/encrypt", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionId,
      },
      body: JSON.stringify({ text }),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("encrypt API error:", res.status, errorData);
      return null;
    }
    
    const parsed = await res.json();
    const { data } = parsed;
    
    if (!data) {
      console.error("encrypt: No data returned from API");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in encrypt function:", error);
    return null;
  }
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
