import { useEffect, useState } from "react";

const HEART_CHARS = ["❤️", "💕", "💖", "💗", "💘", "💝", "🌹", "✨"];

function Heart({ style }) {
  return (
    <div
      className="fixed pointer-events-none text-2xl animate-float select-none"
      style={style}
    >
      {HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)]}
    </div>
  );
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const heart = {
        id,
        style: {
          left: `${Math.random() * 100}vw`,
          top: `-5%`,
          fontSize: `${Math.random() * 20 + 14}px`,
          opacity: Math.random() * 0.5 + 0.3,
          animationDuration: `${Math.random() * 4 + 6}s`,
          animationDelay: `${Math.random() * 2}s`,
        },
      };
      setHearts((prev) => [...prev.slice(-25), heart]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((h) => (
        <Heart key={h.id} style={h.style} />
      ))}
    </div>
  );
}
