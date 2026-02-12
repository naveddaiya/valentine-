import { motion } from 'framer-motion';

export default function SectionDivider() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '8px 24px', gap: '14px',
        }}>
            <div style={{
                flex: 1, maxWidth: '180px', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255,100,150,0.3))',
            }} />
            <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '1rem', lineHeight: 1 }}
            >
                🌹
            </motion.div>
            <div style={{
                flex: 1, maxWidth: '180px', height: '1px',
                background: 'linear-gradient(90deg, rgba(255,100,150,0.3), transparent)',
            }} />
        </div>
    );
}
