const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// In-memory user storage (replace with database in production)
let users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
    const { action } = req.body || req.query || {};

    switch (action) {
      case 'login':
        return await handleLogin(req, res);
      case 'register':
        return await handleRegister(req, res);
      case 'check-access':
        return await handleCheckAccess(req, res);
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Supported actions: login, register, check-access'
        });
    }
  } catch (error) {
    console.error('Auth handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Handle Login
async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
}

// Handle Register
async function handleRegister(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and username are required'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      username,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
}

// Handle Check Access
async function handleCheckAccess(req, res) {
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

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        message: 'Supabase configuration missing'
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

    } catch (dbError) {
      console.error('Database access error:', dbError);
      res.status(500).json({
        success: false,
        message: dbError.message || 'Failed to check access'
      });
    }

  } catch (error) {
    console.error('Check access error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to check access'
    });
  }
}