import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useConfig } from "../../../ConfigContext";

function TypeWriter({ text, delay = 0 }) {
    const [chars, setChars]     = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    useEffect(() => {
        if (!started || chars.length >= text.length) return;
        const t = setTimeout(() => setChars(text.slice(0, chars.length + 1)), 65);
        return () => clearTimeout(t);
    }, [chars, text, started]);

    return (
        <span>
            {chars}
            {chars.length < text.length && started && (
                <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>|</motion.span>
            )}
        </span>
    );
}

function Sparkle({ x, y, size, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
            transition={{ delay, duration: 1.2, repeat: Infinity, repeatDelay: Math.random() * 3 + 2 }}
            style={{ position: "absolute", left: `${x}%`, top: `${y}%`, fontSize: `${size}px`, pointerEvents: "none", zIndex: 5 }}
        >
            ✨
        </motion.div>
    );
}

const SPARKLES = [
    { x: 12, y: 20, size: 18, delay: 0.5 },
    { x: 85, y: 15, size: 14, delay: 1.2 },
    { x: 8,  y: 70, size: 20, delay: 0.8 },
    { x: 90, y: 65, size: 16, delay: 1.8 },
    { x: 50, y: 5,  size: 12, delay: 2.1 },
    { x: 30, y: 88, size: 18, delay: 0.3 },
    { x: 72, y: 82, size: 14, delay: 1.5 },
];

export default function VideoHero() {
    const config    = useConfig();
    const ref       = useRef(null);
    const { scrollY } = useScroll();
    const opacity   = useTransform(scrollY, [0, 400], [1, 0]);
    const yParallax = useTransform(scrollY, [0, 400], [0, 80]);

    useEffect(() => {
        const t = setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.5 },
                colors: ["#ff1493", "#ff69b4", "#fff", "#ffd700", "#ff6b6b"],
                gravity: 0.9,
                scalar: 0.9,
            });
        }, 1800);
        return () => clearTimeout(t);
    }, []);

    return (
        <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
            {/* Ambient glow orbs */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", width: "60vw", height: "60vw", maxWidth: "600px", maxHeight: "600px", borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(255,20,147,0.2) 0%, transparent 70%)", filter: "blur(60px)" }}
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    style={{ position: "absolute", width: "40vw", height: "40vw", maxWidth: "400px", maxHeight: "400px", borderRadius: "50%", top: "30%", left: "70%", background: "radial-gradient(circle, rgba(199,21,133,0.2) 0%, transparent 70%)", filter: "blur(80px)" }}
                />
            </div>

            {SPARKLES.map((s, i) => <Sparkle key={i} {...s} />)}

            {config.videoUrl && (
                <>
                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src={config.videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/70" />
                </>
            )}

            <motion.div style={{ opacity, y: yParallax }} className="relative z-10 flex flex-col items-center">
                {/* Beating heart */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 1.2, bounce: 0.5 }}
                    className="mb-8"
                >
                    <motion.div
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        style={{ fontSize: "clamp(5rem, 12vw, 8rem)", filter: "drop-shadow(0 0 30px rgba(255,20,147,0.8))" }}
                    >
                        💝
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                    style={{
                        fontFamily: "'Great Vibes', cursive",
                        fontSize: "clamp(3rem, 10vw, 7rem)",
                        lineHeight: 1.2, marginBottom: "24px",
                        background: "linear-gradient(135deg, #fff 0%, #ffcce8 40%, #ff69b4 70%, #ff1493 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                        filter: "drop-shadow(0 0 30px rgba(255,100,180,0.5))",
                    }}
                >
                    <TypeWriter text={config.heroTitle} delay={900} />
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.2, duration: 1.5 }}
                    className="text-lg sm:text-xl md:text-2xl max-w-xl leading-relaxed mb-12"
                    style={{ fontFamily: "'Dancing Script', cursive", color: "rgba(255,200,230,0.8)", textShadow: "0 0 20px rgba(255,20,147,0.3)" }}
                >
                    {config.heroSubtitle}
                </motion.p>

                {/* Scroll hint */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4.2, duration: 1 }}>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        style={{ color: "rgba(255,180,210,0.4)", fontSize: "0.75rem", letterSpacing: "4px", textTransform: "uppercase" }}
                    >
                        ↓ &nbsp; scroll &nbsp; ↓
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
