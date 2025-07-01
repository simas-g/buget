export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("lt-LT", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrencyVisually = (amount) => {
  const number = new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
  let object = {
    style: "",
    amount: number,
  };
  if (amount > 0) {
    object.style = "text-primary";
    object.amount = "+" + number;
  } else if (amount < 0) {
    object.style = "text-accent";
  } else if (amount === 0) {
    object.style = "text-gray-400";
  }
  return object;
};

/// e.g, '2025-05' if its may
export function getCurrentMonthDate() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/// e.g, '2025-04' if its may
export function getPreviousMonthDate() {
  const now = new Date();
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  const year = previousMonth.getFullYear();
  const month = String(previousMonth.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
