import { useScroll, useSpring, motion } from 'framer-motion';

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '3px',
                background: 'linear-gradient(90deg, #c71585, #ff1493, #ff69b4, #ff1493, #c71585)',
                transformOrigin: '0%', scaleX, zIndex: 999,
                boxShadow: '0 0 14px rgba(255,20,147,0.9), 0 0 4px rgba(255,100,180,1)',
            }}
        />
    );
}
