"use client";

import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function Loading() {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  
  return (
    <div className={`h-screen flex w-full items-center justify-center transition-colors duration-300 ${
      theme === "dark" ? "bg-[#0A0A20]" : currentTheme.backgroundGradient
    }`}>
      <div className="border-t border-2 w-20 h-20 border-secondary rounded-full animate-spin"></div>
    </div>
  );
}
