import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "../../../ConfigContext";
import { Play, Pause, Music2 } from "lucide-react";

function WaveBars({ playing }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "20px" }}>
            {[0.6, 1, 0.8, 0.4, 0.9, 0.7, 0.5].map((h, i) => (
                <motion.div
                    key={i}
                    animate={playing
                        ? { scaleY: [h, 1, 0.3, 0.9, h], opacity: [0.7, 1, 0.5, 0.9, 0.7] }
                        : { scaleY: 0.2, opacity: 0.3 }
                    }
                    transition={playing
                        ? { duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }
                        : { duration: 0.3 }
                    }
                    style={{
                        width: "3px",
                        height: "18px",
                        borderRadius: "2px",
                        background: "#fff",
                        transformOrigin: "center",
                        display: "block",
                    }}
                />
            ))}
        </div>
    );
}

export default function MusicPlayer() {
    const config = useConfig();
    const [playing, setPlaying] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const audioRef = useRef(null);

    if (!config.musicUrl) return null;

    const toggle = () => {
        if (!audioRef.current) return;
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setPlaying(!playing);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.5, duration: 0.5, type: "spring" }}
            style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 500 }}
        >
            <audio ref={audioRef} src={config.musicUrl} loop />

            <AnimatePresence mode="wait">
                {expanded ? (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        style={{
                            background: "rgba(15,0,20,0.92)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "20px",
                            border: "1px solid rgba(255,100,150,0.25)",
                            boxShadow: "0 0 40px rgba(255,20,147,0.2)",
                            padding: "16px 20px",
                            display: "flex", flexDirection: "column", gap: "12px",
                            minWidth: "200px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <Music2 size={14} color="rgba(255,150,180,0.7)" />
                                <span style={{
                                    color: "rgba(255,180,210,0.8)", fontSize: "0.78rem",
                                    fontFamily: "'Poppins', sans-serif", letterSpacing: "0.5px",
                                }}>
                                    Background Music
                                </span>
                            </div>
                            <button
                                onClick={() => setExpanded(false)}
                                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "1rem", lineHeight: 1, padding: "2px 4px" }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                            <motion.button
                                whileHover={{ scale: 1.08 }}
                                whileTap={{ scale: 0.94 }}
                                onClick={toggle}
                                style={{
                                    width: "40px", height: "40px", borderRadius: "50%",
                                    background: "linear-gradient(135deg, #ff1493, #c71585)",
                                    border: "none", cursor: "pointer", color: "#fff",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: playing ? "0 0 20px rgba(255,20,147,0.6)" : "none",
                                    flexShrink: 0,
                                }}
                            >
                                {playing ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" />}
                            </motion.button>
                            <WaveBars playing={playing} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        key="collapsed"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setExpanded(true)}
                        style={{
                            width: "52px", height: "52px", borderRadius: "50%",
                            background: "linear-gradient(135deg, #ff1493, #c71585)",
                            border: "none", cursor: "pointer", color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: playing
                                ? "0 0 0 3px rgba(255,20,147,0.2), 0 0 30px rgba(255,20,147,0.5)"
                                : "0 4px 20px rgba(255,20,147,0.4)",
                        }}
                    >
                        {playing ? (
                            <motion.span
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                style={{ fontSize: "1.2rem" }}
                            >
                                🎵
                            </motion.span>
                        ) : (
                            <Music2 size={20} />
                        )}
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
