"use client";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function DashboardBackground({ children }) {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;

  return (
    <div className={`min-h-screen w-full ${currentTheme.textPrimary} ${theme === 'dark' ? currentTheme.background : currentTheme.backgroundGradient} relative`}>
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[5%] left-[5%] h-[300px] w-[300px] rounded-full ${theme === 'dark' ? 'bg-[#2563EB]/10' : 'bg-[#2563EB]/5'} blur-[100px]`} />
        <div className={`absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full ${theme === 'dark' ? 'bg-[#EB2563]/10' : 'bg-[#EB2563]/5'} blur-[100px]`} />
        <div className={`absolute top-[60%] left-[70%] h-[250px] w-[250px] rounded-full ${theme === 'dark' ? 'bg-[#63EB25]/10' : 'bg-[#63EB25]/5'} blur-[100px]`} />
      </div>
      {children}
    </div>
  );
}

