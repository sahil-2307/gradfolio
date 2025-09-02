const { Cashfree } = require('cashfree-pg-sdk-nodejs');

// Initialize Cashfree
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'production' 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

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
    const { templateId, templateName, amount } = req.body;

    if (!templateId || !templateName || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: templateId, templateName, amount'
      });
    }

    // Generate unique order ID
    const orderId = `order_${Date.now()}_${templateId}`;
    const customerId = `customer_${Date.now()}`;

    // Create customer
    const customerDetails = {
      customer_id: customerId,
      customer_name: 'Portfolio Customer',
      customer_email: 'customer@onlineportfolios.in',
      customer_phone: '+919999999999',
    };

    // Create order
    const orderDetails = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      order_note: `Payment for ${templateName} template`,
      customer_details: customerDetails,
      order_meta: {
        template_id: templateId,
        template_name: templateName,
      },
      order_expiry_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
    };

    // Create payment session
    const response = await Cashfree.PGCreateOrder('2022-09-01', orderDetails);

    if (response.data && response.data.payment_session_id) {
      res.status(200).json({
        success: true,
        paymentOrder: {
          payment_session_id: response.data.payment_session_id,
          order_id: orderId,
          order_amount: amount,
        }
      });
    } else {
      throw new Error('Failed to create payment session');
    }

  } catch (error) {
    console.error('Payment order creation failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order'
    });
  }
}