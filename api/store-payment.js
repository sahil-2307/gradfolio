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

    // Add debug logging
    console.log('Store payment request:', {
      userId,
      templateId,
      planType,
      amount,
      paymentId,
      orderId
    });

    // Use direct HTTP calls to Supabase REST API
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: 'Supabase configuration missing'
      });
    }

    const paymentData = {
      user_id: userId,
      template_id: templateId,
      plan_type: planType === 'free' ? 'basic' : planType,
      amount: amount,
      payment_id: paymentId,
      order_id: orderId,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    // Store payment record using direct HTTP call
    console.log('Making request to:', `${supabaseUrl}/rest/v1/user_payments`);
    console.log('Request headers:', {
      'Content-Type': 'application/json',
      'apikey': supabaseKey ? 'present' : 'missing',
      'Authorization': supabaseKey ? 'present' : 'missing',
      'Prefer': 'return=representation'
    });
    console.log('Request body:', JSON.stringify(paymentData));

    const response = await fetch(`${supabaseUrl}/rest/v1/user_payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(paymentData)
    });

    console.log('Supabase response status:', response.status);
    console.log('Supabase response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Supabase error response:', errorData);
      
      if (errorData.includes('user_payments') || response.status === 404) {
        return res.status(500).json({
          success: false,
          message: 'Database table user_payments does not exist. Please create it in Supabase.',
          error: errorData,
          createTable: true
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to store payment record',
        error: errorData
      });
    }

    const data = await response.json();
    console.log('Supabase success response:', data);
    
    // Update user's subscription status
    try {
      await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          subscription_plan: planType === 'free' ? 'basic' : planType,
          updated_at: new Date().toISOString()
        })
      });
    } catch (updateError) {
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