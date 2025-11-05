"use client";

import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

const AuthPageWrapper = ({ children }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === "dark" ? "bg-[#0A0A20]" : currentTheme.backgroundGradient
    }`}>
      {children}
    </div>
  );
};

export default AuthPageWrapper;

