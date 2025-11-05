import { encrypt } from "./crypting";
import { isTestMode, getTestMonthSummaries, getTestBankConnections } from "../lib/testMode";
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
    
    // Validate accounts data exists
    if (!data?.data?.accounts) {
      console.error("listAccounts: No accounts data received from API");
      return data;
    }
    
    const string = data.data.accounts.toString();
    
    // Validate string is not empty before encrypting
    if (!string || string === "") {
      console.error("listAccounts: Account string is empty");
      return data;
    }
    
    // Pass sessionId to encrypt function
    const encrypted = await encrypt(string, sessionId);
    
    // Validate encryption succeeded
    if (!encrypted) {
      console.error("listAccounts: Encryption returned null or undefined");
      return data;
    }
    
    sessionStorage.setItem("data", JSON.stringify(encrypted));
    return data;
  } catch (error) {
    console.error("Error in listAccounts:", error);
    return null;
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
    // Validate required parameters
    if (!accounts || !tempBank || !sessionId) {
      console.error("initializeBankConnection: Missing required parameters", { 
        hasAccounts: !!accounts, 
        hasTempBank: !!tempBank, 
        hasSessionId: !!sessionId 
      });
      return new Response(JSON.stringify({ message: "Missing required parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Check if this is a revalidation
    const revalidateBankId = sessionStorage.getItem("revalidate_bank_id");
    const body = { accounts, tempBank };
    if (revalidateBankId) {
      body.revalidateBankId = revalidateBankId;
    }
    
    const res = await fetch("/api/bank/createBankConnection", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionId,
      },
      body: JSON.stringify(body),
    });
    
    // Clear revalidation data after successful connection (whether it was new or revalidation)
    if (res.ok && revalidateBankId) {
      sessionStorage.removeItem("revalidate_bank_id");
      sessionStorage.removeItem("revalidate_account_id");
      sessionStorage.removeItem("revalidate_bank_name");
      sessionStorage.removeItem("revalidate_bank_logo");
    }
    
    return res;
  } catch (error) {
    console.error("Error in initializeBankConnection:", error);
    return new Response(JSON.stringify({ message: "Failed to initialize bank connection" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

///retrieve connected banks
export async function getConnectedBanks(userId, sessionId) {
  if (!userId || !sessionId) {
    console.log("User ID or session ID is missing");
    return null;
  }
  
  if (isTestMode()) {
    return { data: getTestBankConnections() };
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
export async function fetchBankDetails(bankId, accountId, access_token, userId) {
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
        userId,
      }),
    });
    const data = await res.json();
    console.log(data, "our darta");
    if (data.status_code == 429) return "Rate limit exceeded";
  } catch (error) {
    console.log("Error fetching bank details:", error);
    return null;
  }
}

///all banks monthly summary
export async function fetchMonthlySummary(userId, month) {
  if (!userId || !month) {
    return null;
  }
  
  if (isTestMode()) {
    const summaries = getTestMonthSummaries();
    const summary = summaries.find(s => s.month === month);
    
    if (summary) {
      const bankConnections = getTestBankConnections();
      const totalNet = bankConnections.reduce((acc, bank) => acc + bank.balance, 0);
      return {
        ...summary,
        closingBalance: totalNet
      };
    }
    return null;
  }
  
  try {
    const res = await fetch(
      "/api/bank/getMonthlySummary?userId=" + userId + "&month=" + month
    );
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

export const recalculateMonthlySummaries = async (userId) => {
  if (!userId) {
    throw new Error("userId is required");
  }
  try {
    const res = await fetch("/api/summaries/recalculate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
      throw new Error("Failed to recalculate summaries");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error recalculating summaries:", error);
    throw error;
  }
};

export async function fetchCategorizedTransactions(userId, limit) {
  if (!userId) {
    return [];
  }
  
  if (isTestMode()) {
    const { getTestTransactions } = await import("../lib/testMode");
    let transactions = getTestTransactions();
    if (limit) {
      transactions = transactions.slice(0, limit);
    }
    return transactions;
  }
  
  let query = "?userId=" + userId;
  if (limit) {
    query += "&limit=" + limit;
  }
  try {
    const res = await fetch("/api/transactions/getCategorized" + query);
    const data = await res.json();
    return data;
  } catch (error) {
    return [];
  }
}

export async function getClientUser() {
  try {
    const res = await fetch("/api/user/client");
    const data = await res.json();
    const { user, sessionId } = data;
    if (!user || !sessionId) {
      return null;
    }
    return { user, sessionId };
  } catch (error) {
    console.log(error, "error");
  }
}
