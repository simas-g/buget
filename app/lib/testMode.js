export const isTestMode = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("testUserMode") === "true";
};

export const getTestUserData = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("testUserData");
  return data ? JSON.parse(data) : null;
};

export const exitTestMode = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("testUserMode");
  localStorage.removeItem("testUserData");
};

export const getTestUserId = () => {
  const data = getTestUserData();
  return data?.user?.userId || null;
};

const getCurrentYearMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const isDateInFuture = (dateString) => {
  const now = new Date();
  const [year, month, day] = dateString.split('-').map(Number);
  const dateToCheck = new Date(year, month - 1, day);
  return dateToCheck > now;
};

const isMonthInFuture = (monthString) => {
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return monthString > currentYearMonth;
};

export const getTestTransactions = () => {
  const data = getTestUserData();
  const transactions = data?.transactions || [];
  return transactions.filter(txn => !isDateInFuture(txn.bookingDate));
};

export const getTestBankConnections = () => {
  const data = getTestUserData();
  return data?.bankConnections || [];
};

export const getTestMonthSummaries = () => {
  const data = getTestUserData();
  const summaries = data?.monthSummaries || [];
  return summaries.filter(summary => !isMonthInFuture(summary.month));
};

export const getTestUser = () => {
  const data = getTestUserData();
  return data?.user || null;
};

