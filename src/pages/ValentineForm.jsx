import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Upload, Loader2, Plus, Trash2, ArrowRight, ArrowLeft, Eye } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { PRICE, PRICE_IN_PAISE } from '../config';
import { ConfigContext } from '../ConfigContext';
import { Template5 } from '../templates/index.js';
import '@fontsource/dancing-script/400.css';
import '@fontsource/great-vibes/400.css';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const INPUT_STYLE = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,100,150,0.25)',
    borderRadius: '12px', color: '#fff',
    fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem',
    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
};
const LABEL_STYLE = {
    display: 'block', marginBottom: '8px',
    color: 'rgba(255,180,210,0.8)', fontSize: '0.85rem',
    fontWeight: 600, letterSpacing: '0.5px',
};
const SECTION_TITLE_STYLE = {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '2rem',
    background: 'linear-gradient(135deg, #fff, #ffb6d9)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    marginBottom: '6px',
};
const SECTION_SUB_STYLE = { color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '28px' };

function StepIndicator({ current, total }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
            {Array.from({ length: total }, (_, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                    <motion.div
                        animate={{
                            background: i <= current ? 'linear-gradient(135deg, #ff1493, #c71585)' : 'rgba(255,255,255,0.1)',
                            scale: i === current ? 1.15 : 1,
                            boxShadow: i === current ? '0 0 20px rgba(255,20,147,0.6)' : 'none',
                        }}
                        transition={{ duration: 0.3 }}
                        style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                            border: i <= current ? 'none' : '1px solid rgba(255,100,150,0.2)',
                        }}
                    >
                        {i < current ? '✓' : i + 1}
                    </motion.div>
                    {i < total - 1 && (
                        <div style={{
                            width: '32px', height: '2px',
                            background: i < current ? 'linear-gradient(90deg, #ff1493, #c71585)' : 'rgba(255,255,255,0.08)',
                            transition: 'background 0.4s',
                        }} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function ValentineForm() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({ senderName: '', receiverName: '', message: '' });
    const [images, setImages] = useState([]);
    const [reasons, setReasons] = useState(['', '', '']);
    const [timeline, setTimeline] = useState([
        { date: '', title: '', description: '' },
        { date: '', title: '', description: '' },
    ]);

    // Live preview
    const [previewConfig, setPreviewConfig] = useState(null);
    const previewUrlsRef = useRef([]);

    const TOTAL_STEPS = 4;

    const onFocus = e => { e.target.style.borderColor = '#ff1493'; e.target.style.boxShadow = '0 0 0 3px rgba(255,20,147,0.15)'; };
    const onBlur  = e => { e.target.style.borderColor = 'rgba(255,100,150,0.25)'; e.target.style.boxShadow = 'none'; };

    const validateStep = () => {
        setError('');
        if (step === 0 && (!formData.senderName.trim() || !formData.receiverName.trim() || !formData.message.trim())) {
            setError('Please fill in all fields to continue.'); return false;
        }
        if (step === 1 && images.length === 0) {
            setError('Please upload at least one photo.'); return false;
        }
        if (step === 2 && reasons.filter(r => r.trim()).length < 1) {
            setError('Please add at least one reason.'); return false;
        }
        return true;
    };

    const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
    const prevStep = () => { setError(''); setStep(s => s - 1); };

    const openPreview = () => {
        previewUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
        const newUrls = images.map(f => URL.createObjectURL(f));
        previewUrlsRef.current = newUrls;
        const name   = formData.receiverName || 'Them';
        const sender = formData.senderName   || 'You';
        setPreviewConfig({
            senderName:      sender,
            receiverName:    name,
            password:        null,
            passwordHint:    null,
            videoUrl:        null,
            heroTitle:       `For ${name}`,
            heroSubtitle:    `A special Valentine surprise from ${sender}, made with love`,
            loveLetter:      formData.message,
            photos:          newUrls.map((url, i) => ({ url, caption: `Memory ${i + 1}` })),
            timeline:        timeline.filter(t => t.title.trim()),
            quizQuestions:   [],
            reasons:         reasons.filter(r => r.trim()),
            countdownDate:   '2026-02-14T00:00:00',
            musicUrl:        null,
            yesText:         'Yes, always!',
            noText:          'Let me think...',
            acceptedMessage: 'Our love story continues...',
        });
    };

    const closePreview = () => {
        setPreviewConfig(null);
        previewUrlsRef.current.forEach(u => URL.revokeObjectURL(u));
        previewUrlsRef.current = [];
    };

    const handleImageSelect = e => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > MAX_IMAGES) { setError(`Max ${MAX_IMAGES} images allowed.`); return; }
        for (const f of files) {
            if (f.size > MAX_IMAGE_SIZE) { setError(`"${f.name}" exceeds 2 MB.`); return; }
            if (!f.type.startsWith('image/')) { setError(`"${f.name}" is not a valid image.`); return; }
        }
        setError('');
        setImages(prev => [...prev, ...files]);
    };

    const updateReason  = (i, val) => setReasons(prev => prev.map((r, idx) => idx === i ? val : r));
    const addReason     = () => { if (reasons.length < 5) setReasons(prev => [...prev, '']); };
    const removeReason  = i => setReasons(prev => prev.filter((_, idx) => idx !== i));

    const updateTimeline = (i, field, val) =>
        setTimeline(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
    const addEvent    = () => { if (timeline.length < 4) setTimeline(prev => [...prev, { date: '', title: '', description: '' }]); };
    const removeEvent = i => setTimeline(prev => prev.filter((_, idx) => idx !== i));

    const uploadFiles = async surpriseId => {
        const imageUrls = [];
        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const ext  = file.name.split('.').pop();
            const path = `${surpriseId}/images/${Date.now()}_${i}.${ext}`;
            const { error } = await supabase.storage.from('valentine-media').upload(path, file, { cacheControl: '3600', upsert: false });
            if (error) throw error;
            const { data: { publicUrl } } = supabase.storage.from('valentine-media').getPublicUrl(path);
            imageUrls.push(publicUrl);
        }
        return imageUrls;
    };

    const handlePayment = async () => {
        if (!validateStep()) return;
        setLoading(true);
        try {
            const surpriseId = Math.random().toString(36).substring(2, 10);
            const imageUrls  = await uploadFiles(surpriseId);

            const script = document.createElement('script');
            script.src   = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                new window.Razorpay({
                    key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount:      PRICE_IN_PAISE,
                    currency:    'INR',
                    name:        'Valentine Surprise',
                    description: 'Personalized Valentine surprise page',
                    prefill:     { name: formData.senderName },
                    theme:       { color: '#ff1493' },
                    handler: async response => {
                        try {
                            const res = await fetch('/.netlify/functions/create-surprise', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    surpriseId,
                                    senderName:   formData.senderName,
                                    receiverName: formData.receiverName,
                                    message:      formData.message,
                                    images:       imageUrls,
                                    audioUrl:     null,
                                    reasons:      reasons.filter(r => r.trim()),
                                    timeline:     timeline.filter(t => t.title.trim()),
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpayOrderId:   response.razorpay_order_id,
                                    razorpaySignature: response.razorpay_signature,
                                }),
                            });
                            const data = await res.json();
                            if (data.success) {
                                window.location.href = `/s/${surpriseId}?new=1`;
                            } else {
                                setError('Payment verification failed. Please contact support.');
                                setLoading(false);
                            }
                        } catch (err) {
                            console.error(err);
                            setError('Failed to create surprise. Please try again.');
                            setLoading(false);
                        }
                    },
                    modal: { ondismiss: () => setLoading(false) },
                }).open();
            };
            script.onerror = () => { setError('Failed to load payment gateway.'); setLoading(false); };
        } catch (err) {
            console.error(err);
            setError('Failed to upload photos. Please try again.');
            setLoading(false);
        }
    };

    const card = {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,100,150,0.18)',
        borderRadius: '20px', padding: '20px', marginBottom: '14px',
    };

    return (
        <>
            {/* Live Preview Overlay */}
            {previewConfig && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    overflowY: 'auto', background: '#06010a',
                }}>
                    <div style={{
                        position: 'sticky', top: 0, zIndex: 100,
                        background: 'rgba(6,1,10,0.97)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255,100,150,0.25)',
                        padding: '12px 20px',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <button
                                onClick={closePreview}
                                style={{
                                    background: 'transparent', border: 'none',
                                    color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    fontSize: '0.9rem', fontFamily: "'Poppins', sans-serif",
                                }}
                            >
                                <ArrowLeft size={16} /> Close Preview
                            </button>
                            <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)', display: 'inline-block' }} />
                            <span style={{
                                fontFamily: "'Dancing Script', cursive",
                                fontSize: '1rem', color: 'rgba(255,150,180,0.7)',
                            }}>
                                This is exactly how your surprise will look!
                            </span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            onClick={() => { closePreview(); handlePayment(); }}
                            style={{
                                background: 'linear-gradient(135deg, #ff1493, #c71585)',
                                border: 'none', color: '#fff',
                                borderRadius: '100px', padding: '9px 24px',
                                fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                                fontFamily: "'Poppins', sans-serif",
                                boxShadow: '0 0 20px rgba(255,20,147,0.5)',
                                display: 'flex', alignItems: 'center', gap: '8px',
                            }}
                        >
                            <Heart size={15} fill="currentColor" />
                            Looks Perfect! Pay and Create
                        </motion.button>
                    </div>
                    <ConfigContext.Provider value={previewConfig}>
                        <Template5 />
                    </ConfigContext.Provider>
                </div>
            )}

            {/* Main Form */}
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(160deg, #06010a 0%, #100018 40%, #06010a 100%)',
                color: '#fff', fontFamily: "'Poppins', sans-serif",
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                padding: '32px 20px 80px',
            }}>
                <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
                    {['❤️', '💕', '🌹', '✨', '💖'].map((h, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: `${i * 22 + 5}%`, top: '-5%',
                            fontSize: `${16 + i * 4}px`, opacity: 0.08,
                            animation: `floatHearts ${12 + i * 2}s ${i * 2}s infinite linear`,
                        }}>{h}</div>
                    ))}
                </div>

                <div style={{ width: '100%', maxWidth: '560px', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'transparent', border: 'none', color: 'rgba(255,150,180,0.5)',
                                cursor: 'pointer', fontSize: '0.85rem', marginBottom: '16px',
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                fontFamily: "'Poppins', sans-serif",
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = '#ff8fab'}
                            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,150,180,0.5)'}
                        >
                            <ArrowLeft size={14} /> Back to Home
                        </button>
                        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>💝</div>
                        <h1 style={{
                            fontFamily: "'Great Vibes', cursive",
                            fontSize: 'clamp(2.2rem, 6vw, 3.2rem)',
                            background: 'linear-gradient(135deg, #fff, #ffb6d9)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            marginBottom: '8px',
                        }}>
                            Create Your Surprise
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>
                            Only ₹{PRICE} · Fills in minutes · Surprise them today
                        </p>
                    </div>

                    <StepIndicator current={step} total={TOTAL_STEPS} />

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                style={{
                                    background: 'rgba(220,53,69,0.12)', border: '1px solid rgba(220,53,69,0.3)',
                                    borderRadius: '12px', padding: '12px 16px', marginBottom: '20px',
                                    color: '#f87171', fontSize: '0.88rem', borderLeft: '3px solid #ef4444',
                                }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        {step === 0 && (
                            <motion.div key="step0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                                <div style={card}>
                                    <h2 style={SECTION_TITLE_STYLE}>The Basics</h2>
                                    <p style={SECTION_SUB_STYLE}>Tell us about you and your special person</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                                        <div>
                                            <label style={LABEL_STYLE}>Your Name</label>
                                            <input style={INPUT_STYLE} placeholder="e.g. Arjun"
                                                value={formData.senderName}
                                                onChange={e => setFormData(p => ({ ...p, senderName: e.target.value }))}
                                                onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                        <div>
                                            <label style={LABEL_STYLE}>Their Name</label>
                                            <input style={INPUT_STYLE} placeholder="e.g. Priya"
                                                value={formData.receiverName}
                                                onChange={e => setFormData(p => ({ ...p, receiverName: e.target.value }))}
                                                onFocus={onFocus} onBlur={onBlur} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={LABEL_STYLE}>Your Love Letter</label>
                                        <textarea
                                            style={{ ...INPUT_STYLE, minHeight: '140px', resize: 'vertical' }}
                                            placeholder="Pour your heart out... What do you want them to know?"
                                            value={formData.message}
                                            onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                                            onFocus={onFocus} onBlur={onBlur} />
                                        <div style={{ textAlign: 'right', marginTop: '4px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                                            {formData.message.length} characters
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                                <div style={card}>
                                    <h2 style={SECTION_TITLE_STYLE}>Your Photos</h2>
                                    <p style={SECTION_SUB_STYLE}>Upload up to {MAX_IMAGES} cherished memories (max 2 MB each)</p>
                                    <label style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
                                        padding: '28px 20px', borderRadius: '14px',
                                        border: '2px dashed rgba(255,100,150,0.3)',
                                        cursor: images.length >= MAX_IMAGES ? 'not-allowed' : 'pointer',
                                        background: 'rgba(255,20,147,0.03)', marginBottom: '16px',
                                        transition: 'border-color 0.2s',
                                    }}
                                        onMouseEnter={e => images.length < MAX_IMAGES && (e.currentTarget.style.borderColor = '#ff1493')}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,100,150,0.3)'}
                                    >
                                        <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageSelect} disabled={images.length >= MAX_IMAGES} />
                                        <Upload size={28} color="#ff69b4" />
                                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                                            {images.length === 0 ? 'Click to upload photos' : `${images.length}/${MAX_IMAGES} selected — click to add more`}
                                        </span>
                                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem' }}>JPG, PNG, WEBP · Max 2 MB each</span>
                                    </label>
                                    {images.length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {images.map((file, i) => (
                                                <div key={i} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '10px', overflow: 'hidden', border: '2px solid rgba(255,100,150,0.3)' }}>
                                                    <img src={URL.createObjectURL(file)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                                                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                                <div style={card}>
                                    <h2 style={SECTION_TITLE_STYLE}>Why Do You Love Them?</h2>
                                    <p style={SECTION_SUB_STYLE}>3 to 5 reasons shown as animated flip cards</p>
                                    {reasons.map((r, i) => (
                                        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '12px', alignItems: 'center' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #ff1493, #c71585)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                                                {i + 1}
                                            </div>
                                            <input style={{ ...INPUT_STYLE, flex: 1 }}
                                                placeholder={`Reason ${i + 1}...`}
                                                value={r} onChange={e => updateReason(i, e.target.value)}
                                                onFocus={onFocus} onBlur={onBlur} />
                                            {reasons.length > 1 && (
                                                <button onClick={() => removeReason(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.5)', padding: '4px', display: 'flex' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {reasons.length < 5 && (
                                        <button onClick={addReason} style={{ background: 'transparent', border: '1px dashed rgba(255,100,150,0.3)', borderRadius: '10px', padding: '10px 16px', color: 'rgba(255,150,180,0.6)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", transition: 'all 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff1493'; e.currentTarget.style.color = '#ff8fab'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,100,150,0.3)'; e.currentTarget.style.color = 'rgba(255,150,180,0.6)'; }}>
                                            <Plus size={16} /> Add Another Reason
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
                                <div style={card}>
                                    <h2 style={SECTION_TITLE_STYLE}>Your Love Story</h2>
                                    <p style={SECTION_SUB_STYLE}>2 to 4 key moments shown as an animated timeline</p>
                                    {timeline.map((t, i) => (
                                        <div key={i} style={{ ...card, margin: '0 0 14px', padding: '16px', background: 'rgba(255,255,255,0.03)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                <span style={{ color: '#ff69b4', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Moment {i + 1}</span>
                                                {timeline.length > 1 && (
                                                    <button onClick={() => removeEvent(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.5)', display: 'flex', padding: '2px' }}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                                                <div>
                                                    <label style={{ ...LABEL_STYLE, fontSize: '0.78rem' }}>Date / Period</label>
                                                    <input style={INPUT_STYLE} placeholder="e.g. June 2022" value={t.date} onChange={e => updateTimeline(i, 'date', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                                                </div>
                                                <div>
                                                    <label style={{ ...LABEL_STYLE, fontSize: '0.78rem' }}>Milestone Title</label>
                                                    <input style={INPUT_STYLE} placeholder="e.g. Our First Date" value={t.title} onChange={e => updateTimeline(i, 'title', e.target.value)} onFocus={onFocus} onBlur={onBlur} />
                                                </div>
                                            </div>
                                            <div>
                                                <label style={{ ...LABEL_STYLE, fontSize: '0.78rem' }}>Short Description</label>
                                                <textarea style={{ ...INPUT_STYLE, minHeight: '70px', resize: 'vertical' }}
                                                    placeholder="What made this moment special?"
                                                    value={t.description} onChange={e => updateTimeline(i, 'description', e.target.value)}
                                                    onFocus={onFocus} onBlur={onBlur} />
                                            </div>
                                        </div>
                                    ))}
                                    {timeline.length < 4 && (
                                        <button onClick={addEvent} style={{ background: 'transparent', border: '1px dashed rgba(255,100,150,0.3)', borderRadius: '10px', padding: '10px 16px', color: 'rgba(255,150,180,0.6)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center', marginBottom: '20px', fontFamily: "'Poppins', sans-serif", transition: 'all 0.2s' }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff1493'; e.currentTarget.style.color = '#ff8fab'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,100,150,0.3)'; e.currentTarget.style.color = 'rgba(255,150,180,0.6)'; }}>
                                            <Plus size={16} /> Add Another Moment
                                        </button>
                                    )}
                                    <div style={{ background: 'rgba(255,20,147,0.06)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,100,150,0.2)' }}>
                                        <p style={{ color: 'rgba(255,180,210,0.8)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Summary</p>
                                        {[
                                            ['From', formData.senderName],
                                            ['To', formData.receiverName],
                                            ['Photos', `${images.length} uploaded`],
                                            ['Reasons', `${reasons.filter(r => r.trim()).length} added`],
                                            ['Timeline', `${timeline.filter(t => t.title.trim()).length} moments`],
                                        ].map(([label, value]) => (
                                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{label}</span>
                                                <span style={{ color: '#ff8fab', fontSize: '0.85rem', fontWeight: 600 }}>{value}</span>
                                            </div>
                                        ))}
                                        <div style={{ borderTop: '1px solid rgba(255,100,150,0.15)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Total</span>
                                            <span style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.5rem', background: 'linear-gradient(135deg, #ff8fab, #ff1493)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 700 }}>
                                                ₹{PRICE}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        {step > 0 && (
                            <button onClick={prevStep} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                                <ArrowLeft size={16} /> Back
                            </button>
                        )}

                        {step < TOTAL_STEPS - 1 ? (
                            <button onClick={nextStep} style={{ flex: 2, padding: '14px', background: 'linear-gradient(135deg, #ff1493, #c71585)', border: 'none', borderRadius: '14px', color: '#fff', cursor: 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 0 24px rgba(255,20,147,0.4)', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(255,20,147,0.6)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(255,20,147,0.4)'; }}>
                                Continue <ArrowRight size={16} />
                            </button>
                        ) : (
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handlePayment} disabled={loading}
                                style={{ flex: 2, padding: '16px', background: loading ? 'rgba(255,20,147,0.4)' : 'linear-gradient(135deg, #ff1493, #c71585)', border: 'none', borderRadius: '14px', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Poppins', sans-serif", fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: loading ? 'none' : '0 0 32px rgba(255,20,147,0.5)' }}>
                                {loading
                                    ? <><Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} /> Uploading...</>
                                    : <><Heart size={18} fill="currentColor" /> Pay ₹{PRICE} and Create Surprise</>
                                }
                            </motion.button>
                        )}
                    </div>

                    {/* Preview button on last step */}
                    {step === TOTAL_STEPS - 1 && (
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            onClick={openPreview}
                            style={{
                                width: '100%', marginTop: '12px', padding: '13px',
                                background: 'rgba(255,20,147,0.08)',
                                border: '1px solid rgba(255,20,147,0.25)',
                                borderRadius: '14px',
                                color: 'rgba(255,150,180,0.8)',
                                cursor: 'pointer', fontSize: '0.92rem',
                                fontFamily: "'Poppins', sans-serif",
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,20,147,0.14)'; e.currentTarget.style.borderColor = '#ff1493'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,20,147,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,20,147,0.25)'; }}
                        >
                            <Eye size={16} />
                            Preview Your Surprise Before Paying
                        </motion.button>
                    )}

                    {step < TOTAL_STEPS - 1 && (
                        <button onClick={() => navigate('/preview')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,150,180,0.4)', cursor: 'pointer', fontSize: '0.78rem', marginTop: '16px', width: '100%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: "'Poppins', sans-serif" }}>
                            <Eye size={13} /> See a sample preview
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
