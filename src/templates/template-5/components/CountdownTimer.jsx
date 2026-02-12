import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useConfig } from "../../../ConfigContext";

function TimeBlock({ value, label, index }) {
    const display = String(value).padStart(2, "0");
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}
        >
            <div style={{ position: "relative" }}>
                {/* Outer glow */}
                <div style={{
                    position: "absolute", inset: "-6px",
                    background: "radial-gradient(circle, rgba(255,20,147,0.15) 0%, transparent 70%)",
                    borderRadius: "20px", filter: "blur(8px)",
                }} />
                <motion.div
                    key={display}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        width: "76px", height: "76px",
                        background: "linear-gradient(135deg, rgba(255,20,147,0.18) 0%, rgba(199,21,133,0.12) 100%)",
                        backdropFilter: "blur(16px)",
                        borderRadius: "16px",
                        border: "1px solid rgba(255,100,150,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 32px rgba(255,20,147,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
                        position: "relative",
                    }}
                >
                    <span style={{
                        fontSize: "2rem", fontWeight: 700, color: "#fff",
                        fontFamily: "'Poppins', sans-serif",
                        textShadow: "0 0 20px rgba(255,100,180,0.8)",
                        fontVariantNumeric: "tabular-nums",
                    }}>
                        {display}
                    </span>
                </motion.div>
            </div>
            <span style={{
                fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "2px",
                color: "rgba(255,150,180,0.5)", fontFamily: "'Poppins', sans-serif",
            }}>
                {label}
            </span>
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
                days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        }
        calculate();
        const id = setInterval(calculate, 1000);
        return () => clearInterval(id);
    }, [config.countdownDate]);

    return (
        <section className="py-20 px-6 relative z-10">
            {/* Background glow */}
            <div style={{
                position: "absolute", left: "50%", top: "50%",
                transform: "translate(-50%,-50%)",
                width: "400px", height: "200px",
                background: "radial-gradient(ellipse, rgba(255,20,147,0.08) 0%, transparent 70%)",
                filter: "blur(40px)", pointerEvents: "none",
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{ textAlign: "center", marginBottom: "12px", fontSize: "2.5rem" }}
            >
                <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ display: "inline-block", filter: "drop-shadow(0 0 12px rgba(255,20,147,0.7))" }}
                >
                    💝
                </motion.span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-5xl text-center mb-3 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent py-2 leading-[1.5]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
            >
                {isPast ? "Happy Valentine's Day!" : "Counting Down to Our Day"}
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center text-pink-300/40 mb-10 text-xs uppercase tracking-widest"
            >
                {isPast ? "forever starts now 💕" : "until Valentine's Day 💕"}
            </motion.p>

            <AnimatePresence mode="wait">
                {!isPast ? (
                    <motion.div
                        key="countdown"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}
                    >
                        <TimeBlock value={timeLeft.days}    label="Days"    index={0} />
                        <div style={{ display: "flex", alignItems: "center", paddingBottom: "24px" }}>
                            <motion.span
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                style={{ color: "rgba(255,100,150,0.6)", fontSize: "1.8rem", fontWeight: 700 }}
                            >
                                :
                            </motion.span>
                        </div>
                        <TimeBlock value={timeLeft.hours}   label="Hours"   index={1} />
                        <div style={{ display: "flex", alignItems: "center", paddingBottom: "24px" }}>
                            <motion.span
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                                style={{ color: "rgba(255,100,150,0.6)", fontSize: "1.8rem", fontWeight: 700 }}
                            >
                                :
                            </motion.span>
                        </div>
                        <TimeBlock value={timeLeft.minutes} label="Minutes" index={2} />
                        <div style={{ display: "flex", alignItems: "center", paddingBottom: "24px" }}>
                            <motion.span
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                style={{ color: "rgba(255,100,150,0.6)", fontSize: "1.8rem", fontWeight: 700 }}
                            >
                                :
                            </motion.span>
                        </div>
                        <TimeBlock value={timeLeft.seconds} label="Seconds" index={3} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="past"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        style={{ textAlign: "center", fontSize: "5rem" }}
                    >
                        💕🎉💕
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
