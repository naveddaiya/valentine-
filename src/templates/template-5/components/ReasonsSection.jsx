import { motion } from "framer-motion";
import { useConfig } from "../../../ConfigContext";

export default function ReasonsSection() {
  const config = useConfig();
  if (!config.reasons || config.reasons.length === 0) return null;

  return (
    <section className="py-20 px-6 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-5xl text-center mb-4 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent py-2 leading-[1.5]"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Reasons I Love You
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-center text-pink-300/50 mb-12 text-sm uppercase tracking-widest"
      >
        {config.reasons.length} of infinite reasons
      </motion.p>

      <div className="max-w-3xl mx-auto space-y-4">
        {config.reasons.map((reason, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300 group"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
              {i + 1}
            </div>
            <p
              className="text-pink-100/80 text-base sm:text-lg"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              {reason}
            </p>
            <div className="ml-auto text-lg opacity-0 group-hover:opacity-100 transition-opacity">
              💕
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
