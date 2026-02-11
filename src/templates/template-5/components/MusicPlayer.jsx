import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useConfig } from "../../../ConfigContext";

export default function MusicPlayer() {
  const config = useConfig();
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  if (!config.musicUrl) return null;

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setPlaying(!playing);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <audio ref={audioRef} src={config.musicUrl} loop />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggle}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white text-xl shadow-2xl shadow-pink-500/40 flex items-center justify-center border-0 cursor-pointer"
      >
        {playing ? (
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
            🎵
          </motion.span>
        ) : "🎵"}
      </motion.button>
    </motion.div>
  );
}
