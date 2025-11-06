'use client'
import { motion } from "framer-motion";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";
import { Settings, Moon, Sun, LogOut, Home, ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { deleteUserSession } from "@/app/lib/auth/session";
import { useEffect, useState } from "react";
import { isTestMode } from "@/app/lib/testMode";

export default function SharedNav() {
  const { theme, toggleTheme } = useTheme();
  const [testMode, setTestMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentTheme = themes[theme] || themes.dark;
  
  useEffect(() => {
    setTestMode(isTestMode());
    setMounted(true);
  }, []);

  const logout = async () => {
    await deleteUserSession();
    router.push("/prisijungti");
  };

  const isInDashboardSubPage = pathname?.startsWith("/skydelis") && pathname !== "/skydelis";

  if (!mounted || testMode) return null;

  return (
    <div className={`mx-auto z-10 px-4 sm:px-6 lg:px-8 w-full border-b ${currentTheme.navBorder}`}>
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          {isInDashboardSubPage && (
            <Link
              href="/skydelis"
              className={`flex gap-2 items-center ${currentTheme.buttonSecondary} rounded-xl px-5 py-2.5 ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-all duration-300 shadow-md hover:shadow-lg`}
            >
              <ArrowLeft className="w-4 h-4" />
              <p className="hidden sm:inline font-medium">Skydelis</p>
            </Link>
          )}
          <Link
            href={"/"}
            className={`flex gap-2 items-center ${currentTheme.buttonSecondary} rounded-xl px-5 py-2.5 ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-all duration-300 shadow-md hover:shadow-lg`}
          >
            <Home className="w-4 h-4" />
            <p className="hidden sm:inline font-medium">Pradžia</p>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <button className={`flex cursor-pointer items-center gap-x-2 rounded-xl ${currentTheme.buttonSecondary} px-4 py-2.5 ${currentTheme.textSecondary} hover:${currentTheme.textPrimary} transition-all duration-300 shadow-md hover:shadow-lg`}>
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Nustatymai</span>
          </button>
          <button
            onClick={logout}
            className={`flex cursor-pointer items-center gap-x-2 rounded-xl ${currentTheme.buttonAccent} px-4 py-2.5 text-[#EB2563] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#EB2563]/20`}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Atsijungti</span>
          </button>
          <button
            onClick={toggleTheme}
            className={`flex w-16 cursor-pointer p-1 border h-8 rounded-full items-center transition-all duration-300 ${currentTheme.toggleBg} ${theme === "light" ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              className="h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-md"
            >
              {theme === "dark" ? (
                <Moon className="h-3 w-3 text-gray-700" />
              ) : (
                <Sun className="h-3 w-3 text-yellow-500" />
              )}
            </motion.div>
          </button>
        </div>
      </div>
    </div>
  );
}
