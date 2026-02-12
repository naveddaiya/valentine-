import { useEffect, useRef } from "react";

/**
 * CyberBackground
 * ────────────────
 * Canvas-based animated background with:
 *  - Vaporwave perspective grid (scrolling horizontal + converging vertical lines)
 *  - Soft radial ambient glow orbs (pink / purple)
 *  - Drifting neon micro-particles
 *  - Subtle scanline overlay via CSS
 */
export default function CyberBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;
        let t = 0;

        function resize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        // Floating neon particles
        const makeParticle = () => ({
            x:     Math.random() * window.innerWidth,
            y:     Math.random() * window.innerHeight,
            vx:    (Math.random() - 0.5) * 0.35,
            vy:    -0.15 - Math.random() * 0.35,
            r:     0.8 + Math.random() * 2.2,
            alpha: 0.08 + Math.random() * 0.32,
            hue:   Math.random() > 0.65 ? 270 + Math.random() * 40 : 320 + Math.random() * 30,
            phase: Math.random() * Math.PI * 2,
        });
        const particles = Array.from({ length: 70 }, makeParticle);

        // ── Vaporwave perspective grid ──────────────────────────────────────────
        function drawGrid() {
            const w        = canvas.width;
            const h        = canvas.height;
            const horizon  = h * 0.66;
            const H_LINES  = 18;
            const scroll   = (t * 22) % ((h - horizon) / H_LINES);

            ctx.save();

            // Horizontal lines (appear to scroll towards viewer)
            for (let i = 0; i <= H_LINES; i++) {
                let y = horizon + scroll + (i * (h - horizon)) / H_LINES;
                if (y > h) y -= (h - horizon);
                if (y <= horizon) continue;
                const fade = ((y - horizon) / (h - horizon));
                ctx.strokeStyle = `rgba(255,0,128,${fade * 0.16})`;
                ctx.lineWidth   = fade * 1.4;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Vertical lines converging at vanishing point
            const vpX    = w / 2;
            const spread = w * 0.88;
            const V_LINES = 22;
            for (let i = 0; i <= V_LINES; i++) {
                const xBottom = (w / 2) - spread / 2 + (spread * i) / V_LINES;
                const dist    = Math.abs(i - V_LINES / 2) / (V_LINES / 2);
                ctx.strokeStyle = `rgba(190,0,255,${0.07 + dist * 0.04})`;
                ctx.lineWidth   = 0.7;
                ctx.beginPath();
                ctx.moveTo(vpX + (xBottom - vpX) * 0.04, horizon);
                ctx.lineTo(xBottom, h);
                ctx.stroke();
            }

            ctx.restore();
        }

        // ── Ambient glow orbs ───────────────────────────────────────────────────
        function drawOrbs() {
            const w = canvas.width;
            const h = canvas.height;
            const orbs = [
                { cx: w * 0.18, cy: h * 0.28, r: Math.min(w, h) * 0.28, a: 0.055, hue: 330 },
                { cx: w * 0.82, cy: h * 0.22, r: Math.min(w, h) * 0.22, a: 0.045, hue: 270 },
                { cx: w * 0.5,  cy: h * 0.78, r: Math.min(w, h) * 0.32, a: 0.038, hue: 315 },
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

        // ── Main draw loop ──────────────────────────────────────────────────────
        function draw() {
            t += 0.005;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawOrbs();
            drawGrid();

            // Particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.y < -8)                   { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
                if (p.x < -8)                   p.x = canvas.width  + 8;
                if (p.x > canvas.width  + 8)    p.x = -8;

                const glow = 0.65 + 0.35 * Math.sin(t * 2.4 + p.phase);
                ctx.save();
                ctx.globalAlpha = p.alpha * glow;
                ctx.fillStyle   = `hsl(${p.hue},100%,72%)`;
                ctx.shadowBlur  = 12;
                ctx.shadowColor = `hsl(${p.hue},100%,72%)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            animId = requestAnimationFrame(draw);
        }

        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <>
            {/* Canvas layer */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed", inset: 0,
                    width: "100%", height: "100%",
                    pointerEvents: "none", zIndex: 0,
                }}
            />
            {/* Scanlines overlay — very subtle */}
            <div
                style={{
                    position: "fixed", inset: 0, zIndex: 1,
                    pointerEvents: "none",
                    backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.022) 3px, rgba(0,0,0,0.022) 4px)",
                }}
            />
        </>
    );
}
