import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useConfig } from "../../../ConfigContext";

// ── Typewriter with blinking cursor ─────────────────────────────────────────
function TypeWriter({ text, delay = 0 }) {
    const [chars, setChars]     = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    useEffect(() => {
        if (!started || chars.length >= text.length) return;
        const t = setTimeout(() => setChars(text.slice(0, chars.length + 1)), 60);
        return () => clearTimeout(t);
    }, [chars, text, started]);

    return (
        <span>
            {chars}
            {chars.length < text.length && started && (
                <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                    style={{ color: "#ff1493" }}
                >
                    |
                </motion.span>
            )}
        </span>
    );
}

// ── Cyber corner bracket decoration ─────────────────────────────────────────
function CyberCorners() {
    const corners = [
        { style: { top: "24px", left: "24px" },  transform: "none" },
        { style: { top: "24px", right: "24px" },  transform: "scale(-1,1)" },
        { style: { bottom: "24px", left: "24px" }, transform: "scale(1,-1)" },
        { style: { bottom: "24px", right: "24px" }, transform: "scale(-1,-1)" },
    ];
    return (
        <>
            {corners.map((c, i) => (
                <motion.svg
                    key={i}
                    width="34" height="34" viewBox="0 0 34 34" fill="none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    style={{ position: "absolute", ...c.style, transform: c.transform, pointerEvents: "none", zIndex: 3 }}
                >
                    <path d="M0 17 L0 2 Q0 0 2 0 L17 0" stroke="#ff1493" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="2.5" fill="#ff1493" opacity="0.8" />
                </motion.svg>
            ))}
        </>
    );
}

// ── Horizontal neon scan line ────────────────────────────────────────────────
function ScanLine() {
    return (
        <motion.div
            animate={{ y: ["-60vh", "160vh"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 3.5 }}
            style={{
                position: "absolute", left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,20,147,0.55) 25%, rgba(255,100,200,0.8) 50%, rgba(255,20,147,0.55) 75%, transparent 100%)",
                pointerEvents: "none", zIndex: 2,
                boxShadow: "0 0 10px rgba(255,20,147,0.5)",
            }}
        />
    );
}

// ── Main hero ────────────────────────────────────────────────────────────────
export default function VideoHero() {
    const config      = useConfig();
    const ref         = useRef(null);
    const { scrollY } = useScroll();
    const opacity     = useTransform(scrollY, [0, 400], [1, 0]);
    const yParallax   = useTransform(scrollY, [0, 400], [0, 80]);

    useEffect(() => {
        const t = setTimeout(() => {
            confetti({
                particleCount: 90,
                spread: 70,
                origin: { y: 0.5 },
                colors: ["#ff1493", "#ff69b4", "#ffffff", "#c71585", "#ff006e"],
                gravity: 0.85,
                scalar: 0.95,
            });
        }, 1800);
        return () => clearTimeout(t);
    }, []);

    return (
        <section
            ref={ref}
            className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        >
            {/* Optional video background */}
            {config.videoUrl && (
                <>
                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src={config.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/80" />
                </>
            )}

            {/* Cyber brackets in all 4 corners */}
            <CyberCorners />

            {/* Moving neon scan line */}
            <ScanLine />

            {/* Large radial glow behind content */}
            <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.36, 0.18] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute", width: "80vw", height: "80vw",
                    maxWidth: "740px", maxHeight: "740px",
                    borderRadius: "50%", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    background: "radial-gradient(circle, rgba(255,0,128,0.14) 0%, transparent 68%)",
                    filter: "blur(70px)", pointerEvents: "none",
                }}
            />

            {/* ── Content ─────────────────────────────────────────────────── */}
            <motion.div style={{ opacity, y: yParallax }} className="relative z-10 flex flex-col items-center">

                {/* Neon glowing heart */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 1.2, bounce: 0.55 }}
                    className="mb-6"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            fontSize: "clamp(4.5rem, 11vw, 7.5rem)",
                            filter: "drop-shadow(0 0 18px rgba(255,0,128,1)) drop-shadow(0 0 52px rgba(255,0,128,0.55))",
                            lineHeight: 1,
                        }}
                    >
                        💝
                    </motion.div>
                </motion.div>

                {/* ── Title with chromatic-aberration glitch ─────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                    style={{ position: "relative", marginBottom: "20px", width: "100%" }}
                >
                    {/* Main layer */}
                    <h1 style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize: "clamp(3rem, 10vw, 7rem)",
                        lineHeight: 1.2,
                        background: "linear-gradient(135deg, #ffffff 0%, #ffc8e8 30%, #ff69b4 60%, #ff0080 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        filter: "drop-shadow(0 0 22px rgba(255,0,128,0.65))",
                        position: "relative", zIndex: 1,
                    }}>
                        <TypeWriter text={config.heroTitle} delay={900} />
                    </h1>

                    {/* Cyan glitch offset */}
                    <motion.h1
                        aria-hidden
                        animate={{
                            x:       [0, -4, 3, -2, 0],
                            opacity: [0, 0.18, 0, 0.12, 0],
                            scaleX:  [1, 1.01, 0.99, 1],
                        }}
                        transition={{ duration: 0.14, repeat: Infinity, repeatDelay: 4.5 }}
                        style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: "clamp(3rem, 10vw, 7rem)",
                            lineHeight: 1.2,
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, #00ffee, #0066ff)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                            userSelect: "none", zIndex: 0,
                        }}
                    >
                        {config.heroTitle}
                    </motion.h1>

                    {/* Orange/red glitch offset */}
                    <motion.h1
                        aria-hidden
                        animate={{
                            x:       [0, 3, -4, 2, 0],
                            opacity: [0, 0.13, 0, 0.09, 0],
                        }}
                        transition={{ duration: 0.12, repeat: Infinity, repeatDelay: 6.5 }}
                        style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: "clamp(3rem, 10vw, 7rem)",
                            lineHeight: 1.2,
                            position: "absolute", inset: 0,
                            background: "linear-gradient(135deg, #ff6600, #ff1493)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                            userSelect: "none", zIndex: 0,
                        }}
                    >
                        {config.heroTitle}
                    </motion.h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.4, duration: 1.6 }}
                    className="text-lg sm:text-xl md:text-2xl max-w-xl leading-relaxed mb-10"
                    style={{
                        fontFamily: "'Dancing Script', cursive",
                        color: "rgba(255,200,230,0.88)",
                        textShadow: "0 0 20px rgba(255,0,128,0.4), 0 0 40px rgba(255,0,128,0.18)",
                    }}
                >
                    {config.heroSubtitle}
                </motion.p>

                {/* Cyber date badge */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4.2, duration: 0.9 }}
                    style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "52px" }}
                >
                    <div style={{ width: "32px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,20,147,0.6))" }} />
                    <span style={{
                        color: "rgba(255,100,160,0.6)",
                        fontSize: "0.65rem", letterSpacing: "4px", textTransform: "uppercase",
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        Valentine's Day 2026
                    </span>
                    <div style={{ width: "32px", height: "1px", background: "linear-gradient(90deg, rgba(255,20,147,0.6), transparent)" }} />
                </motion.div>

                {/* Scroll hint */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5, duration: 1 }}>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        style={{
                            color: "rgba(255,80,140,0.3)", fontSize: "0.7rem",
                            letterSpacing: "5px", textTransform: "uppercase",
                            fontFamily: "'Poppins', sans-serif",
                        }}
                    >
                        ↓ &nbsp; scroll &nbsp; ↓
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
