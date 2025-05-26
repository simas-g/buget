import { motion } from "framer-motion";

export default function GlowingCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary to-accent rounded-2xl blur opacity-30 animate-pulse"></div>

      <div className="relative bg-[#0A0A20]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
        {children}
      </div>
    </motion.div>
  );
}
