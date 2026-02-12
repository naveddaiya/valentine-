import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { useConfig } from "../../../ConfigContext";
import { Heart } from "lucide-react";

export default function ProposalButton() {
    const config = useConfig();
    const [accepted, setAccepted] = useState(false);
    const [noScale, setNoScale] = useState(1);
    const [noPos, setNoPos] = useState({ x: 0, y: 0 });
    const [noAttempts, setNoAttempts] = useState(0);

    const fireConfetti = useCallback(() => {
        const colors = ["#ff6b6b", "#ff1493", "#f8b500", "#ff9ff3", "#ffffff", "#ffd700"];
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.55 }, colors, scalar: 1.2 });
        setTimeout(() => {
            confetti({ particleCount: 80, angle: 60,  spread: 60, origin: { x: 0 }, colors });
            confetti({ particleCount: 80, angle: 120, spread: 60, origin: { x: 1 }, colors });
        }, 300);
        setTimeout(() => {
            confetti({ particleCount: 60, spread: 80, origin: { y: 0.3 }, colors, gravity: 0.6 });
        }, 700);
    }, []);

    const handleYes = () => {
        setAccepted(true);
        fireConfetti();
    };

    const handleNoHover = () => {
        const attempts = noAttempts + 1;
        setNoAttempts(attempts);
        const range = Math.min(attempts * 80, 400);
        setNoScale(s => Math.max(s - 0.08, 0.25));
        setNoPos({
            x: (Math.random() - 0.5) * range * 2,
            y: (Math.random() - 0.5) * range,
        });
    };

    const noMessages = [
        config.noText,
        "Are you sure? 🥺",
        "Really sure? 💔",
        "Think again... 🤔",
        "Last chance... 😭",
        "Please? 🙏",
        "I beg you 😢",
        "...",
    ];
    const noLabel = noMessages[Math.min(noAttempts, noMessages.length - 1)];

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
                        style={{ textAlign: "center" }}
                    >
                        {/* Question */}
                        <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            style={{ fontSize: "3rem", marginBottom: "16px", filter: "drop-shadow(0 0 20px rgba(255,20,147,0.7))" }}
                        >
                            💍
                        </motion.div>
                        <h2
                            className="text-3xl sm:text-5xl mb-3 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent py-2 leading-[1.5]"
                            style={{ fontFamily: "'Great Vibes', cursive" }}
                        >
                            So, what do you say?
                        </h2>
                        <p style={{
                            color: "rgba(255,150,180,0.5)", marginBottom: "48px",
                            fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px",
                            fontFamily: "'Poppins', sans-serif",
                        }}>
                            {noAttempts === 0 ? "choose wisely 😉" : `(the No button keeps running away... ${noAttempts} ${noAttempts === 1 ? "attempt" : "attempts"})`}
                        </p>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", minHeight: "80px" }}>
                            {/* Yes button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleYes}
                                style={{
                                    padding: "16px 44px",
                                    background: "linear-gradient(135deg, #ff1493, #c71585)",
                                    border: "none", borderRadius: "100px",
                                    color: "#fff", fontSize: "1.2rem",
                                    fontFamily: "'Dancing Script', cursive",
                                    cursor: "pointer",
                                    boxShadow: "0 0 30px rgba(255,20,147,0.5), 0 8px 24px rgba(255,20,147,0.3)",
                                    display: "flex", alignItems: "center", gap: "10px",
                                }}
                            >
                                <Heart size={18} fill="white" />
                                {config.yesText}
                            </motion.button>

                            {/* Elusive No button */}
                            <motion.button
                                onMouseEnter={handleNoHover}
                                onTouchStart={handleNoHover}
                                animate={{ x: noPos.x, y: noPos.y, scale: noScale }}
                                transition={{ type: "spring", stiffness: 250, damping: 18 }}
                                style={{
                                    padding: "14px 32px",
                                    background: "rgba(255,255,255,0.06)",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderRadius: "100px", color: "rgba(255,200,220,0.6)",
                                    fontSize: "1rem", fontFamily: "'Dancing Script', cursive",
                                    cursor: "pointer", whiteSpace: "nowrap",
                                }}
                            >
                                {noLabel}
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="accepted"
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                        style={{ textAlign: "center" }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 12, -12, 8, -8, 0], scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            style={{ fontSize: "6rem", marginBottom: "24px", filter: "drop-shadow(0 0 30px rgba(255,20,147,0.8))" }}
                        >
                            💕
                        </motion.div>
                        <h2
                            className="text-3xl sm:text-5xl bg-gradient-to-r from-pink-300 via-rose-300 to-red-300 bg-clip-text text-transparent mb-4 py-2 leading-[1.5]"
                            style={{ fontFamily: "'Great Vibes', cursive" }}
                        >
                            {config.acceptedMessage}
                        </h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            style={{
                                color: "rgba(255,200,220,0.7)", fontSize: "1.3rem",
                                fontFamily: "'Dancing Script', cursive",
                            }}
                        >
                            ~ {config.senderName} & {config.receiverName} ~
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
