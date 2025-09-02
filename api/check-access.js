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

    // Import Supabase client
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    // Get user's payments
    const { data: payments, error } = await supabase
      .from('user_payments')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to check payment status'
      });
    }

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
    console.error('Check access error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check access'
    });
  }
}