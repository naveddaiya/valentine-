const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const {
            surpriseId,
            senderName,
            receiverName,
            message,
            images,
            audioUrl,
            reasons   = [],
            timeline  = [],
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = JSON.parse(event.body);

        if (!surpriseId || !senderName || !receiverName || !message || !images) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields' }),
            };
        }

        // Razorpay signature verification
        // Uncomment in production:
        /*
        const crypto = require('crypto');
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');
        if (generatedSignature !== razorpaySignature) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, error: 'Invalid payment signature' }),
            };
        }
        */

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        const { error } = await supabase
            .from('surprises')
            .insert([{
                id:           surpriseId,
                sender_name:  senderName,
                receiver_name: receiverName,
                message:      message,
                images:       images,
                audio_url:    audioUrl || null,
                // extra_data stores the new rich fields.
                // Run this once in Supabase SQL editor if the column doesn't exist:
                //   ALTER TABLE surprises ADD COLUMN IF NOT EXISTS extra_data JSONB DEFAULT '{}';
                extra_data:   { reasons, timeline },
                created_at:   new Date().toISOString(),
            }]);

        if (error) {
            console.error('Supabase error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ success: false, error: 'Failed to save surprise data' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, surpriseId }),
        };
    } catch (err) {
        console.error('Error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: 'Internal server error' }),
        };
    }
};
