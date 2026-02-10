import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ConfigContext } from '../ConfigContext';
import FloatingHearts from '../components/FloatingHearts';
import VideoHero from '../components/VideoHero';
import PhotoGallery from '../components/PhotoGallery';
import LoveLetter from '../components/LoveLetter';
import CountdownTimer from '../components/CountdownTimer';
import ProposalButton from '../components/ProposalButton';
import MusicPlayer from '../components/MusicPlayer';
import T5Footer from '../components/T5Footer';
import '@fontsource/dancing-script/400.css';
import '@fontsource/great-vibes/400.css';

function SurprisePage() {
    const { id } = useParams();
    const [surprise, setSurprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            <FloatingHearts />
            <MusicPlayer />
            <main className="relative z-10">
                <VideoHero />
                <div className="section-divider" />
                <PhotoGallery />
                <div className="section-divider" />
                <LoveLetter />
                <div className="section-divider" />
                <CountdownTimer />
                <div className="section-divider" />
                <ProposalButton />
                <T5Footer />
            </main>
        </ConfigContext.Provider>
    );
}

export default SurprisePage;
