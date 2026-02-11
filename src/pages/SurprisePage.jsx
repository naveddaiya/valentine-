import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ConfigContext } from '../ConfigContext';
import { Template5 } from '../templates/index.js';
import { Copy, Check } from 'lucide-react';

function ShareBanner({ surpriseUrl }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(surpriseUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.95) 0%, rgba(199, 21, 133, 0.95) 100%)',
            backdropFilter: 'blur(10px)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            boxShadow: '0 2px 20px rgba(255, 20, 147, 0.4)',
        }}>
            <span style={{ color: '#fff', fontSize: '0.9rem', fontFamily: "'Dancing Script', cursive", fontSize: '1rem' }}>
                💕 Share this link with your loved one:
            </span>
            <span style={{
                color: '#ffe4f0',
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                background: 'rgba(0,0,0,0.2)',
                padding: '4px 10px',
                borderRadius: '6px',
                wordBreak: 'break-all',
                maxWidth: '300px',
            }}>
                {surpriseUrl}
            </span>
            <button
                onClick={copyToClipboard}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: copied ? 'rgba(40, 167, 69, 0.9)' : 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: "'Dancing Script', cursive",
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                }}
            >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Link'}
            </button>
        </div>
    );
}

function SurprisePage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isNew = searchParams.get('new') === '1';
    const [surprise, setSurprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const surpriseUrl = `${window.location.origin}/s/${id}`;

    // Apply dark theme when this page mounts, restore on unmount
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
                    .from('surprises')
                    .select('*')
                    .eq('id', id)
                    .single();
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.5rem', color: '#ff9ff3' }}>
                    Loading your surprise... 💕
                </p>
            </div>
        );
    }

    if (error || !surprise) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <p style={{ color: '#f87171' }}>{error || 'Surprise not found'}</p>
            </div>
        );
    }

    const config = {
        senderName: surprise.sender_name,
        receiverName: surprise.receiver_name,
        password: null,
        passwordHint: null,
        videoUrl: null,
        heroTitle: `For ${surprise.receiver_name}`,
        heroSubtitle: `A special message from ${surprise.sender_name} with love 💕`,
        loveLetter: surprise.message,
        photos: (surprise.images || []).map((url, i) => ({
            url,
            caption: `Memory ${i + 1} 💕`,
        })),
        timeline: [],
        quizQuestions: [],
        reasons: [],
        countdownDate: '2026-02-14T00:00:00',
        musicUrl: surprise.audio_url || null,
        yesText: 'Yes, forever! 💕',
        noText: 'Let me think... 🤔',
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

export default SurprisePage;
