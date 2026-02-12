import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useConfig } from "../../ConfigContext";
import PasswordGate    from "./components/PasswordGate";
import ClickEffect     from "./components/ClickEffect";
import CyberBackground from "./components/CyberBackground";
import ScrollProgress  from "./components/ScrollProgress";
import SectionDivider  from "./components/SectionDivider";
import VideoHero       from "./components/VideoHero";
import Timeline        from "./components/Timeline";
import PhotoGallery    from "./components/PhotoGallery";
import LoveLetter      from "./components/LoveLetter";
import LoveQuiz        from "./components/LoveQuiz";
import ReasonsSection  from "./components/ReasonsSection";
import CountdownTimer  from "./components/CountdownTimer";
import ProposalButton  from "./components/ProposalButton";
import MusicPlayer     from "./components/MusicPlayer";
import Footer          from "./components/Footer";
import '@fontsource/dancing-script/400.css';
import '@fontsource/great-vibes/400.css';

export default function Template5() {
    const config   = useConfig();
    const [unlocked, setUnlocked] = useState(!config.password);

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(160deg, #050010 0%, #0d0020 30%, #0a0015 60%, #050010 100%)",
            color: "#fff",
            overflowX: "hidden",
        }}>
            {/* Pink scroll-progress bar */}
            <ScrollProgress />

            {/* Vaporwave canvas background */}
            <CyberBackground />

            {/* Password gate overlay */}
            <AnimatePresence>
                {!unlocked && <PasswordGate onUnlock={() => setUnlocked(true)} />}
            </AnimatePresence>

            {/* Click-anywhere heart burst + sound */}
            <ClickEffect />

            {/* Optional music player */}
            <MusicPlayer />

            <main className="relative z-10">
                <VideoHero />

                <SectionDivider />
                <Timeline />

                <SectionDivider />
                <PhotoGallery />

                <SectionDivider />
                <LoveLetter />

                <SectionDivider />
                <ReasonsSection />

                <SectionDivider />
                <LoveQuiz />

                <SectionDivider />
                <CountdownTimer />

                <SectionDivider />
                <ProposalButton />

                <Footer />
            </main>
        </div>
    );
}
