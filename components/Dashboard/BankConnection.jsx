'use client';

import { formatCurrency, formatDate } from "@/app/util/format";
import Link from "next/link";

export default function BankConnection({
  currentBalance,
  lastConnected,
  bank,
  logo,
  id,
  connected,
}) {
  const diffMs = new Date() - new Date(connected);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const requiresUpdate = diffDays >= 90;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A20]/50 border border-white/5 hover:border-white/10 transition-all duration-300">
      {/* Left side: logo + bank info */}
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 overflow-hidden rounded-lg flex items-center justify-center bg-white/5">
          <img src={logo} alt={bank} className="max-h-10" />
        </div>

        <div>
          <h4 className={`font-semibold flex-col sm:flex-row text-white flex sm:items-center ${requiresUpdate ? 'mb-1' : ''}`}>
            {bank}
            {requiresUpdate && (
              <span className="sm:ml-2 my-1 text-xs border cursor-pointer border-red-400 text-red-400 font-light rounded px-2 py-0.5">
                Reikia atnaujinti
              </span>
            )}
          </h4>

          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-[#63EB25] rounded-full animate-pulse" />
            <p className="text-xs text-white/70">
              Balansas: {formatCurrency(currentBalance) || "neatnaujinta"}
            </p>
          </div>

          <p className="text-xs text-white/40">
            Atnaujinta:{" "}
            {lastConnected === "nodata" ? "nėra" : formatDate(lastConnected)}
          </p>
        </div>
      </div>

      {/* Right side: link */}
      <div className="text-right">
        <Link
          href={`/skydelis/saskaitos/${id}`}
          className={`px-3 py-1 rounded transition-colors ${
            requiresUpdate
              ? "text-gray-400 cursor-not-allowed pointer-events-none"
              : "text-blue-500 hover:text-blue-400"
          }`}
        >
          Peržiūrėti
        </Link>
      </div>
    </div>
  );
}
