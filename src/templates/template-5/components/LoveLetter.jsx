import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useConfig } from "../../../ConfigContext";

export default function LoveLetter() {
    const config = useConfig();
    const [opened, setOpened] = useState(false);
    if (!config.loveLetter) return null;

    return (
        <section className="py-20 px-6 relative z-10">
            <div className="max-w-2xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-10"
                >
                    <h2
                        className="text-3xl sm:text-5xl mb-3 bg-gradient-to-r from-pink-300 via-rose-300 to-red-300 bg-clip-text text-transparent py-2 leading-[1.5]"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                        A Letter For You
                    </h2>
                    <p className="text-pink-300/40 text-sm uppercase tracking-widest">
                        {opened ? "with all my heart 💕" : "tap the envelope to open"}
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!opened ? (
                        /* ── Envelope (closed) ── */
                        <motion.div
                            key="envelope"
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.2, y: -40 }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setOpened(true)}
                                className="cursor-pointer border-0 bg-transparent p-0 relative"
                            >
                                {/* Envelope body */}
                                <div style={{
                                    width: "260px", height: "180px",
                                    background: "linear-gradient(135deg, #1a0020 0%, #2d0030 50%, #1a0020 100%)",
                                    border: "2px solid rgba(255,100,150,0.35)",
                                    borderRadius: "16px",
                                    position: "relative",
                                    boxShadow: "0 20px 60px rgba(255,20,147,0.3), 0 0 0 1px rgba(255,100,150,0.1)",
                                    overflow: "hidden",
                                }}>
                                    {/* Envelope flap */}
                                    <div style={{
                                        position: "absolute", top: 0, left: 0, right: 0,
                                        height: "90px", overflow: "hidden",
                                    }}>
                                        <div style={{
                                            width: 0, height: 0,
                                            borderLeft: "130px solid transparent",
                                            borderRight: "130px solid transparent",
                                            borderTop: "80px solid rgba(255,20,147,0.25)",
                                        }} />
                                    </div>
                                    {/* Envelope V-fold */}
                                    <div style={{
                                        position: "absolute", bottom: 0, left: 0, right: 0,
                                        height: "100px",
                                        background: "linear-gradient(135deg, rgba(255,20,147,0.1), rgba(199,21,133,0.08))",
                                    }} />
                                    {/* Heart seal */}
                                    <div style={{
                                        position: "absolute", top: "50%", left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "2.5rem",
                                        filter: "drop-shadow(0 0 12px rgba(255,20,147,0.8))",
                                    }}>
                                        <motion.div
                                            animate={{ scale: [1, 1.15, 1] }}
                                            transition={{ duration: 1.2, repeat: Infinity }}
                                        >
                                            💌
                                        </motion.div>
                                    </div>
                                    {/* Shimmer */}
                                    <motion.div
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                                        style={{
                                            position: "absolute", inset: 0,
                                            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                                        }}
                                    />
                                </div>
                                <p className="text-pink-300/50 mt-4 text-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                    Tap to open your letter 💕
                                </p>
                            </motion.button>
                        </motion.div>
                    ) : (
                        /* ── Letter (opened) ── */
                        <motion.div
                            key="letter"
                            initial={{ opacity: 0, y: 60, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ type: "spring", duration: 0.9, bounce: 0.3 }}
                            className="relative"
                        >
                            {/* Glow backdrop */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 rounded-3xl blur-2xl -z-10" />

                            <div style={{
                                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,20,147,0.04) 100%)",
                                backdropFilter: "blur(20px)",
                                borderRadius: "24px",
                                padding: "40px 32px",
                                border: "1px solid rgba(255,100,150,0.2)",
                                boxShadow: "0 30px 80px rgba(255,20,147,0.15)",
                                position: "relative", overflow: "hidden",
                            }}>
                                {/* Corner decorations */}
                                <div style={{ position: "absolute", top: "16px", left: "16px", color: "rgba(255,100,150,0.25)", fontSize: "1.5rem" }}>❦</div>
                                <div style={{ position: "absolute", top: "16px", right: "16px", color: "rgba(255,100,150,0.25)", fontSize: "1.5rem" }}>❦</div>
                                <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,100,150,0.2)", fontSize: "1.5rem" }}>❦</div>

                                {/* Letter lines */}
                                {config.loveLetter.split("\n").map((line, i) => (
                                    <motion.p
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                                        className="text-pink-100/80 text-base sm:text-lg leading-relaxed mb-4"
                                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                                    >
                                        {line || <>&nbsp;</>}
                                    </motion.p>
                                ))}
                            </div>

                            {/* Re-seal button */}
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                                onClick={() => setOpened(false)}
                                className="mt-6 w-full text-center text-pink-300/30 text-xs uppercase tracking-widest cursor-pointer bg-transparent border-0 hover:text-pink-300/60 transition-colors"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                            >
                                seal the letter
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
