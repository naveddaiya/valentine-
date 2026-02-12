import { useEffect, useState } from "react";

const SYMBOLS = ["❤️", "💕", "💖", "💗", "💘", "💝", "🌹", "🌸", "✨", "💫", "🎀", "💋"];

function Particle({ style, symbol }) {
    return (
        <div className="fixed pointer-events-none select-none animate-float" style={style}>
            {symbol}
        </div>
    );
}

export default function FloatingHearts() {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Initial burst
        const seed = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            symbol: SYMBOLS[i % SYMBOLS.length],
            style: {
                left:              `${Math.random() * 100}vw`,
                top:               `-${Math.random() * 10 + 2}%`,
                fontSize:          `${Math.random() * 22 + 12}px`,
                opacity:           Math.random() * 0.35 + 0.15,
                animationDuration: `${Math.random() * 6 + 7}s`,
                animationDelay:    `${Math.random() * 8}s`,
                filter:            Math.random() > 0.7 ? 'blur(0.5px)' : 'none',
            },
        }));
        setParticles(seed);

        const interval = setInterval(() => {
            const id     = Date.now() + Math.random();
            const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            setParticles(prev => [...prev.slice(-40), {
                id,
                symbol,
                style: {
                    left:              `${Math.random() * 100}vw`,
                    top:               `-5%`,
                    fontSize:          `${Math.random() * 24 + 10}px`,
                    opacity:           Math.random() * 0.4 + 0.1,
                    animationDuration: `${Math.random() * 5 + 6}s`,
                    animationDelay:    `0s`,
                    filter:            Math.random() > 0.75 ? 'blur(0.8px)' : 'none',
                },
            }]);
        }, 280);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map(p => (
                <Particle key={p.id} style={p.style} symbol={p.symbol} />
            ))}
        </div>
    );
}
