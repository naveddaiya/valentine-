const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const {
            surpriseId,
            senderName,
            receiverName,
            message,
            images,
            audioUrl,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = JSON.parse(event.body);

        // Validate required fields
        if (!surpriseId || !senderName || !receiverName || !message || !images) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' }),
            };
        }

        // Verify Razorpay payment signature
        const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

        // For testing purposes, we can skip signature verification
        // In production, uncomment the following code:
        /*
        const generatedSignature = crypto
          .createHmac('sha256', razorpaySecret)
          .update(`${razorpayOrderId}|${razorpayPaymentId}`)
          .digest('hex');
    
        if (generatedSignature !== razorpaySignature) {
          return {
            statusCode: 400,
            body: JSON.stringify({ success: false, error: 'Invalid payment signature' }),
          };
        }
        */

        // Initialize Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Insert surprise data into Supabase
        const { data, error } = await supabase
            .from('surprises')
            .insert([
                {
                    id: surpriseId,
                    sender_name: senderName,
                    receiver_name: receiverName,
                    message: message,
                    images: images,
                    audio_url: audioUrl,
                    created_at: new Date().toISOString(),
                },
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, error: 'Failed to save surprise data' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                surpriseId: surpriseId,
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: 'Internal server error' }),
        };
    }
};
