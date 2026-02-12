import { useEffect, useRef } from "react";

// ── Hearts burst at every click/tap on the page ─────────────────────────────
export default function ClickEffect() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const EMOJIS = ["❤️", "💕", "💖", "💗", "🌹", "✨", "💘", "💝"];

        const burst = (x, y) => {
            const count = 6 + Math.floor(Math.random() * 5);
            for (let i = 0; i < count; i++) {
                const el = document.createElement("div");
                el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

                const angle   = (360 / count) * i + (Math.random() * 30 - 15);
                const dist    = 40 + Math.random() * 60;
                const size    = 16 + Math.random() * 16;
                const duration = 600 + Math.random() * 500;

                const rad = (angle * Math.PI) / 180;
                const tx  = Math.cos(rad) * dist;
                const ty  = Math.sin(rad) * dist - 20;

                Object.assign(el.style, {
                    position: "fixed",
                    left: `${x - size / 2}px`,
                    top:  `${y - size / 2}px`,
                    fontSize: `${size}px`,
                    pointerEvents: "none",
                    zIndex: "9999",
                    userSelect: "none",
                    transition: `transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${duration}ms ease`,
                    willChange: "transform, opacity",
                });

                container.appendChild(el);

                // Force reflow then animate
                void el.offsetWidth;
                el.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                el.style.opacity = "0";

                setTimeout(() => el.remove(), duration + 50);
            }
        };

        const onClick = e => burst(e.clientX, e.clientY);
        const onTouch = e => {
            const t = e.touches[0];
            if (t) burst(t.clientX, t.clientY);
        };

        window.addEventListener("click", onClick);
        window.addEventListener("touchstart", onTouch, { passive: true });
        return () => {
            window.removeEventListener("click", onClick);
            window.removeEventListener("touchstart", onTouch);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}
        />
    );
}
