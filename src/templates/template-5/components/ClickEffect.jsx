import { useEffect, useRef } from "react";

const EMOJIS = ["❤️", "💕", "💖", "💗", "🌹", "✨", "💘", "💝", "🔮", "⚡"];

// ── Web Audio: soft ascending "heart pop" tone ───────────────────────────────
function playHeartSound(audioCtxRef) {
    try {
        if (!audioCtxRef.current) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            audioCtxRef.current = new Ctx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") ctx.resume();

        // Two oscillators for a richer "pluck" sound
        const osc1  = ctx.createOscillator();
        const osc2  = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.connect(gain1); gain1.connect(ctx.destination);
        osc2.connect(gain2); gain2.connect(ctx.destination);

        // Main tone: descending pitch
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(880, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.18);
        gain1.gain.setValueAtTime(0.07, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

        // Soft harmonic layer
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(1320, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
        gain2.gain.setValueAtTime(0.03, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

        osc1.start(ctx.currentTime); osc1.stop(ctx.currentTime + 0.3);
        osc2.start(ctx.currentTime); osc2.stop(ctx.currentTime + 0.25);
    } catch {
        // AudioContext blocked or unsupported — silently skip
    }
}

// ── Hearts burst at every click / tap ────────────────────────────────────────
export default function ClickEffect() {
    const containerRef = useRef(null);
    const audioCtxRef  = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        const burst = (x, y) => {
            playHeartSound(audioCtxRef);

            const count    = 6 + Math.floor(Math.random() * 5);
            for (let i = 0; i < count; i++) {
                const el       = document.createElement("div");
                el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

                const angle    = (360 / count) * i + (Math.random() * 30 - 15);
                const dist     = 42 + Math.random() * 65;
                const size     = 15 + Math.random() * 18;
                const duration = 580 + Math.random() * 520;

                const rad = (angle * Math.PI) / 180;
                const tx  = Math.cos(rad) * dist;
                const ty  = Math.sin(rad) * dist - 22;

                Object.assign(el.style, {
                    position:      "fixed",
                    left:          `${x - size / 2}px`,
                    top:           `${y - size / 2}px`,
                    fontSize:      `${size}px`,
                    pointerEvents: "none",
                    zIndex:        "9999",
                    userSelect:    "none",
                    transition:    `transform ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${duration}ms ease`,
                    willChange:    "transform, opacity",
                });

                container.appendChild(el);
                void el.offsetWidth;                       // force reflow
                el.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
                el.style.opacity   = "0";
                setTimeout(() => el.remove(), duration + 60);
            }
        };

        const onClick  = e => burst(e.clientX, e.clientY);
        const onTouch  = e => {
            const t = e.touches[0];
            if (t) burst(t.clientX, t.clientY);
        };

        window.addEventListener("click",       onClick);
        window.addEventListener("touchstart",  onTouch, { passive: true });
        return () => {
            window.removeEventListener("click",      onClick);
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
