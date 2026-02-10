import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Heart, Loader2 } from 'lucide-react';

function SurprisePage() {
    const { id } = useParams();
    const [surprise, setSurprise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchSurprise();
    }, [id]);

    const fetchSurprise = async () => {
        try {
            const { data, error } = await supabase
                .from('surprises')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            if (!data) {
                setError('Surprise not found. Please check the link.');
                setLoading(false);
                return;
            }

            setSurprise(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching surprise:', err);
            setError('Failed to load surprise. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (surprise && surprise.images && surprise.images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) =>
                    prevIndex === surprise.images.length - 1 ? 0 : prevIndex + 1
                );
            }, 4000); // Change image every 4 seconds

            return () => clearInterval(interval);
        }
    }, [surprise]);

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader2 className="spinner" size={48} style={{ color: 'var(--primary)' }} />
                    <p style={{ marginTop: '16px', fontSize: '1.2rem' }}>Loading your surprise...</p>
                </div>
            </div>
        );
    }

    if (error || !surprise) {
        return (
            <div className="container">
                <div className="card">
                    <h1>Oops!</h1>
                    <div className="error-message">{error || 'Surprise not found'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Floating hearts background */}
            <div className="heart-bg">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="heart">💕</div>
                ))}
            </div>

            <div className="card">
                <h1 className="pulse">
                    <Heart size={48} style={{ display: 'inline', marginRight: '8px' }} />
                    For {surprise.receiver_name}
                </h1>

                <p style={{
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    color: 'var(--text-light)',
                    marginBottom: '24px',
                    fontStyle: 'italic'
                }}>
                    From {surprise.sender_name} with love 💕
                </p>

                {/* Image Slideshow */}
                {surprise.images && surprise.images.length > 0 && (
                    <div className="slideshow">
                        {surprise.images.map((imageUrl, index) => (
                            <img
                                key={index}
                                src={imageUrl}
                                alt={`Memory ${index + 1}`}
                                className={`slideshow-image ${index === currentImageIndex ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                )}

                {/* Romantic Message */}
                <div className="message-display">
                    "{surprise.message}"
                </div>

                {/* Audio Player */}
                {surprise.audio_url && (
                    <div className="audio-player">
                        <p style={{
                            marginBottom: '12px',
                            fontSize: '1.1rem',
                            color: 'var(--text-light)'
                        }}>
                            🎵 Listen to our song
                        </p>
                        <audio
                            controls
                            autoPlay
                            loop
                            src={surprise.audio_url}
                        >
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}

                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    padding: '24px',
                    background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.05) 0%, rgba(255, 105, 180, 0.05) 100%)',
                    borderRadius: '12px'
                }}>
                    <p style={{
                        fontSize: '1.5rem',
                        fontFamily: "'Dancing Script', cursive",
                        color: 'var(--primary)',
                        marginBottom: '8px'
                    }}>
                        Happy Valentine's Day! 💝
                    </p>
                    <p style={{ color: 'var(--text-light)' }}>
                        You mean the world to me
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SurprisePage;
