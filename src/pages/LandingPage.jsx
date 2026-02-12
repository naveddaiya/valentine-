import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Heart, Camera, Clock, Star, Shield, Sparkles, ArrowRight, Check } from 'lucide-react';
import { PRICE } from '../config';
import '@fontsource/dancing-script/400.css';
import '@fontsource/great-vibes/400.css';

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 30, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

// ─── Floating hearts background ──────────────────────────────────────────────
function FloatingBg() {
    const hearts = ['❤️', '💕', '💖', '🌹', '💗', '✨', '💝', '💘'];
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {[...Array(18)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: 'absolute',
                        left: `${(i * 5.7 + 3) % 100}%`,
                        top: '-5%',
                        fontSize: `${14 + (i % 5) * 5}px`,
                        opacity: 0.12 + (i % 4) * 0.04,
                        animation: `floatHearts ${10 + (i % 6) * 2.5}s ${i * 1.1}s infinite linear`,
                    }}
                >
                    {hearts[i % hearts.length]}
                </div>
            ))}
        </div>
    );
}

// ─── Gradient text helper ─────────────────────────────────────────────────────
function GradText({ children, className = '' }) {
    return (
        <span
            className={className}
            style={{
                background: 'linear-gradient(135deg, #ff8fab 0%, #ff1493 40%, #c71585 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}
        >
            {children}
        </span>
    );
}

// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({ emoji, title, desc, delay }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.6, delay }}
            whileHover={{ y: -6, scale: 1.02 }}
            style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255, 100, 150, 0.2)',
                borderRadius: '20px',
                padding: '28px 24px',
                backdropFilter: 'blur(10px)',
                cursor: 'default',
                transition: 'border-color 0.3s',
            }}
            onHoverStart={e => e.target.style && (e.target.style.borderColor = 'rgba(255,20,147,0.4)')}
        >
            <div style={{ fontSize: '2.5rem', marginBottom: '14px' }}>{emoji}</div>
            <h3 style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.3rem',
                color: '#ff8fab',
                marginBottom: '8px',
                fontWeight: 600,
            }}>
                {title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                {desc}
            </p>
        </motion.div>
    );
}

// ─── Step card ───────────────────────────────────────────────────────────────
function StepCard({ num, emoji, title, desc, delay }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            style={{ textAlign: 'center', padding: '0 16px' }}
        >
            <div style={{
                width: '64px', height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff1493 0%, #c71585 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '1.6rem',
                boxShadow: '0 0 32px rgba(255,20,147,0.4)',
            }}>
                {emoji}
            </div>
            <div style={{
                display: 'inline-block',
                background: 'rgba(255,20,147,0.15)',
                color: '#ff69b4',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                padding: '4px 14px',
                borderRadius: '100px',
                marginBottom: '12px',
            }}>
                Step {num}
            </div>
            <h3 style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.4rem',
                color: '#fff',
                marginBottom: '8px',
                fontWeight: 600,
            }}>
                {title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                {desc}
            </p>
        </motion.div>
    );
}

