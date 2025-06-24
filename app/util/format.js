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
