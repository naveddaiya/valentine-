import { motion } from "framer-motion";
import { useConfig } from "../ConfigContext";

export default function T5Footer() {
  const config = useConfig();

  return (
    <footer className="py-12 px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <div className="text-3xl mb-4">💝</div>
        <p className="text-pink-300/40 text-lg" style={{ fontFamily: "'Dancing Script', cursive" }}>
          Made with love for {config.receiverName}
        </p>
        <p className="text-pink-300/20 text-xs mt-2 uppercase tracking-widest">
          Valentine's Day {new Date(config.countdownDate).getFullYear()}
        </p>
      </motion.div>
    </footer>
  );
}
