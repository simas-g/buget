///fetching the token 1.
import { encrypt } from "./crypting";
export async function getToken(sessionId) {
  const alreadyExistingToken = JSON.parse(
    sessionStorage.getItem("access_token")
  );
  if (alreadyExistingToken) return alreadyExistingToken;

  try {
    const res = await fetch("/api/goCardLessToken", {
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
    const res = await fetch("/api/listAccounts", {
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

///fetching account
export async function initializeBankConnection(accounts, tempBank, sessionId) {
  console.log("helo", accounts, tempBank, sessionId);
  try {
    const res = await fetch("/api/createBankConnection", {
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
    const res = await fetch("/api/connectedBanks", {
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
    const res = await fetch("/api/getBankData", {
      method: "POST",
      body: JSON.stringify({
        bankId,
      }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return null;
  }
}
