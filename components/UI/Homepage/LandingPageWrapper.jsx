"use client";

import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

const LandingPageWrapper = ({ children }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;

  return (
    <div className={`h-fit transition-colors duration-300 ${
      theme === "dark" ? "bg-black" : currentTheme.backgroundGradient
    }`}>
      {children}
    </div>
  );
};

export default LandingPageWrapper;

