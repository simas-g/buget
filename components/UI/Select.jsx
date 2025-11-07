"use client";

import * as React from "react";
import {
  Select as SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/app/lib/ThemeContext";
import { themes } from "@/app/lib/themes";

const Select = ({ value, onChange, options = [], placeholder = "Select option", className = "", disabled = false }) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme] || themes.dark;

  return (
    <SelectRoot value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        className={`
          w-full px-4 py-3 rounded-xl 
          ${theme === 'dark' ? 'bg-[#1A1A40]' : 'bg-white'} ${currentTheme.cardBorder} border 
          ${currentTheme.textPrimary}
          focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] 
          transition-all duration-150 shadow-sm hover:shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <SelectValue 
          placeholder={
            <span className={currentTheme.textMuted}>
              {placeholder}
            </span>
          }
        />
      </SelectTrigger>
      <SelectContent 
        className={`
          ${theme === 'dark' ? 'bg-[#1A1A40]' : 'bg-white'} ${currentTheme.cardBorder} border
          rounded-xl shadow-2xl
          max-h-60
          z-[10000]
        `}
      >
        {options.length === 0 ? (
          <div className={`px-4 py-3 text-center ${currentTheme.textMuted} text-sm`}>
            Nėra pasirinkimų
          </div>
        ) : (
          options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={`
                ${currentTheme.textPrimary}
                focus:bg-[#2563EB]/20
                data-[state=checked]:bg-[#2563EB]/20
                data-[state=checked]:font-semibold
                cursor-pointer
                ${theme === 'light' ? 'hover:bg-slate-100' : 'hover:bg-white/5'}
              `}
            >
              {option.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </SelectRoot>
  );
};

export default Select;

