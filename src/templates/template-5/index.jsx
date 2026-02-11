import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useConfig } from "../../ConfigContext";
import PasswordGate from "./components/PasswordGate";
import FloatingHearts from "./components/FloatingHearts";
import VideoHero from "./components/VideoHero";
import Timeline from "./components/Timeline";
import PhotoGallery from "./components/PhotoGallery";
import LoveLetter from "./components/LoveLetter";
import LoveQuiz from "./components/LoveQuiz";
import ReasonsSection from "./components/ReasonsSection";
import CountdownTimer from "./components/CountdownTimer";
import ProposalButton from "./components/ProposalButton";
import MusicPlayer from "./components/MusicPlayer";
import Footer from "./components/Footer";
import '@fontsource/dancing-script/400.css';
import '@fontsource/great-vibes/400.css';

export default function Template5() {
  const config = useConfig();
  const [unlocked, setUnlocked] = useState(!config.password);

  return (
    <>
      {/* Password gate overlay */}
      <AnimatePresence>
        {!unlocked && (
          <PasswordGate onUnlock={() => setUnlocked(true)} />
        )}
      </AnimatePresence>

      {/* Main content */}
      <FloatingHearts />
      <MusicPlayer />

      <main className="relative z-10">
        <VideoHero />

        <div className="section-divider" />
        <Timeline />

        <div className="section-divider" />
        <PhotoGallery />

        <div className="section-divider" />
        <LoveLetter />

        <div className="section-divider" />
        <LoveQuiz />

        <div className="section-divider" />
        <ReasonsSection />

        <div className="section-divider" />
        <CountdownTimer />

        <div className="section-divider" />
        <ProposalButton />

        <Footer />
      </main>
    </>
  );
}
