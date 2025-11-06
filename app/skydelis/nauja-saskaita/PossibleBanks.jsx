"use client";
import { useEffect, useState } from "react";
import BankOption from "./BankOption";
import { Search } from "lucide-react";
import { isTestMode } from "@/app/lib/testMode";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

const FALLBACK_BANKS = [
  { name: "Airwallex", logo: "https://cdn-logos.gocardless.com/ais/AIRWALLEX_AIPTAU32_1.png" },
  { name: "Artea (Šiaulių bankas)", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/LV/PNG/artea.png" },
  { name: "Citadele", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/LV/PNG/citadele.png" },
  { name: "ConnectPay", logo: "https://cdn-logos.gocardless.com/ais/CONNECTPAY_CNUALT21.png" },
  { name: "Finom", logo: "https://cdn-logos.gocardless.com/ais/FINOM_SOBKDEBB.png" },
  { name: "HSBCnet", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/UK/PNG/hsbcpersonal.png" },
  { name: "International Business Settlement", logo: "https://cdn-logos.gocardless.com/ais/IBSETTLE_IBIULT21.png" },
  { name: "Luminor", logo: "https://cdn-logos.gocardless.com/ais/LUMINOR_NDEAEE2X.png" },
  { name: "Lunar", logo: "https://cdn-logos.gocardless.com/ais/LUNAR_LUNADK22.png" },
  { name: "Monese", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/FR/PNG/monese.png" },
  { name: "N26 Bank", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/DE/PNG/n26.png" },
  { name: "Neteller", logo: "https://cdn-logos.gocardless.com/ais/PAYSAFE_NETEGB21.png" },
  { name: "OP Corporate Bank", logo: "https://cdn-logos.gocardless.com/ais/OP_BALTICS_OKOYLV2X.png" },
  { name: "PayPal", logo: "https://cdn-logos.gocardless.com/ais/PAYPAL_PPLXLULL.png" },
  { name: "Paysera", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/UK/PNG/paysera.png" },
  { name: "Revolut", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/UK/PNG/revolut.png" },
  { name: "SEB", logo: "https://cdn-logos.gocardless.com/ais/SEB_SE_CORP_ESSESESS.png" },
  { name: "Skrill", logo: "https://cdn-logos.gocardless.com/ais/PAYSAFE_SKRLGB2L.png" },
  { name: "Soldo", logo: "https://cdn-logos.gocardless.com/ais/SOLDO_SFSDIE22.png" },
  { name: "Stripe", logo: "https://cdn-logos.gocardless.com/ais/STRIPE_STPUIE21.png" },
  { name: "Swan", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/EEA/PNG/swan.png" },
  { name: "Swedbank", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/SE/PNG/swedbank.png" },
  { name: "Urbo", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/UK/PNG/abank.png" },
  { name: "Vivid Money", logo: "https://cdn-logos.gocardless.com/ais/VIVIDMONEY_SOBKDEB2.png" },
  { name: "Wise", logo: "https://storage.googleapis.com/gc-prd-institution_icons-production/UK/PNG/wise.png" }
];

export default function PossibleBanks({ sessionId }) {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (isTestMode()) {
      setBanks(FALLBACK_BANKS);
      setFilteredBanks(FALLBACK_BANKS);
      return;
    }

    const token = sessionStorage.getItem("access_token")
    const fetchBanks = async () => {
      setLoadingBanks(true);
      try {
        const res = await fetch("/api/go/availableBanks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: token,
        });
        const fetchedBanks = await res.json();
        setBanks(fetchedBanks?.data || []);
        setFilteredBanks(fetchedBanks?.data || []);
      } catch (error) {
        console.error("Error fetching banks:", error);
        setBanks(FALLBACK_BANKS);
        setFilteredBanks(FALLBACK_BANKS);
      } finally {
        setLoadingBanks(false);
      }
    }

    fetchBanks();
  }, []);

  ///filter the input
  useEffect(() => {
    const filtered = banks.filter((bank) =>
      bank.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredBanks(filtered);
  }, [filter, banks]);

  return (
    <div className="w-full">
      <div className={`${currentTheme.card} ${currentTheme.cardBorder} border rounded-xl flex items-center p-4 gap-3 w-full max-w-xl mb-6 shadow-sm`}>
        <Search className={currentTheme.textMuted} />
        <input
          className={`outline-none w-full text-base ${currentTheme.textPrimary} bg-transparent`}
          placeholder="Ieškoti"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loadingBanks ? (
        <p className={currentTheme.textPrimary}>Kraunama...</p>
      ) : (
        <ul className="flex flex-col items-center w-full">
          {filteredBanks.map((bank) => (
            <BankOption key={bank.name} bank={bank} sessionId={sessionId} />
          ))}
        </ul>
      )}
    </div>
  );
}
