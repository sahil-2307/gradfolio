require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const ResumeParser = require('./resumeParser');
const { Cashfree } = require('cashfree-pg-sdk-nodejs');

// Initialize Cashfree
Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'production' 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize resume parser
const resumeParser = new ResumeParser();

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://onlineportfolios.vercel.app',
    'https://onlineportfolios.in',
    'https://*.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only PDF and Word documents
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'), false);
    }
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Resume Parser API is running' });
});

// Resume parsing endpoint
app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log('Processing file:', {
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Parse the resume
    const parsedData = await resumeParser.parseFile(req.file.buffer, req.file.mimetype);

    res.json({
      success: true,
      data: {
        fileName: req.file.originalname,
        fileSize: req.file.size,
        parsedData
      }
    });

  } catch (error) {
    console.error('Error parsing resume:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Error parsing resume'
    });
  }
});

// Template data mapping endpoint
app.post('/api/map-to-template', async (req, res) => {
  try {
    const { parsedData, templateId } = req.body;

    if (!parsedData) {
      return res.status(400).json({
        success: false,
        error: 'No parsed data provided'
      });
    }

    // Map parsed data to template format
    const templateData = mapDataToTemplate(parsedData, templateId);

    res.json({
      success: true,
      data: templateData
    });

  } catch (error) {
    console.error('Error mapping to template:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Error mapping data to template'
    });
  }
});

// Function to map parsed data to template format
function mapDataToTemplate(parsedData, templateId = 1) {
  const templateData = {
    // Basic info
    name: parsedData.personalInfo?.name || 'Your Name',
    email: parsedData.personalInfo?.email || 'your.email@example.com',
    phone: parsedData.personalInfo?.phone || '+1 (555) 123-4567',
    location: parsedData.personalInfo?.location || 'Your City, Country',
    
    // Links
    linkedin: parsedData.personalInfo?.linkedin || '',
    github: parsedData.personalInfo?.github || '',
    
    // About/Summary
    about: parsedData.summary || 'Professional summary will be added here.',
    
    // Experience
    experience: parsedData.experience?.map(exp => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      duration: exp.duration,
      description: exp.description,
      highlights: exp.description ? [exp.description] : []
    })) || [],
    
    // Education
    education: parsedData.education?.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
      gpa: edu.gpa,
      details: edu.details || []
    })) || [],
    
    // Skills
    skills: {
      technical: parsedData.skills?.technical || [],
      tools: parsedData.skills?.soft || [],
      languages: [], // Could be extracted separately
      frameworks: [] // Could be extracted separately
    },
    
    // Projects
    projects: parsedData.projects?.map(project => ({
      name: project.name,
      description: project.description,
      technologies: project.technologies || [],
      link: project.link,
      github: project.link?.includes('github') ? project.link : '',
      demo: project.link && !project.link.includes('github') ? project.link : ''
    })) || [],
    
    // Certifications
    certifications: parsedData.certifications?.map(cert => ({
      name: cert,
      issuer: '', // Could be extracted with more sophisticated parsing
      date: '', // Could be extracted with more sophisticated parsing
      link: ''
    })) || [],
    
    // Template-specific settings
    theme: getThemeByTemplate(templateId),
    layout: getLayoutByTemplate(templateId)
  };

  return templateData;
}

function getThemeByTemplate(templateId) {
  const themes = {
    1: { primaryColor: '#1E73BE', secondaryColor: '#FFD700' },
    2: { primaryColor: '#667eea', secondaryColor: '#764ba2' },
    3: { primaryColor: '#1E73BE', secondaryColor: '#0F4C81' }
  };
  
  return themes[templateId] || themes[1];
}

function getLayoutByTemplate(templateId) {
  const layouts = {
    1: { style: 'modern', sections: ['hero', 'about', 'experience', 'projects', 'skills', 'education'] },
    2: { style: 'creative', sections: ['hero', 'portfolio', 'about', 'experience', 'skills'] },
    3: { style: 'corporate', sections: ['hero', 'summary', 'experience', 'education', 'skills'] }
  };
  
  return layouts[templateId] || layouts[1];
}

// Payment endpoint - Create payment order
app.post('/api/create-payment-order', async (req, res) => {
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
      res.json({
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
});

// Payment verification endpoint
app.post('/api/verify-payment', async (req, res) => {
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
        res.json({
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
        res.json({
          success: false,
          paymentStatus: payment.payment_status,
          message: 'Payment not successful'
        });
      }
    } else {
      res.json({
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
});

// Webhook endpoint for payment status updates
app.post('/api/webhook/cashfree', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const payload = req.body;
    
    // In production, verify the webhook signature here
    console.log('Webhook received:', payload);
    
    // Process webhook data
    const webhookData = JSON.parse(payload.toString());
    
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
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Resume Parser API running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📄 Parse endpoint: http://localhost:${PORT}/api/parse-resume`);
});

module.exports = app;