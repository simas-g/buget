"use client";

import { motion } from "framer-motion";
import { BarChart2, PieChart, TrendingUp } from "lucide-react";
import { Sun, Moon } from "lucide-react";
import { themes } from "@/app/lib/themes";
import { useTheme } from "@/app/lib/ThemeContext";

export default function DashboardMockup() {
  const { theme, toggleTheme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;

  return (
    <div
      id="demo"
      className={`scroll-mt-52 relative rounded-2xl border p-1 transition-all duration-500 ${currentTheme.container}`}
    >
      <div className="rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#EB2563] p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Analitika</h3>
            <button
              onClick={toggleTheme}
              className={`flex w-16 cursor-pointer p-1 border h-8 rounded-full items-center transition-all duration-300 ${
                currentTheme.toggleBg
              } ${theme === "light" ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 30,
                }}
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

        {/* Content */}
        <div
          className={`p-6 transition-all duration-500 ${currentTheme.content}`}
        >
          {/* Balance overview */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <span
                className={`text-sm font-medium transition-colors duration-500 ${currentTheme.text.secondary}`}
              >
                Mėnesio balansas
              </span>
              <span
                className={`sm:text-2xl text-lg font-bold transition-colors duration-500 ${currentTheme.text.primary}`}
              >
                +24,562.00 €
              </span>
            </div>
            <div
              className={`h-3 w-full rounded-full p-[1px] transition-colors duration-500 ${currentTheme.progressBg}`}
            >
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#2563EB] to-[#63EB25]" />
            </div>
          </div>

          {/* Stat cards */}
          <div className="mb-6 grid sm:grid-cols-3 grid-cols-2 gap-4">
            <div
              className={`rounded-lg p-4 backdrop-blur-sm border transition-all duration-500 ${currentTheme.cardBorder}`}
            >
              <BarChart2 className="mb-2 h-6 w-6 text-[#2563EB]" />
              <p
                className={`text-xs transition-colors duration-500 ${currentTheme.text.secondary}`}
              >
                Pajamos
              </p>
              <p
                className={`text-lg font-bold transition-colors duration-500 ${currentTheme.text.primary}`}
              >
                8,350 €
              </p>
              <p className="text-xs text-[#63EB25]">+12.5%</p>
            </div>

            <div
              className={`rounded-lg p-4 backdrop-blur-sm border transition-all duration-500 ${currentTheme.cardBorder}`}
            >
              <PieChart className="mb-2 h-6 w-6 text-[#EB2563]" />
              <p
                className={`text-xs transition-colors duration-500 ${currentTheme.text.secondary}`}
              >
                Išlaidos
              </p>
              <p
                className={`text-lg font-bold transition-colors duration-500 ${currentTheme.text.primary}`}
              >
                3,450 €
              </p>
              <p className="text-xs text-[#EB2563]">-4.3%</p>
            </div>

            <div
              className={`rounded-lg p-4 col-span-2 sm:col-span-1 backdrop-blur-sm border transition-all duration-500 ${currentTheme.cardBorder}`}
            >
              <TrendingUp className="mb-2 h-6 w-6 text-[#63EB25]" />
              <p
                className={`text-xs transition-colors duration-500 ${currentTheme.text.secondary}`}
              >
                Santaupos
              </p>
              <p
                className={`text-lg font-bold transition-colors duration-500 ${currentTheme.text.primary}`}
              >
                4,900 €
              </p>
              <p className="text-xs text-[#63EB25]">+18.2%</p>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="space-y-4">
            <div
              className={`rounded-lg p-4 backdrop-blur-sm border transition-all duration-500 ${currentTheme.cardBorder}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#63EB25] shadow-[0_0_10px_rgba(99,235,37,0.3)]">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className={`font-medium transition-colors duration-500 ${currentTheme.text.primary}`}
                    >
                      Atlyginimas
                    </p>
                    <p
                      className={`text-xs transition-colors duration-500 ${currentTheme.text.secondary}`}
                    >
                      Šiandien, 10:45
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#63EB25]">+5,400 €</p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-lg p-4 backdrop-blur-sm border transition-all duration-500 ${currentTheme.cardBorder}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#EB2563] to-[#2563EB] shadow-[0_0_10px_rgba(235,37,99,0.3)]">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className={`font-medium transition-colors duration-500 ${currentTheme.text.primary}`}
                    >
                      Pirkiniai
                    </p>
                    <p
                      className={`text-xs transition-colors duration-500 ${currentTheme.text.secondary}`}
                    >
                      Vakar, 14:25
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#EB2563]">-240 €</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
