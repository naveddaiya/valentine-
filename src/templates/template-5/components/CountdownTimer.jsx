import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useConfig } from "../../../ConfigContext";

function TimeBlock({ value, label }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-pink-500/30 to-rose-500/30 backdrop-blur-lg rounded-2xl border border-white/10 flex items-center justify-center shadow-xl shadow-pink-500/10">
          <span className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
            {String(value).padStart(2, "0")}
          </span>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl blur-lg -z-10" />
      </div>
      <span className="mt-3 text-xs sm:text-sm text-pink-300/60 uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}

export default function CountdownTimer() {
  const config = useConfig();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    function calculate() {
      const target = new Date(config.countdownDate).getTime();
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { setIsPast(true); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [config.countdownDate]);

  return (
    <section className="py-20 px-6 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-5xl text-center mb-12 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent py-2 leading-[1.5]"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        {isPast ? "Happy Valentine's Day! 🎉" : "Counting Down to Our Day"}
      </motion.h2>

      {!isPast && (
        <div className="flex justify-center gap-4 sm:gap-6">
          <TimeBlock value={timeLeft.days} label="Days" />
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <TimeBlock value={timeLeft.minutes} label="Mins" />
          <TimeBlock value={timeLeft.seconds} label="Secs" />
        </div>
      )}

      {isPast && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-6xl sm:text-8xl text-center"
        >
          💕🎉💕
        </motion.div>
      )}
    </section>
  );
}
