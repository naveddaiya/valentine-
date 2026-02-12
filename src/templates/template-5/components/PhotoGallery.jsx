import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useConfig } from "../../../ConfigContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ photos, activeIndex, onClose }) {
    const [current, setCurrent] = useState(activeIndex);
    const total = photos.length;

    const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);
    const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);

    useEffect(() => {
        const handleKey = e => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft")  prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose, prev, next]);

    return (
        <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 2000,
                background: "rgba(0,0,0,0.96)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(8px)",
            }}
        >
            {/* Close */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute", top: "20px", right: "20px",
                    background: "rgba(255,255,255,0.1)", border: "none",
                    borderRadius: "50%", width: "44px", height: "44px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#fff", zIndex: 10,
                    backdropFilter: "blur(8px)",
                    transition: "background 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            >
                <X size={20} />
            </button>

            {/* Counter */}
            <div style={{
                position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)",
                color: "rgba(255,255,255,0.5)", fontSize: "0.85rem",
                fontFamily: "'Poppins', sans-serif", letterSpacing: "2px",
            }}>
                {current + 1} / {total}
            </div>

            {/* Prev */}
            {total > 1 && (
                <button
                    onClick={e => { e.stopPropagation(); prev(); }}
                    style={{
                        position: "absolute", left: "16px",
                        background: "rgba(255,255,255,0.08)", border: "none",
                        borderRadius: "50%", width: "48px", height: "48px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#fff", zIndex: 10,
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* Next */}
            {total > 1 && (
                <button
                    onClick={e => { e.stopPropagation(); next(); }}
                    style={{
                        position: "absolute", right: "16px",
                        background: "rgba(255,255,255,0.08)", border: "none",
                        borderRadius: "50%", width: "48px", height: "48px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", color: "#fff", zIndex: 10,
                        transition: "background 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                >
                    <ChevronRight size={24} />
                </button>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={e => e.stopPropagation()}
                    style={{ maxWidth: "90vw", maxHeight: "80vh", position: "relative" }}
                >
                    <img
                        src={photos[current].url}
                        alt={photos[current].caption}
                        style={{
                            maxWidth: "90vw", maxHeight: "75vh",
                            objectFit: "contain", borderRadius: "12px",
                            boxShadow: "0 0 80px rgba(255,20,147,0.2)",
                        }}
                    />
                    {photos[current].caption && (
                        <div style={{
                            textAlign: "center", marginTop: "12px",
                            color: "rgba(255,200,220,0.8)",
                            fontFamily: "'Dancing Script', cursive", fontSize: "1.1rem",
                        }}>
                            {photos[current].caption}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Dot nav */}
            {total > 1 && (
                <div style={{
                    position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)",
                    display: "flex", gap: "8px",
                }}>
                    {photos.map((_, i) => (
                        <button
                            key={i}
                            onClick={e => { e.stopPropagation(); setCurrent(i); }}
                            style={{
                                width: i === current ? "24px" : "8px",
                                height: "8px", borderRadius: "4px",
                                background: i === current ? "#ff1493" : "rgba(255,255,255,0.3)",
                                border: "none", cursor: "pointer",
                                transition: "all 0.3s",
                                padding: 0,
                            }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// ─── Photo Card ───────────────────────────────────────────────────────────────
function PhotoCard({ photo, index, onOpen }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 60, rotate: index % 2 === 0 ? -2 : 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -1 : 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: index * 0.12 }}
            whileHover={{ scale: 1.04, rotate: 0, zIndex: 10 }}
            onClick={() => onOpen(index)}
            style={{ position: "relative", cursor: "zoom-in" }}
        >
            <div style={{
                position: "relative", overflow: "hidden",
                borderRadius: "18px",
                boxShadow: "0 8px 40px rgba(255,20,147,0.15), 0 2px 8px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,100,150,0.15)",
            }}>
                <div style={{
                    position: "absolute", inset: 0, zIndex: 1,
                    background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                }} />
                <img
                    src={photo.url}
                    alt={photo.caption}
                    style={{
                        width: "100%", height: "260px", objectFit: "cover",
                        display: "block", transition: "transform 0.7s ease",
                    }}
                    loading="lazy"
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    padding: "12px 16px", zIndex: 2,
                }}>
                    <p style={{
                        color: "rgba(255,255,255,0.9)", fontSize: "0.95rem",
                        fontFamily: "'Dancing Script', cursive", margin: 0,
                    }}>
                        {photo.caption}
                    </p>
                </div>
                {/* Zoom hint */}
                <div style={{
                    position: "absolute", top: "12px", right: "12px", zIndex: 2,
                    background: "rgba(0,0,0,0.4)", borderRadius: "6px",
                    padding: "3px 7px", fontSize: "0.7rem",
                    color: "rgba(255,255,255,0.6)", fontFamily: "'Poppins', sans-serif",
                    backdropFilter: "blur(4px)",
                }}>
                    tap to expand
                </div>
            </div>
            {/* Glow on hover */}
            <div style={{
                position: "absolute", inset: "-4px",
                background: "linear-gradient(135deg, rgba(255,20,147,0.15), rgba(199,21,133,0.1))",
                borderRadius: "22px", filter: "blur(16px)", zIndex: -1,
                opacity: 0, transition: "opacity 0.4s",
            }}
                onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                onMouseLeave={e => e.currentTarget.style.opacity = "0"}
            />
        </motion.div>
    );
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
export default function PhotoGallery() {
    const config = useConfig();
    const [lightboxIndex, setLightboxIndex] = useState(null);

    if (!config.photos || config.photos.length === 0) return null;

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
                Our Beautiful Moments
            </motion.h2>
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-center text-pink-300/40 mb-12 text-xs uppercase tracking-widest"
            >
                {config.photos.length} memories · tap to view full screen
            </motion.p>

            <div style={{
                maxWidth: "900px", margin: "0 auto",
                display: "grid",
                gridTemplateColumns: config.photos.length === 1 ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
            }}>
                {config.photos.map((photo, i) => (
                    <PhotoCard
                        key={i} photo={photo} index={i}
                        onOpen={idx => setLightboxIndex(idx)}
                    />
                ))}
            </div>

            <AnimatePresence>
                {lightboxIndex !== null && (
                    <Lightbox
                        photos={config.photos}
                        activeIndex={lightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}
