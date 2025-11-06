"use client";

import TestUserSelector from "@/components/Auth/TestUserSelector";
import Navigation from "@/components/UI/Nav";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

export default function TestModePage() {
  const navLinks = [{ href: "/", label: "Pradžia" }];
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;
  
  return (
    <div className={`min-h-screen ${currentTheme.backgroundGradient} flex items-center justify-center p-4`}>
      <Navigation navLinks={navLinks} />
      <div className="relative z-10 w-full max-w-2xl pt-20">
        <TestUserSelector />
      </div>
    </div>
  );
}

