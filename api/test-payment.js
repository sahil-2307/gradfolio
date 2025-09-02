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

    // Debug logs for env vars
    console.log("Cashfree Config:", {
      environment: process.env.CASHFREE_ENVIRONMENT,
      hasAppId: !!process.env.CASHFREE_APP_ID,
      hasSecretKey: !!process.env.CASHFREE_SECRET_KEY,
      appIdPreview: process.env.CASHFREE_APP_ID
        ? process.env.CASHFREE_APP_ID.slice(0, 4) + "..."
        : null,
    });

    // Select sandbox or production
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox";
    const baseUrl =
      environment === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    // Create order with Cashfree
    const cfRes = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01", // required
      },
      body: JSON.stringify({
        order_id: `order_${Date.now()}`,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${templateId}_${Date.now()}`,
          customer_email: "test@example.com", // replace with real user email
          customer_phone: "9999999999", // replace with real user phone
        },
        order_note: `Payment for template: ${templateName}`,
      }),
    });

    const rawText = await cfRes.text(); // log raw response
    console.log("Cashfree API status:", cfRes.status);
    console.log("Cashfree API raw response:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { message: rawText };
    }

    if (!cfRes.ok) {
      return res.status(400).json({
        success: false,
        message: data.message || "Failed to create Cashfree order",
      });
    }

    // ✅ Match frontend expectation
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
