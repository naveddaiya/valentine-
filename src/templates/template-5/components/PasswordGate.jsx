import { motion } from "framer-motion";
import { useState } from "react";
import { useConfig } from "../../../ConfigContext";

export default function PasswordGate({ onUnlock }) {
  const config = useConfig();
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.toLowerCase().trim() === config.password.toLowerCase().trim()) {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
      setInput("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black px-6"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-rose-500/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 1, bounce: 0.3 }}
        className="text-7xl mb-8"
      >
        🔒
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-2xl sm:text-4xl mb-3 bg-gradient-to-r from-amber-200 via-rose-300 to-pink-400 bg-clip-text text-transparent"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        This page is just for you
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-white/40 text-sm mb-8 uppercase tracking-widest"
      >
        {config.passwordHint}
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full max-w-xs relative z-10"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter the secret word..."
          className={`w-full px-6 py-4 rounded-2xl bg-white/5 border text-center text-white text-lg outline-none transition-all duration-300 ${
            error
              ? "border-red-500/60 bg-red-500/10"
              : "border-white/10 focus:border-pink-500/40"
          }`}
          style={{ fontFamily: "'Dancing Script', cursive" }}
          autoFocus
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-xl shadow-pink-500/30 cursor-pointer border-0 text-base"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Unlock My Surprise 💝
        </motion.button>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400/70 text-sm"
          >
            That's not it... try again! 💕
          </motion.p>
        )}
      </motion.form>
    </motion.div>
  );
}
