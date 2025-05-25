export default function Input({ className = "", error = false, ...props }) {
  const baseClasses =
    "w-full rounded-lg bg-[#1A1A40]/50 border text-white placeholder:text-white/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0A20]"
  const errorClasses = error
    ? "border-[#EB2563] focus:border-[#EB2563] focus:ring-[#EB2563]/20"
    : "border-white/20 focus:border-[#2563EB] focus:ring-[#2563EB]/20"

  return <input className={`${baseClasses} ${errorClasses} ${className}`} {...props} />
}