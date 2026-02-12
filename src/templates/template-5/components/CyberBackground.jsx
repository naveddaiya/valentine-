import { useEffect, useRef } from "react";

/**
 * CyberBackground — high-performance vaporwave canvas
 * ─────────────────────────────────────────────────────
 * Key perf choices:
 *  • NO ctx.shadowBlur  — shadow is CPU-only, kills frame rate. Glow is faked
 *    using two concentric transparent circles per particle instead.
 *  • 30 fps cap         — halves GPU/CPU workload vs 60 fps.
 *  • Tab-visibility     — pauses animation when browser tab is hidden.
 *  • will-change on canvas — browser promotes canvas to its own GPU layer.
 *  • Reduced particles  — 40 instead of 70.
 */
export default function CyberBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        let t          = 0;
        let lastTime   = 0;
        const TARGET_FPS = 30;
        const INTERVAL   = 1000 / TARGET_FPS;

        function resize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        // ── Particles ────────────────────────────────────────────────────────
        const makeParticle = () => ({
            x:     Math.random() * window.innerWidth,
            y:     Math.random() * window.innerHeight,
            vx:    (Math.random() - 0.5) * 0.3,
            vy:    -0.12 - Math.random() * 0.3,
            r:     1 + Math.random() * 2,
            alpha: 0.1 + Math.random() * 0.3,
            hue:   Math.random() > 0.6 ? 270 + Math.random() * 40 : 315 + Math.random() * 30,
            phase: Math.random() * Math.PI * 2,
        });
        const particles = Array.from({ length: 40 }, makeParticle);

        // ── Vaporwave perspective grid ────────────────────────────────────────
        function drawGrid() {
            const w       = canvas.width;
            const h       = canvas.height;
            const horizon = h * 0.66;
            const H_LINES = 16;
            const scroll  = (t * 18) % ((h - horizon) / H_LINES);

            // Horizontal lines
            for (let i = 0; i <= H_LINES; i++) {
                let y = horizon + scroll + (i * (h - horizon)) / H_LINES;
                if (y > h) y -= (h - horizon);
                if (y <= horizon) continue;
                const fade = (y - horizon) / (h - horizon);
                ctx.strokeStyle = `rgba(255,0,128,${fade * 0.15})`;
                ctx.lineWidth   = fade * 1.3;
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
            }

            // Vertical converging lines
            const vpX    = w / 2;
            const spread = w * 0.88;
            const V_LINES = 20;
            for (let i = 0; i <= V_LINES; i++) {
                const xB   = (w / 2) - spread / 2 + (spread * i) / V_LINES;
                const dist = Math.abs(i - V_LINES / 2) / (V_LINES / 2);
                ctx.strokeStyle = `rgba(180,0,240,${0.065 + dist * 0.035})`;
                ctx.lineWidth   = 0.7;
                ctx.beginPath();
                ctx.moveTo(vpX + (xB - vpX) * 0.04, horizon);
                ctx.lineTo(xB, h);
                ctx.stroke();
            }
        }

        // ── Ambient glow orbs — radial gradients ─────────────────────────────
        function drawOrbs() {
            const w = canvas.width;
            const h = canvas.height;
            const orbs = [
                { cx: w * 0.18, cy: h * 0.28, r: Math.min(w, h) * 0.28, a: 0.05,  hue: 330 },
                { cx: w * 0.82, cy: h * 0.22, r: Math.min(w, h) * 0.22, a: 0.042, hue: 270 },
                { cx: w * 0.50, cy: h * 0.78, r: Math.min(w, h) * 0.30, a: 0.035, hue: 315 },
            ];
            orbs.forEach((o, i) => {
                const pulse = 0.75 + 0.25 * Math.sin(t * 0.9 + i * 2.1);
                const g = ctx.createRadialGradient(o.cx, o.cy, 0, o.cx, o.cy, o.r * pulse);
                g.addColorStop(0, `hsla(${o.hue},100%,55%,${o.a * pulse})`);
                g.addColorStop(1, "transparent");
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(o.cx, o.cy, o.r * pulse, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // ── Main draw loop (30 fps cap) ───────────────────────────────────────
        function draw(timestamp) {
            animId = requestAnimationFrame(draw);
            if (document.hidden) return;                     // pause when tab hidden

            const elapsed = timestamp - lastTime;
            if (elapsed < INTERVAL) return;                  // skip frame if too early
            lastTime = timestamp - (elapsed % INTERVAL);

            t += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawOrbs();
            drawGrid();

            // Particles — glow via two layered circles (no shadowBlur)
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -8)                 { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
                if (p.x < -8)                 p.x = canvas.width  + 8;
                if (p.x > canvas.width  + 8)  p.x = -8;

                const glow = 0.65 + 0.35 * Math.sin(t * 2.4 + p.phase);
                const col  = `hsl(${p.hue},100%,72%)`;

                ctx.save();
                // Outer soft glow ring (large radius, low alpha)
                ctx.globalAlpha = p.alpha * glow * 0.25;
                ctx.fillStyle   = col;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
                ctx.fill();
                // Core bright dot
                ctx.globalAlpha = p.alpha * glow;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }

        draw(0);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed", inset: 0,
                    width: "100%", height: "100%",
                    pointerEvents: "none", zIndex: 0,
                    willChange: "transform",       // own GPU compositing layer
                }}
            />
            {/* Subtle scanlines — pure CSS, zero JS cost */}
            <div
                style={{
                    position: "fixed", inset: 0, zIndex: 1,
                    pointerEvents: "none",
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.018) 3px, rgba(0,0,0,0.018) 4px)",
                }}
            />
        </>
    );
}
