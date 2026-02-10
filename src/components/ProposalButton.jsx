import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { useConfig } from "../ConfigContext";

export default function ProposalButton() {
  const config = useConfig();
  const [accepted, setAccepted] = useState(false);
  const [noScale, setNoScale] = useState(1);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  const fireConfetti = useCallback(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#ff6b6b", "#ee5a24", "#f8b500", "#ff9ff3", "#ffffff"] });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#ff6b6b", "#ee5a24", "#f8b500", "#ff9ff3", "#ffffff"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ["#ff6b6b", "#ee5a24", "#f8b500", "#ff9ff3", "#ffffff"] });
  }, []);

  const handleYes = () => { setAccepted(true); fireConfetti(); };

  const handleNoHover = () => {
    setNoScale((s) => Math.max(s - 0.05, 0.4));
    setNoPos({ x: (Math.random() - 0.5) * 300, y: (Math.random() - 0.5) * 200 });
  };

  return (
    <section className="py-20 px-6 relative z-10">
      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2
              className="text-3xl sm:text-5xl mb-4 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent py-2 leading-[1.5]"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              So, what do you say?
            </h2>
            <p className="text-pink-300/50 mb-12 text-sm uppercase tracking-widest">Choose wisely 😉</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYes}
                className="px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xl font-semibold rounded-full shadow-2xl shadow-pink-500/40 cursor-pointer border-0"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {config.yesText}
              </motion.button>

              <motion.button
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="px-10 py-4 bg-white/10 backdrop-blur-sm text-pink-200 text-xl rounded-full border border-white/20 cursor-pointer"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {config.noText}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="accepted"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-7xl sm:text-9xl mb-8"
            >
              💕
            </motion.div>
            <h2
              className="text-3xl sm:text-5xl bg-gradient-to-r from-pink-300 via-rose-300 to-red-300 bg-clip-text text-transparent mb-4 py-2 leading-[1.5]"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              {config.acceptedMessage}
            </h2>
            <p className="text-pink-200/70 text-xl" style={{ fontFamily: "'Dancing Script', cursive" }}>
              ~ {config.senderName} & {config.receiverName} ~
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
