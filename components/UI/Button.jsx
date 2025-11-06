"use client";

import { useTheme } from "@/app/lib/ThemeContext";

export default ({ children, variant, className, ...props }) => {
  const { theme } = useTheme();
  
  const variants = {
    accent: theme === "dark" 
      ? "border-[#EB2563] border text-[#EB2563] hover:bg-[#EB2563] hover:text-white transition-colors duration-300"
      : "border-[#EB2563] border text-[#EB2563] hover:bg-[#EB2563] hover:text-white transition-colors duration-300",
    ctaPrimary: theme === "dark"
      ? "bg-[#2563EB] text-white rounded-lg"
      : "bg-[#2563EB] text-white rounded-lg shadow-sm",
    primaryGradient: theme === "dark"
      ? "bg-gradient-to-r from-[#2563EB] to-[#EB2563] text-white hover:shadow-[0_0_20px_var(--color-secondary)] transition-all duration-300"
      : "bg-gradient-to-r from-[#2563EB] to-[#EB2563] text-white hover:shadow-lg transition-all duration-300",
    basic: theme === "dark"
      ? "text-white border hover:bg-white hover:text-gray-700 transition-all duration-300"
      : "text-gray-800 border border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300",
    primary: theme === "dark"
      ? "bg-gradient-to-r from-[#2563EB] to-[#63EB25] text-white hover:shadow-[0_0_20px_rgba(99,235,37,0.5)] focus:ring-[#2563EB]"
      : "bg-gradient-to-r from-[#2563EB] to-[#63EB25] text-white hover:shadow-lg focus:ring-[#2563EB]",
    outline: theme === "dark"
      ? "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 focus:ring-white/20"
      : "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-300",
  };
  
  const buttonClass = `cursor-pointer rounded-lg ${variants[variant]} ${className} ${theme === "dark" ? "dark:text-white" : "text-gray-800"}`;
  
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
