///fetching the token 1.
import { encrypt } from "./crypting";
export async function getToken(sessionId) {
  const alreadyExistingToken = JSON.parse(
    sessionStorage.getItem("access_token")
  );
  if (alreadyExistingToken) return alreadyExistingToken;

  try {
    const res = await fetch("/api/go/goCardLessToken", {
      headers: {
        Authorization: "Bearer " + sessionId,
      },
    });
    const parsed = await res.json();
    if (!res.ok) {
      throw error;
    }
    sessionStorage.setItem("access_token", JSON.stringify(parsed));
    return parsed;
  } catch (error) {
    console.error("Error fetching token:", error);
  }
}

///listing same bank accounts
export async function listAccounts(token, sessionId) {
  const reqId = sessionStorage.getItem("req_id");
  try {
    const res = await fetch("/api/go/listAccounts", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionId,
      },
      body: JSON.stringify({
        requisitionId: reqId,
        access_token: token.data.access,
      }),
    });
    const data = await res.json();
    const string = data.data.accounts.toString();
    const encrypted = await encrypt(string);
    sessionStorage.setItem("data", JSON.stringify(encrypted));
    return data;
  } catch (error) {
    console.log(error, "error");
  }
}
///requisition
export async function fetchRequisitions(bank, accessToken, sessionId) {
  const res = await fetch("/api/go/getRequisition", {
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
  console.log(parsed);
  return {
    link: parsed.data.link,
    req_id: parsed.data.id,
  };
}

///fetching account
export async function initializeBankConnection(accounts, tempBank, sessionId) {
  console.log("helo", accounts, tempBank, sessionId);
  try {
    const res = await fetch("/api/bank/createBankConnection", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionId,
      },
      body: JSON.stringify({ accounts, tempBank }),
    });
    return res;
  } catch (error) {
    console.log(error, "error");
  }
}

///retrieve connected banks
export async function getConnectedBanks(userId, sessionId) {
  if (!userId || !sessionId) {
    console.log("User ID or session ID is missing");
    return null;
  }
  try {
    const res = await fetch("/api/bank/connectedBanks", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionId,
      },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Error fetching connected banks:", error);
    return null;
  }
}

//retrieve data about bank(logo,balance,name,account_id)
export async function getBankData(bankId) {
  try {
    const res = await fetch("/api/bank/getBankData", {
      headers: {
        "Bank-Id": bankId,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}

///fetch bank transactions/balance
export async function fetchBankDetails(bankId, accountId, access_token) {
  try {
    const res = await fetch("/api/transactions/bankDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bankId,
        id: accountId,
        access_token,
      }),
    });
    const data = await res.json();
    if (data.status_code == 429) return "Rate limit exceeded";
  } catch (error) {
    console.log("Error fetching bank details:", error);
    return null;
  }
}

///all banks monthly summary
export async function fetchMonthlySummary(userId) {
  try {
    const res = await fetch("/api/bank/getMonthlySummary?userId=" + userId);
    if (!res.ok) {
      throw new Error();
    }
    const data = await res.json();

    const { summary } = data;
    return summary;
  } catch (error) {
    console.log(error, "error");
    return null;
  }
}
