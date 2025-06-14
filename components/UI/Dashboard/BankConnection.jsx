import { CheckCircle, CreditCard } from "lucide-react";

export default function BankConnection({
  currentBalance,
  lastConnected,
  bank,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("lt-LT", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("lt-LT", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A20]/50 border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-[#2563EB]" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-[#63EB25] rounded-full flex items-center justify-center">
            <CheckCircle className="h-3 w-3 text-white" />
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white">{bank}</h4>
          <p className="text-xs text-white/40">
            Atnaujinta: {formatDate(lastConnected)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-white">
          {formatCurrency(currentBalance)}
        </p>
        <div className="flex items-center space-x-1">
          <div className="h-2 w-2 bg-[#63EB25] rounded-full animate-pulse" />
          <span className="text-xs text-[#63EB25]">Prisijungta</span>
        </div>
      </div>
    </div>
  );
}
