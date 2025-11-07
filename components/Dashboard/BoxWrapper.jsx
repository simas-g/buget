"use client";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function BoxWrapper({ children, className }) {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  
  return (
    <div className={`${className} ${currentTheme.card} backdrop-blur-sm ${currentTheme.cardBorder} ${currentTheme.cardHover} border rounded-2xl shadow-lg transition-all duration-200`} style={{ transform: 'translate3d(0,0,0)' }}>
      {children}
    </div>
  );
}
