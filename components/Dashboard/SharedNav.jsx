'use client'
import { useState } from "react";
import { motion } from "framer-motion";
import { themes } from "@/app/lib/themes";
import { Settings, Moon, Sun, LogOut, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteUserSession } from "@/app/lib/auth/session";
export default function SharedNav() {
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };
  const [theme, setTheme] = useState("dark");
  const logout = async () => {
    await deleteUserSession();
    router.push("/prisijungti");
  };
  const router = useRouter();
  const currentTheme = themes[theme];
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-6">
        <Link
          href={"/"}
          className="flex gap-2 items-center bg-[#1A1A40]/50 rounded-lg px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300"
        >
          <Home className="w-4 h-4" />

          <p className="hidden sm:inline">Pradžia </p>
        </Link>
        <div className="flex items-center space-x-4">
          <button className="flex cursor-pointer items-center gap-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Nustatymai</span>
          </button>
          <button
            onClick={logout}
            className="flex cursor-pointer items-center gap-x-2 rounded-lg bg-[#1A1A40]/50 px-4 py-2 text-white/80 hover:bg-[#1A1A40] hover:text-white transition-all duration-300"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Atsijungti</span>
          </button>
          <button
            onClick={toggleTheme}
            className={`flex w-16 cursor-pointer p-1 border h-8 rounded-full items-center transition-all duration-300 ${
              currentTheme.toggleBg
            } ${theme === "light" ? "justify-end" : "justify-start"}`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              className="h-6 w-6 bg-white rounded-full flex items-center justify-center shadow-sm"
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
