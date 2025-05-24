export const themes = {
  dark: {
    container: "bg-[#0A0A20]/80 border-white/10 shadow-[0_0_25px_rgba(37,99,235,0.3)]",
    content: "bg-[#0A0A20]/95",
    card: "bg-[#1A1A40]/50 border-white/5",
    cardHover: {
      blue: "hover:border-[#2563EB]/30 hover:shadow-[0_0_15px_rgba(37,99,235,0.2)]",
      red: "hover:border-[#EB2563]/30 hover:shadow-[0_0_15px_rgba(235,37,99,0.2)]",
      green: "hover:border-[#63EB25]/30 hover:shadow-[0_0_15px_rgba(99,235,37,0.2)]",
    },
    text: {
      primary: "text-white",
      secondary: "text-white/70",
      muted: "text-white/50",
    },
    progressBg: "bg-[#1A1A40]",
    toggleBg: "bg-[#1A1A40] border-white/20",
    toggleIcon: "text-white",
  },
  light: {
    container: "bg-white/95 border-gray-200 shadow-[0_0_25px_rgba(0,0,0,0.1)]",
    content: "bg-white",
    card: "bg-gray-50/80 border-gray-200/50",
    cardHover: {
      blue: "hover:border-[#2563EB]/30 hover:shadow-[0_0_15px_rgba(37,99,235,0.1)]",
      red: "hover:border-[#EB2563]/30 hover:shadow-[0_0_15px_rgba(235,37,99,0.1)]",
      green: "hover:border-[#63EB25]/30 hover:shadow-[0_0_15px_rgba(99,235,37,0.1)]",
    },
    text: {
      primary: "text-gray-900",
      secondary: "text-gray-600",
      muted: "text-gray-400",
    },
    progressBg: "bg-gray-200",
    toggleBg: "bg-gray-100 border-gray-300",
    toggleIcon: "text-gray-700",
  },
}