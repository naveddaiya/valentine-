import { motion } from "framer-motion";
import { useConfig } from "../../../ConfigContext";

function PhotoCard({ photo, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: index % 2 === 0 ? -3 : 3 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 === 0 ? -2 : 2 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      className="relative group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-pink-500/20 border-2 border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        <img
          src={photo.url}
          alt={photo.caption}
          className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <p className="text-white text-sm sm:text-base font-medium" style={{ fontFamily: "'Dancing Script', cursive" }}>
            {photo.caption}
          </p>
        </div>
      </div>
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}

export default function PhotoGallery() {
  const config = useConfig();
  if (!config.photos || config.photos.length === 0) return null;

  return (
    <section className="py-20 px-6 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-5xl text-center mb-16 bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent py-2 leading-[1.5]"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        Our Beautiful Moments
      </motion.h2>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        {config.photos.map((photo, i) => (
          <PhotoCard key={i} photo={photo} index={i} />
        ))}
      </div>
    </section>
  );
}
