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
    const webhookData = req.body;
    
    // In production, verify the webhook signature here
    console.log('Webhook received:', webhookData);
    
    if (webhookData.type === 'PAYMENT_SUCCESS_WEBHOOK') {
      const { order_id, payment_amount, payment_status } = webhookData.data;
      
      console.log(`Payment successful for order ${order_id}: ₹${payment_amount}`);
      
      // Here you would typically:
      // 1. Update database with payment status
      // 2. Grant user access to template
      // 3. Send confirmation email
    }
    
    res.status(200).json({ status: 'success' });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}