// ─── Testimonial card ─────────────────────────────────────────────────────────
function TestimonialCard({ quote, name, tag, delay }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay }}
            style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,100,150,0.15)',
                borderRadius: '20px',
                padding: '28px 24px',
                backdropFilter: 'blur(10px)',
            }}
        >
            <div style={{ color: '#ff69b4', marginBottom: '14px', fontSize: '1.1rem' }}>
                {'★★★★★'}
            </div>
            <p style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '0.95rem',
                lineHeight: 1.75,
                marginBottom: '20px',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
            }}>
                "{quote}"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #ff1493, #c71585)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 700, fontSize: '1rem',
                }}>
                    {name[0]}
                </div>
                <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{name}</div>
                    <div style={{ color: 'rgba(255,150,180,0.6)', fontSize: '0.75rem' }}>{tag}</div>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
    const navigate = useNavigate();
    const [hoveredCta, setHoveredCta] = useState(false);

    const s = {
        page: {
            minHeight: '100vh',
            background: 'linear-gradient(160deg, #06010a 0%, #100018 40%, #06010a 100%)',
            color: '#fff',
            fontFamily: "'Poppins', sans-serif",
            position: 'relative',
            overflowX: 'hidden',
        },
        section: { position: 'relative', zIndex: 1 },
        maxW: { maxWidth: '1100px', margin: '0 auto', padding: '0 20px' },
        centerText: { textAlign: 'center' },
    };

    return (
        <div style={s.page}>
            <FloatingBg />

            {/* ── NAV ───────────────────────────────────────────────────────── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 50,
                padding: '16px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(6,1,10,0.85)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,100,150,0.12)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}>💝</span>
                    <span style={{
                        fontFamily: "'Dancing Script', cursive",
                        fontSize: '1.4rem',
                        background: 'linear-gradient(135deg, #ff8fab, #ff1493)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        fontWeight: 700,
                    }}>
                        Valentine Surprise
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/preview')}
                        style={{
                            background: 'transparent', border: '1px solid rgba(255,100,150,0.3)',
                            color: '#ff8fab', borderRadius: '100px', padding: '8px 20px',
                            fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.target.style.background = 'rgba(255,20,147,0.1)'; e.target.style.borderColor = '#ff1493'; }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(255,100,150,0.3)'; }}
                    >
                        See Preview
                    </button>
                    <button
                        onClick={() => navigate('/create')}
                        style={{
                            background: 'linear-gradient(135deg, #ff1493 0%, #c71585 100%)',
                            border: 'none', color: '#fff', borderRadius: '100px', padding: '8px 20px',
                            fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600,
                            fontFamily: "'Poppins', sans-serif",
                            boxShadow: '0 0 20px rgba(255,20,147,0.35)',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    >
                        Buy — ₹{PRICE}
                    </button>
                </div>
            </nav>

            {/* ── HERO ──────────────────────────────────────────────────────── */}
            <section style={{ ...s.section, minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 60px' }}>
                <div style={{ ...s.maxW, ...s.centerText }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', duration: 1.4, bounce: 0.4 }}
                        style={{ fontSize: '5rem', marginBottom: '28px', display: 'inline-block' }}
                    >
                        💝
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(255,20,147,0.12)',
                            border: '1px solid rgba(255,20,147,0.3)',
                            borderRadius: '100px', padding: '6px 18px',
                            fontSize: '0.8rem', color: '#ff8fab', letterSpacing: '1px',
                            marginBottom: '28px', textTransform: 'uppercase', fontWeight: 600,
                        }}
                    >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff1493', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                        Valentine's Day 2026
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.9 }}
                        style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
                            lineHeight: 1.25,
                            marginBottom: '24px',
                            background: 'linear-gradient(135deg, #fff 0%, #ffb6d9 50%, #ff1493 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Make Valentine's Day<br />
                        Unforgettable
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.9 }}
                        style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                            maxWidth: '560px',
                            margin: '0 auto 40px',
                            lineHeight: 1.75,
                        }}
                    >
                        Gift them a stunning personalized surprise page — with your photos,
                        love letter, and interactive moments they'll treasure forever.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.3, duration: 0.7 }}
                        style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '48px' }}
                    >
                        <button
                            onClick={() => navigate('/create')}
                            onMouseEnter={() => setHoveredCta(true)}
                            onMouseLeave={() => setHoveredCta(false)}
                            style={{
                                background: 'linear-gradient(135deg, #ff1493 0%, #c71585 100%)',
                                border: 'none', color: '#fff',
                                borderRadius: '100px', padding: '16px 40px',
                                fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer',
                                fontFamily: "'Poppins', sans-serif",
                                boxShadow: hoveredCta ? '0 0 50px rgba(255,20,147,0.7)' : '0 0 30px rgba(255,20,147,0.5)',
                                transform: hoveredCta ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
                                transition: 'all 0.25s',
                                display: 'flex', alignItems: 'center', gap: '10px',
                            }}
                        >
                            <Heart size={18} fill="currentColor" />
                            Create Your Surprise — ₹{PRICE}
                        </button>
                        <button
                            onClick={() => navigate('/preview')}
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff', borderRadius: '100px', padding: '16px 36px',
                                fontSize: '1.05rem', cursor: 'pointer',
                                fontFamily: "'Poppins', sans-serif",
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.25s',
                                display: 'flex', alignItems: 'center', gap: '10px',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        >
                            See Live Preview
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>

                    {/* Trust signals */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7 }}
                        style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        {[
                            { icon: <Shield size={14} />, text: 'Secured by Razorpay' },
                            { icon: <Heart size={14} fill="#ff1493" />, text: '1000+ Surprises Created' },
                            { icon: <Clock size={14} />, text: 'Ready in 2 minutes' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                                <span style={{ color: '#ff69b4' }}>{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── PREVIEW TEASER ────────────────────────────────────────────── */}
            <section style={{ ...s.section, padding: '80px 20px', background: 'rgba(255,20,147,0.04)', borderTop: '1px solid rgba(255,100,150,0.1)', borderBottom: '1px solid rgba(255,100,150,0.1)' }}>
                <div style={{ ...s.maxW, ...s.centerText }}>
                    <FadeIn>
                        <p style={{ color: '#ff69b4', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>
                            Don't Just Take Our Word For It
                        </p>
                        <h2 style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            background: 'linear-gradient(135deg, #fff, #ffb6d9)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            marginBottom: '24px',
                        }}>
                            See it before you buy it
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7 }}>
                            Open our live demo made for a sample couple. This is exactly
                            what your partner will see — with your photos, your words, your story.
                        </p>
                        <button
                            onClick={() => navigate('/preview')}
                            style={{
                                background: 'transparent',
                                border: '2px solid #ff1493',
                                color: '#ff8fab',
                                borderRadius: '100px', padding: '14px 40px',
                                fontSize: '1rem', cursor: 'pointer',
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 600,
                                transition: 'all 0.25s',
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#ff1493'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 0 30px rgba(255,20,147,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ff8fab'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <Sparkles size={18} />
                            Open Live Demo
                        </button>
                    </FadeIn>
                </div>
            </section>

            {/* ── WHAT'S INCLUDED ───────────────────────────────────────────── */}
            <section style={{ ...s.section, padding: '100px 20px' }}>
                <div style={s.maxW}>
                    <FadeIn className="text-center" style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <p style={{ color: '#ff69b4', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
                            Everything Included
                        </p>
                        <h2 style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            background: 'linear-gradient(135deg, #fff, #ffb6d9)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            textAlign: 'center',
                        }}>
                            What's Inside Your Surprise Page
                        </h2>
                    </FadeIn>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '20px',
                    }}>
                        <FeatureCard emoji="💌" title="Love Letter" desc="Your heartfelt message displayed in a stunning envelope-reveal animation. Every word beautifully presented." delay={0} />
                        <FeatureCard emoji="📸" title="Photo Gallery" desc="Up to 5 of your cherished memories displayed in an animated gallery with smooth transitions." delay={0.1} />
                        <FeatureCard emoji="💖" title="Reasons I Love You" desc="Your personal reasons revealed as elegant animated cards — a list they'll read again and again." delay={0.2} />
                        <FeatureCard emoji="📅" title="Your Love Story" desc="An animated timeline of your relationship milestones — dates, moments, and memories." delay={0.3} />
                        <FeatureCard emoji="⏰" title="Valentine Countdown" desc="A live real-time countdown to February 14th, building excitement every second." delay={0.4} />
                        <FeatureCard emoji="💍" title="Will You Be Mine?" desc="An interactive proposal button with confetti explosion — because every answer deserves a celebration." delay={0.5} />
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
            <section style={{ ...s.section, padding: '100px 20px', background: 'rgba(255,20,147,0.03)', borderTop: '1px solid rgba(255,100,150,0.08)', borderBottom: '1px solid rgba(255,100,150,0.08)' }}>
                <div style={s.maxW}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <p style={{ color: '#ff69b4', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
                            Simple & Fast
                        </p>
                        <h2 style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            background: 'linear-gradient(135deg, #fff, #ffb6d9)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            textAlign: 'center',
                        }}>
                            Ready in 3 Simple Steps
                        </h2>
                    </FadeIn>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '48px 32px',
                    }}>
                        <StepCard num={1} emoji="✍️" title="Fill Your Story" desc="Enter your names, write your love letter, upload photos, add reasons and your story timeline." delay={0} />
                        <StepCard num={2} emoji="💳" title="Pay Securely" desc={`Pay just ₹${PRICE} via Razorpay — UPI, cards, net banking, wallets all accepted.`} delay={0.15} />
                        <StepCard num={3} emoji="🎁" title="Share the Surprise" desc="Instantly get a beautiful link. Send it to them via WhatsApp or any app. Watch them react." delay={0.3} />
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
            <section style={{ ...s.section, padding: '100px 20px' }}>
                <div style={s.maxW}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <p style={{ color: '#ff69b4', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
                            Real Reactions
                        </p>
                        <h2 style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                            background: 'linear-gradient(135deg, #fff, #ffb6d9)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            textAlign: 'center',
                        }}>
                            They Loved It
                        </h2>
                    </FadeIn>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        <TestimonialCard
                            quote="She cried happy tears when she opened it. The love letter reveal animation made it feel so cinematic. Best ₹29 I ever spent, no question."
                            name="Rahul M."
                            tag="Gifted to his girlfriend"
                            delay={0}
                        />
                        <TestimonialCard
                            quote="My boyfriend was completely speechless. He kept asking 'how did you make this?!' The interactive proposal button had us both laughing and crying."
                            name="Sneha K."
                            tag="Gifted to her boyfriend"
                            delay={0.15}
                        />
                        <TestimonialCard
                            quote="She still visits the page every single day. The timeline of our relationship milestones made her nostalgic. So worth it!"
                            name="Karan D."
                            tag="Gifted to his wife"
                            delay={0.3}
                        />
                    </div>
                </div>
            </section>

            {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
            <section style={{
                ...s.section,
                padding: '100px 20px',
                background: 'radial-gradient(ellipse at center, rgba(255,20,147,0.15) 0%, transparent 70%)',
                borderTop: '1px solid rgba(255,100,150,0.1)',
            }}>
                <div style={{ ...s.maxW, ...s.centerText }}>
                    <FadeIn>
                        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>🌹</div>
                        <h2 style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
                            background: 'linear-gradient(135deg, #fff 0%, #ffb6d9 50%, #ff1493 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            marginBottom: '20px',
                        }}>
                            Give them a moment<br />they'll never forget
                        </h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '1rem',
                            maxWidth: '440px',
                            margin: '0 auto 40px',
                            lineHeight: 1.75,
                        }}>
                            In a world of forwarded messages and generic wishes, stand out.
                            Show them how much you truly care.
                        </p>

                        {/* Price card */}
                        <div style={{
                            display: 'inline-block',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,100,150,0.25)',
                            borderRadius: '24px',
                            padding: '32px 48px',
                            marginBottom: '32px',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '8px', textDecoration: 'line-through' }}>
                                Worth ₹500+
                            </div>
                            <div style={{
                                fontFamily: "'Great Vibes', cursive",
                                fontSize: '3.5rem',
                                background: 'linear-gradient(135deg, #ff8fab, #ff1493)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                lineHeight: 1,
                                marginBottom: '8px',
                            }}>
                                Only ₹{PRICE}
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
                                One-time payment · Lifetime link
                            </div>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {['Custom Photos', 'Love Letter', 'Timeline', 'Reasons', 'Countdown', 'Proposal'].map(f => (
                                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(255,180,210,0.7)', fontSize: '0.78rem' }}>
                                        <Check size={12} color="#ff1493" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'block' }}>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -3 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/create')}
                                style={{
                                    background: 'linear-gradient(135deg, #ff1493 0%, #c71585 100%)',
                                    border: 'none', color: '#fff',
                                    borderRadius: '100px', padding: '18px 56px',
                                    fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                                    fontFamily: "'Poppins', sans-serif",
                                    boxShadow: '0 0 50px rgba(255,20,147,0.5)',
                                    display: 'inline-flex', alignItems: 'center', gap: '12px',
                                }}
                            >
                                <Heart size={20} fill="currentColor" />
                                Create Your Surprise Now
                                <ArrowRight size={20} />
                            </motion.button>
                        </div>

                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', marginTop: '24px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                            <Shield size={12} />
                            100% secure payment via Razorpay · Instant delivery
                        </p>
                    </FadeIn>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────────────────── */}
            <footer style={{
                position: 'relative', zIndex: 1,
                borderTop: '1px solid rgba(255,100,150,0.1)',
                padding: '32px 20px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.2)',
                fontSize: '0.8rem',
            }}>
                <span style={{ fontFamily: "'Dancing Script', cursive", color: 'rgba(255,100,150,0.3)', fontSize: '1rem' }}>
                    Valentine Surprise
                </span>
                &nbsp;·&nbsp; Made with 💕 for lovers everywhere
            </footer>
        </div>
    );
}
