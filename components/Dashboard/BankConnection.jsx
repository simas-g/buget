'use client';

import { formatCurrency, formatDate } from "@/app/util/format";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function BankConnection({
  currentBalance,
  lastConnected,
  bank,
  logo,
  id,
  connected,
  accountId,
  validUntil,
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  
  // Check if connection is still valid by comparing current date with validUntil
  const isValid = (() => {
    if (!validUntil) {
      // If validUntil is not set, fall back to checking 90 days from connected date
      const connectionDate = connected || lastConnected;
      if (!connectionDate) return false;
      const diffMs = new Date() - new Date(connectionDate);
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays < 90;
    }
    // Check if current date is before the validUntil date
    const validUntilDate = new Date(validUntil);
    const now = new Date();
    return now < validUntilDate;
  })();
  
  const requiresUpdate = !isValid;

  const handleRevalidation = () => {
    // Store bank info for revalidation
    sessionStorage.setItem("revalidate_bank_id", id);
    sessionStorage.setItem("revalidate_account_id", accountId);
    sessionStorage.setItem("revalidate_bank_name", bank);
    sessionStorage.setItem("revalidate_bank_logo", logo);
    // Navigate to connection flow
    router.push("/skydelis/nauja-saskaita");
  };

  return (
    <div className={`flex items-center justify-between p-5 rounded-xl ${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.cardHover} transition-all duration-150 shadow-md hover:shadow-lg`}>
      {/* Left side: logo + bank info */}
      <div className="flex items-center space-x-4">
        <div className={`h-14 w-14 overflow-hidden rounded-xl flex items-center justify-center bg-gradient-to-br ${theme === 'dark' ? 'from-white/10 to-white/5' : 'from-gray-100 to-gray-50'} border ${currentTheme.cardBorder} shadow-inner`}>
          <img src={logo} alt={bank} className="max-h-10 max-w-10 object-contain" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h4 className={`font-semibold flex-col sm:flex-row ${currentTheme.textPrimary} flex sm:items-center gap-2 ${requiresUpdate ? 'mb-1' : ''}`}>
            <span>{bank}</span>
            {requiresUpdate && (
              <button
                onClick={handleRevalidation}
                className="text-xs border cursor-pointer border-red-400/50 bg-red-400/10 text-red-400 hover:bg-red-400/20 hover:border-red-400/70 font-medium rounded-md px-2.5 py-1 transition-all"
              >
                Reikia atnaujinti
              </button>
            )}
          </h4>

          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 ${requiresUpdate ? 'bg-red-400' : 'bg-[#63EB25]'} rounded-full shadow-sm ${!requiresUpdate ? 'shadow-[#63EB25]/50' : 'shadow-red-400/50'}`} />
            <p className={`text-sm ${currentTheme.textSecondary} font-medium`}>
              Balansas: <span className={currentTheme.textPrimary}>{formatCurrency(currentBalance) || "neatnaujinta"}</span>
            </p>
          </div>

          <p className={`text-xs ${currentTheme.textMuted}`}>
            Atnaujinta:{" "}
            <span className={currentTheme.textSecondary}>{lastConnected === "nodata" ? "nėra" : formatDate(lastConnected)}</span>
          </p>
        </div>
      </div>

      {/* Right side: link */}
      <div className="text-right">
        <Link
          href={`/skydelis/saskaitos/${id}`}
          className={`px-4 py-2 rounded-lg transition-all font-medium ${
            requiresUpdate
              ? `${currentTheme.textMuted} cursor-not-allowed pointer-events-none ${theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-300/50'}`
              : `text-[#2563EB] hover:text-white bg-[#2563EB]/10 hover:bg-[#2563EB]/20 border border-[#2563EB]/30 hover:border-[#2563EB]/50`
          }`}
        >
          Peržiūrėti
        </Link>
      </div>
    </div>
  );
}
