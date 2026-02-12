import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { ConfigContext } from '../ConfigContext';
import { TemplateRenderer } from '../templates/index.js';
import { PRICE } from '../config';
import '@fontsource/dancing-script/400.css';

// Sample couple data — this is what users will see as a demo
const SAMPLE_CONFIG = {
    senderName:      'Arjun',
    receiverName:    'Priya',
    password:        null,
    passwordHint:    null,
    videoUrl:        null,
    heroTitle:       'For Priya',
    heroSubtitle:    'A special Valentine surprise from Arjun, made with every bit of love',
    loveLetter:
        "My dearest Priya,\n\nSome people spend their whole lives searching for something real — and I found it the moment I found you.\n\nYou make every ordinary moment feel like a scene from a movie I never want to end. The way you laugh, the way you care, the way you look at me like I'm someone worth loving — it changes me every single day.\n\nThis Valentine's Day, I just want you to know: you are the greatest adventure I have ever chosen.\n\nForever yours,\nArjun 💕",
    photos: [
        { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80', caption: 'Our first road trip 🚗' },
        { url: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&q=80', caption: 'That rainy evening ☔' },
        { url: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&q=80', caption: 'Your favourite café ☕' },
    ],
    timeline: [
        { date: 'March 2022',    emoji: '✨', title: 'The Day We Met',    description: 'I knew from that very first conversation that you were someone extraordinary.' },
        { date: 'June 2022',     emoji: '☕', title: 'Our First Date',    description: 'That little café, those 3 hours that felt like 3 minutes. I was hooked.' },
        { date: 'February 2023', emoji: '🌹', title: 'Our First Valentine', description: 'You walked in wearing red and my heart forgot how to function.' },
        { date: 'Today',         emoji: '💍', title: 'Forever & Always',  description: 'Every single day I choose you all over again.' },
    ],
    quizQuestions: [],
    reasons: [
        "The way your eyes light up when you talk about something you love",
        "How you make every place we visit feel like home",
        "Your kindness — the way you care for everyone around you",
        "The way you hold my hand like you never want to let go",
        "How you make even the most ordinary Monday feel magical",
    ],
    countdownDate:    '2026-02-14T00:00:00',
    musicUrl:         null,
    yesText:          'Yes, always! 💕',
    noText:           'Let me think... 🤔',
    acceptedMessage:  'Our love story is just beginning... 🎉💕',
};

export default function PreviewPage() {
    const navigate = useNavigate();

    return (
        <div style={{ position: 'relative', minHeight: '100vh', background: '#06010a', overflowX: 'hidden' }}>
            {/* ── Top preview banner ─────────────────────────────────────────── */}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: 'linear-gradient(135deg, rgba(6,1,10,0.96) 0%, rgba(20,0,30,0.96) 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,100,150,0.25)',
                padding: '12px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '10px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent', border: 'none',
                            color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            fontSize: '0.85rem', padding: '4px 0',
                            fontFamily: "'Poppins', sans-serif",
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ff8fab'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
                    <span style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: '1rem',
                        color: 'rgba(255,150,180,0.7)',
                    }}>
                        👁 You're viewing a sample surprise page
                    </span>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/create')}
                    style={{
                        background: 'linear-gradient(135deg, #ff1493 0%, #c71585 100%)',
                        border: 'none', color: '#fff',
                        borderRadius: '100px', padding: '9px 24px',
                        fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                        boxShadow: '0 0 20px rgba(255,20,147,0.4)',
                        display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                >
                    <Heart size={15} fill="currentColor" />
                    Create Yours — ₹{PRICE}
                </motion.button>
            </div>

            {/* ── Template with sample data ─────────────────────────────────── */}
            <div style={{ paddingTop: '60px' }}>
                <ConfigContext.Provider value={SAMPLE_CONFIG}>
                    <TemplateRenderer templateId="template-5" />
                </ConfigContext.Provider>
            </div>

            {/* ── Sticky bottom CTA (mobile-friendly) ──────────────────────── */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 3, duration: 0.6, type: 'spring' }}
                style={{
                    position: 'fixed', bottom: '24px', left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 100,
                    display: 'flex', alignItems: 'center', gap: '10px',
                }}
            >
                <motion.button
                    animate={{ boxShadow: ['0 0 20px rgba(255,20,147,0.4)', '0 0 50px rgba(255,20,147,0.8)', '0 0 20px rgba(255,20,147,0.4)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onClick={() => navigate('/create')}
                    style={{
                        background: 'linear-gradient(135deg, #ff1493 0%, #c71585 100%)',
                        border: 'none', color: '#fff',
                        borderRadius: '100px', padding: '14px 36px',
                        fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                        fontFamily: "'Poppins', sans-serif",
                        display: 'flex', alignItems: 'center', gap: '10px',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Sparkles size={18} />
                    Get Yours — Only ₹{PRICE}
                </motion.button>
            </motion.div>
        </div>
    );
}
