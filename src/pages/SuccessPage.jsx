import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, Copy, Check } from 'lucide-react';

function SuccessPage() {
    const [searchParams] = useSearchParams();
    const surpriseId = searchParams.get('id');
    const [copied, setCopied] = useState(false);

    const surpriseUrl = `${window.location.origin}/s/${surpriseId}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(surpriseUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        // Confetti effect (optional - can be enhanced)
        const celebration = () => {
            const count = 50;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio, opts) {
                const confettiCount = Math.floor(count * particleRatio);
                // Simple hearts animation instead of confetti
                for (let i = 0; i < confettiCount; i++) {
                    setTimeout(() => {
                        const heart = document.createElement('div');
                        heart.innerHTML = '💕';
                        heart.style.position = 'fixed';
                        heart.style.left = Math.random() * 100 + '%';
                        heart.style.top = '0';
                        heart.style.fontSize = '30px';
                        heart.style.zIndex = '9999';
                        heart.style.pointerEvents = 'none';
                        heart.style.animation = 'floatHearts 3s ease-in forwards';
                        document.body.appendChild(heart);
                        setTimeout(() => heart.remove(), 3000);
                    }, i * 50);
                }
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        };

        celebration();
    }, []);

    if (!surpriseId) {
        return (
            <div className="container">
                <div className="card">
                    <h1>Error</h1>
                    <p>No surprise ID found. Please create a new surprise.</p>
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
                    Payment Successful!
                </h1>

                <div className="success-message">
                    🎉 Your Valentine surprise page has been created successfully!
                </div>

                <p style={{ textAlign: 'center', marginBottom: '24px', fontSize: '1.1rem' }}>
                    Share this special link with your loved one:
                </p>

                <div className="link-display">
                    {surpriseUrl}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={copyToClipboard}
                    style={{ marginBottom: '16px' }}
                >
                    {copied ? (
                        <>
                            <Check size={20} />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy size={20} />
                            Copy Link
                        </>
                    )}
                </button>

                <div style={{
                    background: 'linear-gradient(135deg, rgba(255, 20, 147, 0.05) 0%, rgba(255, 105, 180, 0.05) 100%)',
                    padding: '20px',
                    borderRadius: '12px',
                    marginTop: '24px'
                }}>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '12px' }}>📱 How to share:</h3>
                    <ul style={{ paddingLeft: '24px', lineHeight: '2' }}>
                        <li>Copy the link using the button above</li>
                        <li>Send it to your special someone via WhatsApp, Instagram, or SMS</li>
                        <li>Watch their reaction when they open it! 💕</li>
                    </ul>
                </div>

                <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-light)', fontSize: '0.95rem' }}>
                    Your surprise link is permanent and can be opened anytime!
                </p>
            </div>
        </div>
    );
}

export default SuccessPage;
