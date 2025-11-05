"use client";

import { useEffect, useState } from "react";
import { Search, Building2, Globe, Calendar, ArrowRight } from "lucide-react";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";
import { getToken, getClientUser } from "@/app/util/http";

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

export default function BankaiPage() {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const clientData = await getClientUser();
        if (!clientData || !clientData.sessionId) {
          throw new Error("No session found");
        }

        const tokenData = await getToken(clientData.sessionId);
        if (!tokenData) {
          throw new Error("Failed to fetch access token");
        }

        const res = await fetch("/api/go/availableBanks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tokenData),
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch banks");
        }
        
        const data = await res.json();
        setBanks(data?.data || []);
        setFilteredBanks(data?.data || []);
      } catch (error) {
        console.error("Error fetching banks:", error);
        setBanks(FALLBACK_BANKS);
        setFilteredBanks(FALLBACK_BANKS);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    const filtered = banks.filter((bank) =>
      bank.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredBanks(filtered);
  }, [filter, banks]);

  return (
    <div className={`min-h-screen ${currentTheme.backgroundGradient} py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${currentTheme.textHeading}`}>
            Galimi Bankai
          </h1>
          <p className={`text-lg ${currentTheme.textSecondary}`}>
            Pasirinkite banką ir pradėkite valdyti savo finansus
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto">
          <div className={`${currentTheme.card} ${currentTheme.cardBorder} border rounded-2xl p-4 shadow-lg flex items-center gap-3`}>
            <Search className={currentTheme.textMuted} size={20} />
            <input
              className={`outline-none w-full text-base bg-transparent ${currentTheme.textPrimary} placeholder:${currentTheme.textMuted}`}
              placeholder="Ieškoti banko..."
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className={`mb-6 ${currentTheme.textSecondary}`}>
              Rasta bankų: {filteredBanks.length}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBanks.map((bank, index) => (
                <BankCard key={bank.id || bank.name || index} bank={bank} currentTheme={currentTheme} />
              ))}
            </div>

            {filteredBanks.length === 0 && (
              <div className={`text-center py-16 ${currentTheme.textMuted}`}>
                <Building2 size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl">Nerasta jokių bankų</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const BankCard = ({ bank, currentTheme }) => {
  const handleConnect = () => {
    window.location.href = `/skydelis/nauja-saskaita`;
  };

  return (
    <div
      className={`${currentTheme.card} ${currentTheme.cardBorder} ${currentTheme.cardHover} border rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer group`}
      onClick={handleConnect}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center ${currentTheme.backgroundBlur} shadow-md`}>
          <img 
            src={bank.logo} 
            alt={`${bank.name} logo`}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<Building2 size={32} class="${currentTheme.textMuted}" />`;
            }}
          />
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-semibold mb-1 ${currentTheme.textHeading} group-hover:text-blue-500 transition-colors`}>
            {bank.name}
          </h3>
          {bank.bic && (
            <p className={`text-sm ${currentTheme.textMuted} font-mono`}>
              {bank.bic}
            </p>
          )}
        </div>
      </div>

      {(bank.countries || bank.transaction_total_days || bank.max_access_valid_for_days) && (
        <div className="space-y-3">
          {bank.countries && (
            <div className="flex items-center gap-2">
              <Globe size={16} className={currentTheme.textMuted} />
              <span className={`text-sm ${currentTheme.textSecondary}`}>
                {bank.countries.join(", ")}
              </span>
            </div>
          )}

          {bank.transaction_total_days && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className={currentTheme.textMuted} />
              <span className={`text-sm ${currentTheme.textSecondary}`}>
                Transakcijos: {bank.transaction_total_days} dienų
              </span>
            </div>
          )}

          {bank.max_access_valid_for_days && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className={currentTheme.textMuted} />
              <span className={`text-sm ${currentTheme.textSecondary}`}>
                Prieiga: {bank.max_access_valid_for_days} dienų
              </span>
            </div>
          )}
        </div>
      )}

      <div className={`mt-6 pt-4 border-t ${currentTheme.cardBorder} flex items-center justify-between`}>
        <span className={`text-sm font-medium ${currentTheme.textSecondary} group-hover:text-blue-500 transition-colors`}>
          Prijungti banką
        </span>
        <ArrowRight size={20} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

