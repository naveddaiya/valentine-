import { motion } from "framer-motion";
import { useConfig } from "../../../ConfigContext";

export default function Footer() {
    const config = useConfig();
    const year = new Date(config.countdownDate).getFullYear();

    return (
        <footer style={{ padding: "60px 24px 48px", textAlign: "center", position: "relative", zIndex: 10 }}>
            {/* Divider */}
            <div style={{
                width: "120px", height: "1px", margin: "0 auto 40px",
                background: "linear-gradient(90deg, transparent, rgba(255,100,150,0.3), transparent)",
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            >
                {/* Wax seal stamp */}
                <motion.div
                    animate={{ rotate: [0, 3, -3, 0], scale: [1, 1.05, 1] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        width: "64px", height: "64px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #ff1493, #c71585)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 20px",
                        boxShadow: "0 0 30px rgba(255,20,147,0.4), 0 0 60px rgba(255,20,147,0.15)",
                        border: "2px solid rgba(255,255,255,0.15)",
                        fontSize: "1.8rem",
                    }}
                >
                    💝
                </motion.div>

                <p style={{
                    fontFamily: "'Great Vibes', cursive",
                    fontSize: "1.6rem",
                    color: "rgba(255,180,210,0.6)",
                    marginBottom: "8px",
                }}>
                    Made with love for {config.receiverName}
                </p>
                <p style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.7rem",
                    color: "rgba(255,100,150,0.25)",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    marginBottom: "24px",
                }}>
                    Valentine's Day {year} · Sealed with a kiss 💋
                </p>

                {/* Bottom hearts */}
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", opacity: 0.2 }}>
                    {["💕", "💖", "💗", "💘", "💝"].map((h, i) => (
                        <motion.span
                            key={i}
                            animate={{ y: [0, -6, 0], opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            style={{ fontSize: "1rem" }}
                        >
                            {h}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </footer>
    );
}
