"use client";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function DashboardBackground({ children }) {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;

  return (
    <div className={`min-h-screen w-full ${currentTheme.textPrimary} ${theme === 'dark' ? currentTheme.background : currentTheme.backgroundGradient} relative`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[5%] left-[5%] h-[200px] w-[200px] rounded-full ${theme === 'dark' ? 'bg-[#2563EB]/8' : 'bg-[#2563EB]/4'} blur-[40px]`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
        <div className={`absolute bottom-[20%] right-[10%] h-[250px] w-[250px] rounded-full ${theme === 'dark' ? 'bg-[#EB2563]/8' : 'bg-[#EB2563]/4'} blur-[40px]`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
        <div className={`absolute top-[60%] left-[70%] h-[150px] w-[150px] rounded-full ${theme === 'dark' ? 'bg-[#63EB25]/8' : 'bg-[#63EB25]/4'} blur-[40px]`} style={{ transform: 'translate3d(0,0,0)', willChange: 'transform' }} />
      </div>
      {children}
    </div>
  );
}

