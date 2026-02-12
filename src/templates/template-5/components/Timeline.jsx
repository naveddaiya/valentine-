import { motion } from "framer-motion";
import { useConfig } from "../../../ConfigContext";

const EMOJIS = ["✨", "💕", "🌹", "💍", "☕", "🎉", "🏡", "💫", "🎶", "🌅"];

function TimelineEvent({ event, index }) {
    const emoji = event.emoji || EMOJIS[index % EMOJIS.length];

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: index * 0.12, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "flex-start", marginBottom: "36px", position: "relative" }}
        >
            {/* Dot */}
            <div style={{ flexShrink: 0, width: "56px", display: "flex", justifyContent: "center", zIndex: 10, paddingTop: "4px" }}>
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12 + 0.3, type: "spring", bounce: 0.5 }}
                    style={{
                        width: "44px", height: "44px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #ff1493, #c71585)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 0 20px rgba(255,20,147,0.6), 0 0 40px rgba(255,20,147,0.2)",
                        border: "2px solid rgba(255,255,255,0.15)",
                        fontSize: "1.2rem", flexShrink: 0,
                    }}
                >
                    {emoji}
                </motion.div>
            </div>

            {/* Card */}
            <div style={{ flex: 1, paddingLeft: "14px" }}>
                <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(12px)",
                        borderRadius: "16px",
                        padding: "16px 20px",
                        border: "1px solid rgba(255,100,150,0.2)",
                        boxShadow: "0 4px 24px rgba(255,20,147,0.08)",
                        position: "relative", overflow: "hidden",
                    }}
                >
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(135deg, rgba(255,20,147,0.04), transparent)",
                        borderRadius: "16px", pointerEvents: "none",
                    }} />
                    <span style={{
                        fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "2px",
                        color: "rgba(255,150,200,0.55)", fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                    }}>
                        {event.date}
                    </span>
                    <h3 style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
                        color: "rgba(255,220,235,0.95)",
                        margin: "4px 0 8px", lineHeight: 1.3,
                    }}>
                        {event.title}
                    </h3>
                    {event.description && (
                        <p style={{
                            color: "rgba(255,180,210,0.55)",
                            fontSize: "0.85rem", lineHeight: 1.65,
                            fontFamily: "'Poppins', sans-serif", margin: 0,
                        }}>
                            {event.description}
                        </p>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}

export default function Timeline() {
    const config = useConfig();
    if (!config.timeline || config.timeline.length === 0) return null;

    return (
        <section className="py-20 px-6 relative z-10">
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-5xl text-center mb-4 bg-gradient-to-r from-violet-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent leading-[1.5] py-2"
                style={{ fontFamily: "'Great Vibes', cursive" }}
            >
                Our Love Story
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center text-pink-300/40 mb-14 text-xs uppercase tracking-widest"
            >
                {config.timeline.length} chapters of us
            </motion.p>

            <div style={{ maxWidth: "680px", margin: "0 auto", position: "relative" }}>
                {/* Animated vertical line */}
                <motion.div
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        left: "27px", top: "22px", bottom: "22px",
                        width: "2px", transformOrigin: "top",
                        background: "linear-gradient(180deg, #ff1493 0%, rgba(199,21,133,0.4) 60%, rgba(255,20,147,0.1) 100%)",
                    }}
                />
                {config.timeline.map((event, i) => (
                    <TimelineEvent key={i} event={event} index={i} />
                ))}
            </div>
        </section>
    );
}
