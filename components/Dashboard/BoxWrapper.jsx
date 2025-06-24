export default function BoxWrapper({ children, className }) {
  return (
    <div className={`${className} bg-[#1A1A40]/30 backdrop-blur-sm border border-white/10 rounded-2xl p-5`}>
      {children}
    </div>
  );
}
