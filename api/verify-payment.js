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
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Verify payment with Cashfree
    const response = await Cashfree.PGOrderFetchPayments('2022-09-01', orderId);

    if (response.data && response.data.length > 0) {
      const payment = response.data[0];
      
      if (payment.payment_status === 'SUCCESS') {
        // Payment successful
        res.status(200).json({
          success: true,
          paymentStatus: 'SUCCESS',
          paymentDetails: {
            orderId: orderId,
            paymentId: payment.cf_payment_id,
            amount: payment.payment_amount,
            method: payment.payment_method,
            time: payment.payment_time
          }
        });
      } else {
        res.status(200).json({
          success: false,
          paymentStatus: payment.payment_status,
          message: 'Payment not successful'
        });
      }
    } else {
      res.status(200).json({
        success: false,
        message: 'Payment not found'
      });
    }

  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to verify payment'
    });
  }
}