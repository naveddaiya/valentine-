import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Heart, Upload, Loader2 } from 'lucide-react';

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

function ValentineForm() {
    const [formData, setFormData] = useState({
        senderName: '',
        receiverName: '',
        message: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);

        if (images.length + files.length > MAX_IMAGES) {
            setError(`You can only upload up to ${MAX_IMAGES} images`);
            return;
        }

        const validFiles = [];
        for (const file of files) {
            if (file.size > MAX_IMAGE_SIZE) {
                setError(`Image ${file.name} exceeds 2MB limit`);
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError(`${file.name} is not an image file`);
                return;
            }
            validFiles.push(file);
        }

        setError('');
        setImages([...images, ...validFiles]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };



    const uploadFiles = async (surpriseId) => {
        const imageUrls = [];

        // Upload images
        for (let i = 0; i < images.length; i++) {
            const file = images[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${surpriseId}/images/${Date.now()}_${i}.${fileExt}`;

            const { data, error } = await supabase.storage
                .from('valentine-media')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('valentine-media')
                .getPublicUrl(fileName);

            imageUrls.push(publicUrl);
        }

        return { imageUrls, audioUrl: null };
    };

    const generateUniqueId = () => {
        return Math.random().toString(36).substring(2, 10);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!formData.senderName || !formData.receiverName || !formData.message) {
            setError('Please fill in all fields');
            return;
        }

        if (images.length === 0) {
            setError('Please upload at least one image');
            return;
        }



        setLoading(true);

        try {
            // Generate unique ID first (needed for file upload paths)
            const surpriseId = generateUniqueId();

            // Upload files to Supabase Storage
            const { imageUrls, audioUrl } = await uploadFiles(surpriseId);

            // Load Razorpay script
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                    amount: 10000, // ₹100 in paise
                    currency: 'INR',
                    name: 'Valentine Surprise',
                    description: 'Create your personalized surprise page',
                    image: '/heart-icon.png',
                    handler: async function (response) {
                        try {
                            // Call Netlify function to verify payment and save data
                            const result = await fetch('/.netlify/functions/create-surprise', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    surpriseId,
                                    senderName: formData.senderName,
                                    receiverName: formData.receiverName,
                                    message: formData.message,
                                    images: imageUrls,
                                    audioUrl: audioUrl,
                                    razorpayPaymentId: response.razorpay_payment_id,
                                    razorpayOrderId: response.razorpay_order_id,
                                    razorpaySignature: response.razorpay_signature,
                                }),
                            });

                            const data = await result.json();

                            if (data.success) {
                                // Redirect to success page with the surprise ID
                                window.location.href = `/success?id=${surpriseId}`;
                            } else {
                                setError('Payment verification failed. Please contact support.');
                                setLoading(false);
                            }
                        } catch (err) {
                            console.error('Error:', err);
                            setError('Failed to create surprise. Please try again.');
                            setLoading(false);
                        }
                    },
                    prefill: {
                        name: formData.senderName,
                    },
                    theme: {
                        color: '#ff1493',
                    },
                    modal: {
                        ondismiss: function () {
                            setLoading(false);
                        },
                    },
                };

                const razorpay = new window.Razorpay(options);
                razorpay.open();
            };

            script.onerror = () => {
                setError('Failed to load payment gateway. Please try again.');
                setLoading(false);
            };
        } catch (err) {
            console.error('Error:', err);
            setError('Failed to upload files. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {/* Floating hearts background */}
            <div className="heart-bg">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="heart">💕</div>
                ))}
            </div>

            <div className="card">
                <h1>
                    <Heart className="inline" size={48} style={{ display: 'inline', marginRight: '8px' }} />
                    Create Valentine Surprise
                </h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handlePayment}>
                    <div className="form-group">
                        <label htmlFor="senderName">Your Name</label>
                        <input
                            type="text"
                            id="senderName"
                            name="senderName"
                            value={formData.senderName}
                            onChange={handleInputChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="receiverName">Their Name</label>
                        <input
                            type="text"
                            id="receiverName"
                            name="receiverName"
                            value={formData.receiverName}
                            onChange={handleInputChange}
                            placeholder="Enter their name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your Romantic Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Pour your heart out..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Upload Images (Up to 5, max 2MB each)</label>
                        <div className="file-upload">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                disabled={images.length >= MAX_IMAGES}
                            />
                            <div className="file-upload-label">
                                <Upload size={24} />
                                <span>
                                    {images.length === 0
                                        ? 'Choose images'
                                        : `${images.length}/${MAX_IMAGES} images selected`}
                                </span>
                            </div>
                        </div>
                        {images.length > 0 && (
                            <div className="file-preview">
                                {images.map((file, index) => (
                                    <div key={index} className="file-preview-item">
                                        <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="file-preview-remove"
                                            onClick={() => removeImage(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>



                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="spinner" size={20} />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Heart size={20} />
                                Pay ₹100 & Generate Surprise
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ValentineForm;
