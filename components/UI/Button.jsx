export default function Button({ children, variant, className, ...props }) {
  const variants = {
    accent: "border-accent border text-accent hover:bg-accent hover:text-white transition-colors duration-300",
    ctaPrimary: "bg-[#2563EB] text-white rounded-lg",
    primaryGradient:
      "bg-gradient-to-r from-secondary to-accent text-white hover:shadow-[0_0_20px_var(--color-secondary)] transition-all duration-300",
    basic:
      "text-white border hover:bg-white hover:text-gray-700 transition-all duration-300",
    primary:
      "bg-gradient-to-r from-[#2563EB] to-[#63EB25] text-white hover:shadow-[0_0_20px_rgba(99,235,37,0.5)] focus:ring-[#2563EB]",
    outline:
      "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 focus:ring-white/20",
  };
  const buttonClass = `cursor-pointer rounded-lg ${variants[variant]} ${className}`;
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}
