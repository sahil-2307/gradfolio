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

    // 🔍 Debug log (will appear in Vercel logs)
    console.log("Cashfree Config:", {
      environment,
      baseUrl,
      hasAppId: !!process.env.CASHFREE_APP_ID,
      hasSecretKey: !!process.env.CASHFREE_SECRET_KEY,
      appIdPreview: process.env.CASHFREE_APP_ID
        ? process.env.CASHFREE_APP_ID.substring(0, 6) + "..."
        : null,
    });

    // Create order with Cashfree - using correct header case
    const cfRes = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": process.env.CASHFREE_APP_ID,
        "X-Client-Secret": process.env.CASHFREE_SECRET_KEY,
        "X-API-Version": "2022-09-01",
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
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { raw: rawText };
    }

    console.log("Cashfree API status:", cfRes.status);
    console.log("Cashfree API raw response:", rawText);

    if (!cfRes.ok) {
      return res.status(400).json({
        success: false,
        message: data.message || "Failed to create Cashfree order",
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
