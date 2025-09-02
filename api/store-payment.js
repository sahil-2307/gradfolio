export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { userId, templateId, planType, amount, paymentId, orderId } = req.body;

    if (!userId || !templateId || !planType || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, templateId, planType, amount'
      });
    }

    // Import Supabase client
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Add debug logging
    console.log('Store payment request:', {
      userId,
      templateId,
      planType,
      amount,
      paymentId,
      orderId
    });

    // Store payment record
    const { data, error } = await supabase
      .from('user_payments')
      .insert([
        {
          user_id: userId,
          template_id: templateId,
          plan_type: planType, // 'basic' or 'premium'
          amount: amount,
          payment_id: paymentId,
          order_id: orderId,
          status: 'completed',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // If table doesn't exist, provide helpful error message
      if (error.code === 'PGRST116' || error.message.includes('user_payments')) {
        return res.status(500).json({
          success: false,
          message: 'Database table user_payments does not exist. Please create it in Supabase.',
          error: error.message,
          createTable: true
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to store payment record',
        error: error.message
      });
    }

    // Update user's subscription status
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        subscription_plan: planType,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('User update error:', updateError);
      // Don't fail the request, payment is already stored
    }

    res.status(200).json({
      success: true,
      message: 'Payment stored successfully',
      data: data
    });

  } catch (error) {
    console.error('Store payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to store payment'
    });
  }
}