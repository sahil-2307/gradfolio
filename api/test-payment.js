export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { templateId, templateName, amount } = req.body;

    // Select sandbox or production
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox";
    const baseUrl =
      environment === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    // Debug logging
    console.log('Payment API Debug:', {
      environment,
      baseUrl,
      hasAppId: !!process.env.CASHFREE_APP_ID,
      hasSecretKey: !!process.env.CASHFREE_SECRET_KEY,
      appIdPrefix: process.env.CASHFREE_APP_ID?.substring(0, 10)
    });

    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Cashfree credentials not configured',
        debug: {
          hasAppId: !!process.env.CASHFREE_APP_ID,
          hasSecretKey: !!process.env.CASHFREE_SECRET_KEY
        }
      });
    }

    // Create order with Cashfree - using correct headers per 2024 docs
    const cfRes = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2025-01-01",
      },
      body: JSON.stringify({
        order_id: `order_${Date.now()}`,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${templateId}_${Date.now()}`,
          customer_email: "test@onlineportfolios.in",
          customer_phone: "+919999999999",
        },
        order_note: `Payment for template: ${templateName}`,
      }),
    });

    // Capture raw response for debugging
    const rawText = await cfRes.text();
    console.log('Cashfree raw response:', {
      status: cfRes.status,
      statusText: cfRes.statusText,
      headers: Object.fromEntries(cfRes.headers.entries()),
      body: rawText
    });

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { raw: rawText };
    }

    if (!cfRes.ok) {
      console.error('Cashfree API error:', {
        status: cfRes.status,
        data,
        environment,
        baseUrl
      });
      
      return res.status(400).json({
        success: false,
        message: data.message || "Failed to create Cashfree order",
        debug: {
          status: cfRes.status,
          environment,
          baseUrl,
          cashfreeResponse: data
        }
      });
    }

    return res.status(200).json({
      success: true,
      paymentOrder: {
        payment_session_id: data.payment_session_id,
      },
    });
  } catch (error) {
    console.error("Cashfree order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Cashfree order failed",
    });
  }
}
