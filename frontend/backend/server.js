const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const ResumeParser = require('./resumeParser');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize resume parser
const resumeParser = new ResumeParser();

// Middleware
app.use(cors());
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