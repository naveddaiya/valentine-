import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { useConfig } from "../../../ConfigContext";

export default function LoveQuiz() {
  const config = useConfig();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);

  const questions = config.quizQuestions;
  if (!questions || questions.length === 0) return null;

  const handleAnswer = (optionIndex) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const isCorrect = optionIndex === questions[current].correct;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setFinished(true);
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ec4899", "#f43f5e", "#fff"],
        });
      }
    }, 1200);
  };

  return (
    <section className="py-20 px-6 relative z-10">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-5xl text-center mb-4 bg-gradient-to-r from-violet-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent leading-[1.5]"
        style={{ fontFamily: "'Great Vibes', cursive" }}
      >
        How Well Do You Know Us?
      </motion.h2>
      <p className="text-center text-pink-300/40 mb-12 text-sm uppercase tracking-widest">
        A little love quiz
      </p>

      <div className="max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/10"
            >
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-pink-300/50 text-xs uppercase tracking-widest">
                  Question {current + 1} of {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i <= current ? "bg-pink-400" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3
                className="text-xl sm:text-2xl text-white/90 mb-8"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {questions[current].question}
              </h3>

              <div className="space-y-3">
                {questions[current].options.map((opt, i) => {
                  let btnClass =
                    "w-full text-left px-6 py-4 rounded-2xl border transition-all duration-300 cursor-pointer ";
                  if (selected === null) {
                    btnClass +=
                      "bg-white/5 border-white/10 hover:bg-white/10 hover:border-pink-500/30 text-pink-100/80";
                  } else if (i === questions[current].correct) {
                    btnClass +=
                      "bg-emerald-500/20 border-emerald-400/50 text-emerald-200";
                  } else if (i === selected) {
                    btnClass +=
                      "bg-red-500/20 border-red-400/50 text-red-200";
                  } else {
                    btnClass +=
                      "bg-white/5 border-white/10 text-pink-100/40";
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={selected === null ? { scale: 1.02 } : {}}
                      whileTap={selected === null ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(i)}
                      className={btnClass}
                      style={{ fontFamily: "'Dancing Script', cursive" }}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-10 border border-white/10 text-center"
            >
              <div className="text-6xl mb-6">
                {score === questions.length ? "💯" : score >= questions.length / 2 ? "💕" : "🤗"}
              </div>
              <h3
                className="text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent leading-[1.5]"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                {score === questions.length
                  ? "Perfect Score! True Soulmates!"
                  : score >= questions.length / 2
                  ? "You know us so well!"
                  : "Getting to know us better!"}
              </h3>
              <p className="text-pink-200/60 text-lg">
                You got{" "}
                <span className="text-pink-300 font-bold">
                  {score}/{questions.length}
                </span>{" "}
                correct
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
