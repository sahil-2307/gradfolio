const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}
if (!fs.existsSync('uploads/profiles')) {
  fs.mkdirSync('uploads/profiles', { recursive: true });
}
if (!fs.existsSync('uploads/resumes')) {
  fs.mkdirSync('uploads/resumes', { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profilePhoto') {
      cb(null, 'uploads/profiles/');
    } else if (file.fieldname === 'resume') {
      cb(null, 'uploads/resumes/');
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'profilePhoto') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Profile photo must be an image file'));
      }
    } else if (file.fieldname === 'resume') {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Resume must be a PDF file'));
      }
    } else {
      cb(new Error('Invalid file field'));
    }
  }
});

// In-memory database (simple array for POC)
let users = [];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'GradGen API is running!' });
});

// Submit user profile data
app.post('/api/profile', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), (req, res) => {
  try {
    const {
      username,
      name,
      bio,
      graduationYear,
      university,
      email,
      phone,
      skills,
      socialLinks,
      template,
      projects,
      experiences
    } = req.body;

    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create user profile
    const userProfile = {
      id: Date.now().toString(),
      username,
      name,
      bio,
      graduationYear,
      university,
      email,
      phone: phone || null,
      skills: skills ? JSON.parse(skills) : [],
      socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
      template: template || 'modern',
      projects: projects ? JSON.parse(projects) : [],
      experiences: experiences ? JSON.parse(experiences) : [],
      profilePhoto: req.files['profilePhoto'] ? req.files['profilePhoto'][0].filename : null,
      resume: req.files['resume'] ? req.files['resume'][0].filename : null,
      isPremium: false,
      createdAt: new Date().toISOString()
    };

    users.push(userProfile);

    res.status(201).json({
      message: 'Profile created successfully',
      user: userProfile
    });
  } catch (error) {
    console.error('Profile creation error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Get user profile by username
app.get('/api/profile/:username', (req, res) => {
  const { username } = req.params;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Get all users (for debugging)
app.get('/api/users', (req, res) => {
  res.json(users.map(user => ({
    username: user.username,
    name: user.name,
    isPremium: user.isPremium,
    createdAt: user.createdAt
  })));
});

// Update user to premium
app.post('/api/profile/:username/premium', (req, res) => {
  const { username } = req.params;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.isPremium = true;
  res.json({ message: 'User upgraded to premium', user });
});

// Stripe webhook (simplified for POC)
app.post('/api/stripe/webhook', express.raw({type: 'application/json'}), (req, res) => {
  // In a real implementation, you'd verify the webhook signature
  const event = JSON.parse(req.body);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const username = session.metadata?.username;
    
    if (username) {
      const user = users.find(u => u.username === username);
      if (user) {
        user.isPremium = true;
      }
    }
  }
  
  res.json({received: true});
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  
  res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});