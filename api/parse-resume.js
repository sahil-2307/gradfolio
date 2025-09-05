// Simple resume parser without external dependencies
const fs = require('fs');

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // For now, return mock data to test the flow
    console.log('Resume parsing request received');
    
    // Mock parsed data
    const parsedData = {
      personal: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        website: 'https://johndoe.dev'
      },
      about: {
        paragraph1: 'Experienced software developer with 5+ years in full-stack development.',
        paragraph2: 'Passionate about creating efficient and scalable web applications.'
      },
      experience: [
        {
          position: 'Senior Software Developer',
          company: 'Tech Corp',
          duration: '2021 - Present',
          description: 'Led development of multiple web applications using React and Node.js.'
        },
        {
          position: 'Software Developer',
          company: 'StartupXYZ',
          duration: '2019 - 2021',
          description: 'Developed REST APIs and frontend components for e-commerce platform.'
        }
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          year: '2019',
          description: 'Graduated with honors, focus on software engineering'
        }
      ],
      skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS'],
        soft: ['Leadership', 'Problem Solving', 'Communication', 'Team Work']
      },
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Full-stack web application with payment integration',
          technologies: ['React', 'Node.js', 'MongoDB'],
          link: 'https://github.com/johndoe/ecommerce'
        },
        {
          title: 'Task Management App',
          description: 'Real-time collaborative task management tool',
          technologies: ['React', 'Socket.io', 'Express'],
          link: 'https://github.com/johndoe/taskapp'
        }
      ],
      achievements: [
        'Led team of 5 developers on major project',
        'Improved application performance by 40%',
        'Published 3 technical articles'
      ]
    };

    console.log('Returning mock parsed data');

    res.status(200).json({
      success: true,
      message: 'Resume parsed successfully (mock data)',
      data: parsedData
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume'
    });
  }
}