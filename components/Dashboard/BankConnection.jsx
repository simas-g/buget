'use client'
import { formatCurrency, formatDate } from "@/app/util/format";
import Link from "next/link";
async function getBankBalance() {
aads
}
export default function BankConnection({
  currentBalance,
  lastConnected,
  bank,
  logo,
  id,
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#0A0A20]/50 border border-white/5 hover:border-white/10 transition-all duration-300">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 overflow-hidden rounded-lg flex items-center justify-center">
          <img src={logo} alt={bank} />
        </div>
        <div>
          <h4 className="font-semibold text-white">{bank}</h4>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-[#63EB25] rounded-full animate-pulse" />
            <p className="text-xs text-white/70">
              Balansas: {formatCurrency(currentBalance) || "neatnaujinta"}
            </p>
          </div>

          <p className="text-xs text-white/40">
            Atnaujinta: {lastConnected === "nodata" ? "nėra" : formatDate(lastConnected)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <Link href={`/skydelis/saskaitos/${id}`} className="px-3 py-1">
          Peržiūrėti
        </Link>
      </div>
    </div>
  );
}
