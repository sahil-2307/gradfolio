export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { userId, templateId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId parameter'
      });
    }

    // Use direct HTTP calls to Supabase REST API
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    console.log('Check access debug:', {
      userId,
      templateId,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      supabaseUrlPrefix: supabaseUrl?.substring(0, 20)
    });

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: 'Supabase configuration missing',
        debug: {
          hasSupabaseUrl: !!supabaseUrl,
          hasSupabaseKey: !!supabaseKey
        }
      });
    }

    try {
      // Get user's payments using direct HTTP call
      const response = await fetch(`${supabaseUrl}/rest/v1/user_payments?user_id=eq.${userId}&status=eq.completed&order=created_at.desc`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Supabase error:', errorData);
        
        if (response.status === 404) {
          // Table might not exist, return no access
          return res.status(200).json({
            success: true,
            hasBasicAccess: false,
            hasPremiumAccess: false,
            accessibleTemplates: [],
            hasTemplateAccess: false,
            payments: [],
            note: 'No payment records found'
          });
        }
        
        return res.status(500).json({
          success: false,
          message: 'Failed to check payment status'
        });
      }

      const payments = await response.json();

      // Check access logic:
      // - Basic plan (₹10): Access to templates 1 & 2
      // - Premium plan (₹99): Access to all templates
    
    let hasBasicAccess = false;
    let hasPremiumAccess = false;
    let accessibleTemplates = [];

    payments.forEach(payment => {
      if (payment.plan_type === 'basic' || payment.plan_type === 'free') {
        hasBasicAccess = true;
      }
      if (payment.plan_type === 'premium') {
        hasPremiumAccess = true;
      }
    });

    // Determine accessible templates
    if (hasPremiumAccess) {
      accessibleTemplates = [1, 2, 3, 4]; // All templates
    } else if (hasBasicAccess) {
      accessibleTemplates = [1, 2]; // Only basic templates
    }

    // Check specific template access if requested
    let hasTemplateAccess = true;
    if (templateId) {
      const templateNum = parseInt(templateId);
      hasTemplateAccess = accessibleTemplates.includes(templateNum);
    }

    res.status(200).json({
      success: true,
      hasBasicAccess,
      hasPremiumAccess,
      accessibleTemplates,
      hasTemplateAccess,
      payments: payments.map(p => ({
        id: p.id,
        template_id: p.template_id,
        plan_type: p.plan_type,
        amount: p.amount,
        created_at: p.created_at
      }))
    });

  } catch (error) {
    console.error('Check access error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause
    });
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check access',
      debug: {
        errorName: error.name,
        errorMessage: error.message
      }
    });
  }
}