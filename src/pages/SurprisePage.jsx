import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { ConfigContext } from '../ConfigContext';
import { Template5 } from '../templates/index.js';
import { Copy, Check } from 'lucide-react';
import '@fontsource/dancing-script/400.css';

// ─── Share banner ─────────────────────────────────────────────────────────────
function ShareBanner({ surpriseUrl }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(surpriseUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            background: 'linear-gradient(135deg, rgba(6,1,10,0.97) 0%, rgba(20,0,30,0.97) 100%)',
            backdropFilter: 'blur(20px)',
            padding: '12px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', flexWrap: 'wrap',
            borderBottom: '1px solid rgba(255,100,150,0.25)',
            boxShadow: '0 4px 24px rgba(255,20,147,0.2)',
        }}>
            <span style={{ color: 'rgba(255,180,210,0.8)', fontFamily: "'Dancing Script', cursive", fontSize: '1rem' }}>
                💕 Share this link with your loved one:
            </span>
            <span style={{
                color: 'rgba(255,150,180,0.7)', fontSize: '0.78rem', fontFamily: 'monospace',
                background: 'rgba(255,255,255,0.06)', padding: '4px 12px', borderRadius: '8px',
                wordBreak: 'break-all', maxWidth: '280px', border: '1px solid rgba(255,100,150,0.2)',
            }}>
                {surpriseUrl}
            </span>
            <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: copied ? 'rgba(40,167,69,0.9)' : 'linear-gradient(135deg, #ff1493, #c71585)',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '7px 16px', cursor: 'pointer', fontSize: '0.85rem',
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600, whiteSpace: 'nowrap',
                    boxShadow: copied ? 'none' : '0 0 20px rgba(255,20,147,0.4)',
                    transition: 'background 0.3s',
                }}
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Link'}
            </motion.button>
        </div>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SurprisePage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isNew = searchParams.get('new') === '1';
    const [surprise, setSurprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const surpriseUrl = `${window.location.origin}/s/${id}`;

    useEffect(() => {
        const prev = document.body.style.background;
        const prevColor = document.body.style.color;
        document.body.style.background = 'linear-gradient(160deg, #000000 0%, #0a0a0a 40%, #111111 70%, #000000 100%)';
        document.body.style.color = '#fff';
        return () => {
            document.body.style.background = prev;
            document.body.style.color = prevColor;
        };
    }, []);

    useEffect(() => {
        async function fetchSurprise() {
            try {
                const { data, error } = await supabase
                    .from('surprises').select('*').eq('id', id).single();
                if (error) throw error;
                if (!data) { setError('Surprise not found. Please check the link.'); return; }
                setSurprise(data);
            } catch (err) {
                console.error('Error fetching surprise:', err);
                setError('Failed to load surprise. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
        fetchSurprise();
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '16px' }}>
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 20px rgba(255,20,147,0.8))' }}
                >
                    💝
                </motion.div>
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.4rem', color: '#ff9ff3' }}>
                    Loading your surprise...
                </p>
            </div>
        );
    }

    if (error || !surprise) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <p style={{ color: '#f87171', fontFamily: "'Poppins', sans-serif" }}>{error || 'Surprise not found'}</p>
            </div>
        );
    }

    const extra = surprise.extra_data || {};

    const config = {
        senderName:    surprise.sender_name,
        receiverName:  surprise.receiver_name,
        password:      null,
        passwordHint:  null,
        videoUrl:      null,
        heroTitle:     `For ${surprise.receiver_name}`,
        heroSubtitle:  `A special Valentine surprise from ${surprise.sender_name}, made with love 💕`,
        loveLetter:    surprise.message,
        photos: (surprise.images || []).map((url, i) => ({ url, caption: `Memory ${i + 1} 💕` })),
        timeline:      extra.timeline   || [],
        quizQuestions: [],
        reasons:       extra.reasons    || [],
        countdownDate: '2026-02-14T00:00:00',
        musicUrl:      surprise.audio_url || null,
        yesText:       'Yes, always! 💕',
        noText:        'Let me think... 🤔',
        acceptedMessage: 'Our love story continues... 🎉💕',
    };

    return (
        <ConfigContext.Provider value={config}>
            {isNew && <ShareBanner surpriseUrl={surpriseUrl} />}
            <div style={isNew ? { paddingTop: '60px' } : {}}>
                <Template5 />
            </div>
        </ConfigContext.Provider>
    );
}
