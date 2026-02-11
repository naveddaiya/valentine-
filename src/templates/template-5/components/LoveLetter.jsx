import { motion } from "framer-motion";
import { useConfig } from "../../../ConfigContext";

export default function LoveLetter() {
  const config = useConfig();
  if (!config.loveLetter) return null;

  return (
    <section className="py-20 px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl">💌</div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl shadow-pink-500/10">
            <div className="absolute top-4 left-4 text-pink-400/30 text-2xl">❦</div>
            <div className="absolute top-4 right-4 text-pink-400/30 text-2xl">❦</div>

            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl sm:text-4xl text-center mb-8 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent py-2 leading-[1.5]"
              style={{ fontFamily: "'Great Vibes', cursive" }}
            >
              A Letter For You
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              {config.loveLetter.split("\n").map((line, i) => (
                <p
                  key={i}
                  className="text-pink-100/80 text-base sm:text-lg leading-relaxed mb-4"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {line || <br />}
                </p>
              ))}
            </motion.div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-pink-400/30 text-2xl">❦</div>
          </div>

          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-red-500/10 rounded-3xl blur-2xl -z-10" />
        </div>
      </motion.div>
    </section>
  );
}
