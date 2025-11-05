"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/app/lib/ThemeContext";

export default function GlowingCard({ children }) {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Gradient border effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#2563EB] to-[#EB2563] rounded-2xl blur animate-pulse ${
        theme === "dark" ? "opacity-30" : "opacity-20"
      }`}></div>

      <div className={`relative backdrop-blur-xl border rounded-2xl p-8 ${
        theme === "dark"
          ? "bg-[#0A0A20]/95 border-white/10 shadow-[0_0_30px_rgba(37,99,235,0.2)]"
          : "bg-white/95 border-slate-200 shadow-[0_0_30px_rgba(37,99,235,0.15)]"
      }`}>
        {children}
      </div>
    </motion.div>
  );
}
