import { motion } from "framer-motion";
import { useConfig } from "../../../ConfigContext";

export default function Timeline() {
  const config = useConfig();
  if (!config.timeline || config.timeline.length === 0) return null;

  return (
    <section className="py-20 px-6 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-5xl text-center mb-16 bg-gradient-to-r from-violet-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent leading-[1.5]"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Our Love Story
      </motion.h2>

      <div className="max-w-3xl mx-auto relative">
        {/* Vertical line */}
        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-pink-500/50 via-violet-500/50 to-pink-500/50" />

        {config.timeline.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className={`relative flex items-start mb-12 ${
                isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
              } flex-row`}
            >
              {/* Dot on the line */}
              <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 border-2 border-white/20 shadow-lg shadow-pink-500/30 z-10" />

              {/* Content card */}
              <div
                className={`ml-14 sm:ml-0 sm:w-[calc(50%-30px)] ${
                  isLeft ? "sm:pr-8 sm:text-right" : "sm:pl-8 sm:text-left"
                }`}
              >
                <span className="text-xs uppercase tracking-widest text-pink-400/60 font-mono">
                  {event.date}
                </span>
                <h3
                  className="text-xl sm:text-2xl text-white/90 mt-1 mb-2"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  {event.title}
                </h3>
                <p className="text-pink-100/50 text-sm leading-relaxed">
                  {event.description}
                </p>
                {event.emoji && (
                  <div className="text-2xl mt-2">{event.emoji}</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
