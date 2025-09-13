export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { action } = req.body || {};

    switch (action) {
      case 'create-order':
        return await createPaymentOrder(req, res);
      case 'verify':
        return await verifyPayment(req, res);
      case 'store':
        return await storePayment(req, res);
      case 'webhook':
        return await handleWebhook(req, res);
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Supported actions: create-order, verify, store, webhook'
        });
    }
  } catch (error) {
    console.error('Payment handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Initialize Cashfree (shared utility)
async function initializeCashfree() {
  const { Cashfree } = await import('cashfree-pg-sdk-nodejs');

  Cashfree.XClientId = process.env.CASHFREE_APP_ID;
  Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
  Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'production'
    ? Cashfree.Environment.PRODUCTION
    : Cashfree.Environment.SANDBOX;

  return Cashfree;
}

// Create Payment Order
async function createPaymentOrder(req, res) {
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

    const Cashfree = await initializeCashfree();

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
    const orderRequest = {
      order_id: orderId,
      order_amount: parseFloat(amount),
      order_currency: 'INR',
      customer_details: customerDetails,
      order_meta: {
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?order_id={order_id}`,
      },
      order_note: `Payment for ${templateName} template`,
      order_tags: {
        template_id: templateId,
        template_name: templateName
      }
    };

    console.log('Creating order with request:', JSON.stringify(orderRequest, null, 2));

    const response = await Cashfree.PGCreateOrder('2022-09-01', orderRequest);

    if (response.data) {
      res.status(200).json({
        success: true,
        data: {
          orderId: response.data.order_id,
          paymentSessionId: response.data.payment_session_id,
          orderStatus: response.data.order_status,
          paymentLink: response.data.payments.url
        }
      });
    } else {
      throw new Error('Failed to create order - no response data');
    }

  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order'
    });
  }
}

// Verify Payment
async function verifyPayment(req, res) {
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

    const Cashfree = await initializeCashfree();

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

// Store Payment
async function storePayment(req, res) {
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

    // In a real application, you would store this in a database
    // For now, we'll just return a success response
    res.status(200).json({
      success: true,
      message: 'Payment information stored successfully',
      data: {
        userId,
        templateId,
        planType,
        amount,
        paymentId,
        orderId,
        storedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Store payment failed:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to store payment information'
    });
  }
}

// Handle Webhook
async function handleWebhook(req, res) {
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