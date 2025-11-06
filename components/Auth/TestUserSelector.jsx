"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shuffle, User, ArrowRight } from "lucide-react";
import GlowingCard from "../UI/GlowingCard";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  
  const baseClasses =
    "inline-flex cursor-pointer items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      `bg-gradient-to-r from-[#2563EB] to-[#EB2563] ${currentTheme.textPrimary} hover:shadow-[0_0_20px_var(--color-secondary)] focus:ring-[#2563EB] ${theme === "dark" ? "focus:ring-offset-[#0A0A20]" : "focus:ring-offset-slate-50"}`,
    outline:
      `border ${currentTheme.cardBorder} ${theme === "dark" ? "bg-white/5 text-white hover:bg-white/10 hover:border-white/30" : "bg-slate-100 text-slate-900 hover:bg-slate-200 hover:border-slate-400"} focus:ring-white/20`,
    secondary:
      `${theme === "dark" ? "bg-white/10 text-white hover:bg-white/20 border-white/10 hover:border-white/20" : "bg-slate-200 text-slate-900 hover:bg-slate-300 border-slate-300 hover:border-slate-400"} border focus:ring-white/20`,
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function TestUserSelector() {
  const [testUsers, setTestUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  useEffect(() => {
    const fetchTestUsers = async () => {
      try {
        const response = await fetch("/api/testUser/list");
        const data = await response.json();
        setTestUsers(data.testUsers);
      } catch (err) {
        setError("Nepavyko įkelti test vartotojų");
      }
    };

    fetchTestUsers();
  }, []);

  const handleRandomUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/testUser/random");
      const data = await response.json();
      
      localStorage.setItem("testUserMode", "true");
      localStorage.setItem("testUserData", JSON.stringify(data));
      
      document.cookie = `TEST_MODE=${data.user.userId}; path=/; max-age=86400; SameSite=Lax`;
      
      setTimeout(() => {
        window.location.href = "/skydelis";
      }, 100);
    } catch (err) {
      setError("Nepavyko pasirinkti atsitiktinio vartotojo");
      setIsLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/testUser/${userId}`);
      const data = await response.json();
      
      localStorage.setItem("testUserMode", "true");
      localStorage.setItem("testUserData", JSON.stringify(data));
      
      document.cookie = `TEST_MODE=${userId}; path=/; max-age=86400; SameSite=Lax`;
      
      setTimeout(() => {
        window.location.href = "/skydelis";
      }, 100);
    } catch (err) {
      setError("Nepavyko pasirinkti vartotojo");
      setIsLoading(false);
    }
  };

  return (
    <GlowingCard>
      <p className={`${currentTheme.textSecondary} mb-6`}>
        Pasirinkite test vartotoją, kad išbandytumėte aplikaciją su tikroviškais duomenimis
      </p>

      <Button
        onClick={handleRandomUser}
        disabled={isLoading}
        className="w-full mb-8 h-12 group"
      >
        <Shuffle className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-180" />
        {isLoading ? "Kraunama..." : "Atsitiktinis test vartotojas"}
        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </Button>

      <div className="relative mb-6">
        <div className={`h-px ${theme === "dark" ? "bg-white/20" : "bg-slate-300"}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${theme === "dark" ? "bg-[#0A0A20]" : "bg-white"} px-4 text-sm ${currentTheme.textMuted}`}>arba pasirinkite</span>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[#EB2563] mb-4"
        >
          {error}
        </motion.p>
      )}

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {testUsers.map((user, index) => (
          <motion.div
            key={user.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => handleSelectUser(user.userId)}
              disabled={isLoading}
              className={`w-full p-4 rounded-lg ${theme === "dark" ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20" : "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300"} border transition-all duration-300 text-left group`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{user.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`${currentTheme.textPrimary} font-medium`}>{user.name}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/30">
                      {user.plan}
                    </span>
                  </div>
                  <p className={`text-sm ${currentTheme.textMuted} leading-relaxed`}>
                    {user.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${theme === "dark" ? "bg-white/5 text-white/50" : "bg-slate-100 text-slate-600"}`}>
                      {user.characteristics?.income}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${theme === "dark" ? "bg-white/5 text-white/50" : "bg-slate-100 text-slate-600"}`}>
                      {user.characteristics?.lifestyle}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${theme === "dark" ? "bg-white/5 text-white/50" : "bg-slate-100 text-slate-600"}`}>
                      {user.characteristics?.spendingHabits}
                    </span>
                  </div>
                </div>
                <ArrowRight className={`h-5 w-5 ${theme === "dark" ? "text-white/30 group-hover:text-white/80" : "text-slate-400 group-hover:text-slate-700"} transition-all duration-300 group-hover:translate-x-1`} />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-3 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/30">
        <p className={`text-xs ${currentTheme.textSecondary} text-center`}>
          🔍 Test režimas naudoja vietinius duomenis. Jūsų veiksmai nebus išsaugoti.
        </p>
      </div>
    </GlowingCard>
  );
}

