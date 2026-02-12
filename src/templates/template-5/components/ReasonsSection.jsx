import { motion } from "framer-motion";
import { useState } from "react";
import { useConfig } from "../../../ConfigContext";

// Individual flip card — front shows number, back shows reason
function ReasonCard({ reason, index }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            style={{ perspective: "600px", cursor: "pointer" }}
            onClick={() => setFlipped(f => !f)}
        >
            <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{ position: "relative", transformStyle: "preserve-3d", height: "80px" }}
            >
                {/* Front — number badge */}
                <div style={{
                    position: "absolute", inset: 0, backfaceVisibility: "hidden",
                    display: "flex", alignItems: "center", gap: "16px",
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    padding: "0 20px",
                    border: "1px solid rgba(255,100,150,0.2)",
                    boxShadow: flipped ? "none" : "0 4px 24px rgba(255,20,147,0.08)",
                }}>
                    <div style={{
                        width: "44px", height: "44px", flexShrink: 0,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ff1493, #c71585)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem", fontWeight: 700, color: "#fff",
                        boxShadow: "0 0 16px rgba(255,20,147,0.5)",
                    }}>
                        {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: "rgba(255,200,220,0.6)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "2px", fontFamily: "'Poppins', sans-serif" }}>
                            Reason #{index + 1}
                        </p>
                        <p style={{ color: "rgba(255,180,210,0.5)", fontSize: "0.8rem", fontFamily: "'Dancing Script', cursive" }}>
                            tap to reveal 💕
                        </p>
                    </div>
                    <span style={{ color: "rgba(255,150,180,0.4)", fontSize: "1.2rem" }}>❤️</span>
                </div>

                {/* Back — the actual reason */}
                <div style={{
                    position: "absolute", inset: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    display: "flex", alignItems: "center", gap: "16px",
                    background: "linear-gradient(135deg, rgba(255,20,147,0.12), rgba(199,21,133,0.08))",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    padding: "0 20px",
                    border: "1px solid rgba(255,20,147,0.3)",
                    boxShadow: "0 4px 30px rgba(255,20,147,0.2)",
                }}>
                    <div style={{
                        width: "44px", height: "44px", flexShrink: 0,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #ff1493, #c71585)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.1rem",
                    }}>
                        💕
                    </div>
                    <p style={{
                        flex: 1, color: "rgba(255,220,235,0.95)",
                        fontSize: "clamp(0.85rem, 2vw, 1rem)",
                        fontFamily: "'Dancing Script', cursive",
                        lineHeight: 1.4,
                    }}>
                        {reason}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

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
                transition={{ delay: 0.3 }}
                className="text-center text-pink-300/40 mb-12 text-xs uppercase tracking-widest"
            >
                {config.reasons.length} of infinite reasons · tap each card to reveal
            </motion.p>

            <div className="max-w-2xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {config.reasons.map((reason, i) => (
                    <ReasonCard key={i} reason={reason} index={i} />
                ))}
            </div>
        </section>
    );
}
