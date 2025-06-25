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
