export const themes = {
  dark: {
    // Backgrounds
    background: "bg-[#0A0A20]",
    backgroundGradient: "bg-gradient-to-br from-[#0A0A20] to-[#1A1A40]",
    backgroundBlur: "bg-[#1A1A40]/40 backdrop-blur-md",
    
    // Cards
    card: "bg-gradient-to-br from-[#1A1A40]/40 via-[#1A1A40]/30 to-[#0A0A20]/40",
    cardBorder: "border-white/10",
    cardHover: "hover:border-white/20 hover:shadow-xl hover:shadow-black/30",
    
    // Text
    text: {
      primary: "text-white",
      secondary: "text-white/80",
      muted: "text-white/50",
      heading: "text-white",
    },
    textPrimary: "text-white",
    textSecondary: "text-white/80",
    textMuted: "text-white/50",
    textHeading: "text-white",
    
    // Progress bars
    progressBg: "bg-white/5",
    progressBgHover: "hover:bg-white/10",
    progressBar: "bg-[#2563EB]",
    
    // Buttons
    buttonPrimary: "bg-gradient-to-r from-[#2563EB] to-[#2563EB]/80 hover:from-[#2563EB]/90 hover:to-[#2563EB]/70",
    buttonSecondary: "bg-gradient-to-r from-[#1A1A40]/60 to-[#1A1A40]/40 border-white/10 hover:border-white/20",
    buttonAccent: "bg-gradient-to-r from-[#EB2563]/20 to-[#EB2563]/10 border-[#EB2563]/30 hover:border-[#EB2563]/50",
    buttonHover: "hover:bg-white/10",
    
    // Navigation
    navBorder: "border-white/5",
    
    // Icons
    iconBg: "bg-[#2563EB]/20",
    iconBgPrimary: "bg-[#63EB25]/20",
    iconBgAccent: "bg-[#EB2563]/20",
    
    // Toggle
    toggleBg: "bg-gradient-to-r from-[#1A1A40]/60 to-[#1A1A40]/40 border-white/10 hover:border-white/20",
    
    // Gradient orbs
    orbSecondary: "from-[#2563EB]/20",
    orbPrimary: "from-[#63EB25]/20",
    orbAccent: "from-[#EB2563]/20",
    
    // Amount text gradient
    amountGradient: "bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent",
    
    // Container
    container: "bg-gradient-to-br from-[#0A0A20] to-[#1A1A40] border-white/10",
    content: "bg-gradient-to-br from-[#1A1A40]/40 via-[#1A1A40]/30 to-[#0A0A20]/40",
  },
  light: {
    // Backgrounds
    background: "bg-slate-50",
    backgroundGradient: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20",
    backgroundBlur: "bg-white/90 backdrop-blur-md",
    
    // Cards
    card: "bg-gradient-to-br from-white via-white/95 to-slate-50/80",
    cardBorder: "border-slate-200",
    cardHover: "hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50",
    
    // Text
    text: {
      primary: "text-slate-900",
      secondary: "text-slate-700",
      muted: "text-slate-500",
      heading: "text-slate-900",
    },
    textPrimary: "text-slate-900",
    textSecondary: "text-slate-700",
    textMuted: "text-slate-500",
    textHeading: "text-slate-900",
    
    // Progress bars
    progressBg: "bg-slate-100",
    progressBgHover: "hover:bg-slate-200",
    progressBar: "bg-[#2563EB]",
    
    // Buttons
    buttonPrimary: "bg-gradient-to-r from-[#2563EB] to-[#2563EB]/80 hover:from-[#2563EB]/90 hover:to-[#2563EB]/70",
    buttonSecondary: "bg-gradient-to-r from-slate-100 to-white border-slate-300 hover:border-slate-400 hover:from-slate-200 hover:to-slate-100",
    buttonAccent: "bg-gradient-to-r from-[#EB2563]/15 to-[#EB2563]/10 border-[#EB2563]/40 hover:border-[#EB2563]/60",
    buttonHover: "hover:bg-slate-100",
    
    // Navigation
    navBorder: "border-slate-200",
    
    // Icons
    iconBg: "bg-[#2563EB]/15",
    iconBgPrimary: "bg-[#63EB25]/15",
    iconBgAccent: "bg-[#EB2563]/15",
    
    // Toggle
    toggleBg: "bg-gradient-to-r from-slate-200 to-slate-100 border-slate-300 hover:border-slate-400",
    
    // Gradient orbs
    orbSecondary: "from-[#2563EB]/10",
    orbPrimary: "from-[#63EB25]/10",
    orbAccent: "from-[#EB2563]/10",
    
    // Amount text gradient
    amountGradient: "bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent",
    
    // Container
    container: "bg-gradient-to-br from-white to-slate-50 border-slate-200",
    content: "bg-gradient-to-br from-white via-white/95 to-slate-50/80",
  },
}