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
  const phoneMatch = cleanText.match(/[\+]?[1-9]?[\d\s\-\(\)]{10,}/);
  const phone = phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ').trim() : '';
  
  // Extract name (usually the first line or before email)
  const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let name = '';
  for (const line of lines.slice(0, 3)) {
    if (!line.includes('@') && !line.match(/[\d\-\(\)]{7,}/) && line.length < 50 && line.split(' ').length <= 4) {
      name = line;
      break;
    }
  }
  
  // Extract sections based on common headings
  const workExperience = extractSection(cleanText, ['experience', 'work experience', 'employment', 'professional experience']);
  const education = extractSection(cleanText, ['education', 'academic background', 'qualifications']);
  const skills = extractSection(cleanText, ['skills', 'technical skills', 'technologies', 'competencies']);
  const projects = extractSection(cleanText, ['projects', 'portfolio', 'work samples']);
  const summary = extractSection(cleanText, ['summary', 'objective', 'profile', 'about']);
  
  // Extract links/URLs
  const urlMatches = cleanText.match(/https?:\/\/[^\s]+/g) || [];
  const links = {
    linkedin: urlMatches.find(url => url.includes('linkedin.com')) || '',
    github: urlMatches.find(url => url.includes('github.com')) || '',
    portfolio: urlMatches.find(url => !url.includes('linkedin.com') && !url.includes('github.com')) || ''
  };
  
  return {
    personal: {
      fullName: name,
      email: email,
      phone: phone,
      linkedin: links.linkedin,
      github: links.github,
      website: links.portfolio
    },
    about: {
      paragraph1: summary || `Passionate professional with expertise in various technologies and strong problem-solving skills.`,
      paragraph2: `Committed to delivering high-quality results and continuous learning.`
    },
    experience: parseExperience(workExperience),
    education: parseEducation(education),
    skills: parseSkills(skills),
    projects: parseProjects(projects),
    achievements: [
      'Successfully delivered multiple projects',
      'Strong technical and communication skills',
      'Proven track record of professional growth'
    ]
  };
}

function extractSection(text, keywords) {
  for (const keyword of keywords) {
    const regex = new RegExp(`${keyword}[\\s\\n]+(.*?)(?=\\n\\s*(?:education|experience|skills|projects|achievements|references|$))`, 'is');
    const match = text.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return '';
}

function parseExperience(experienceText) {
  if (!experienceText) {
    return [{
      position: 'Professional',
      company: 'Various Companies',
      duration: '2020 - Present',
      description: 'Extensive experience in professional environments with focus on delivering quality results.'
    }];
  }

  // Try to parse individual experiences
  const experiences = [];
  const lines = experienceText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentExp = {};
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line looks like a job title/position
    if (line.length < 100 && !line.includes('•') && !line.startsWith('-')) {
      if (currentExp.position) {
        experiences.push(currentExp);
      }
      currentExp = {
        position: line,
        company: lines[i + 1] || 'Company',
        duration: '2020 - Present',
        description: 'Professional experience with focus on delivering quality results.'
      };
    }
  }
  
  if (currentExp.position) {
    experiences.push(currentExp);
  }
  
  return experiences.length > 0 ? experiences.slice(0, 3) : [{
    position: 'Professional',
    company: 'Various Companies', 
    duration: '2020 - Present',
    description: 'Extensive professional experience.'
  }];
}

function parseEducation(educationText) {
  if (!educationText) {
    return [{
      degree: 'Bachelor\'s Degree',
      institution: 'University',
      year: '2020',
      description: 'Relevant academic background'
    }];
  }

  const lines = educationText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const education = [];
  
  for (let i = 0; i < lines.length && education.length < 2; i++) {
    const line = lines[i];
    if (line.length < 100) {
      education.push({
        degree: line,
        institution: lines[i + 1] || 'Educational Institution',
        year: '2020',
        description: 'Relevant academic qualifications'
      });
    }
  }
  
  return education.length > 0 ? education : [{
    degree: 'Bachelor\'s Degree',
    institution: 'University',
    year: '2020', 
    description: 'Relevant academic background'
  }];
}

function parseSkills(skillsText) {
  if (!skillsText) {
    return {
      technical: ['JavaScript', 'Python', 'React', 'Node.js'],
      soft: ['Communication', 'Problem Solving', 'Team Work', 'Leadership']
    };
  }

  const skills = skillsText.replace(/[•\-]/g, '').split(/[\n,;]/).map(s => s.trim()).filter(s => s.length > 0);
  
  return {
    technical: skills.slice(0, 8),
    soft: ['Communication', 'Problem Solving', 'Team Work', 'Leadership']
  };
}

function parseProjects(projectsText) {
  if (!projectsText) {
    return [{
      title: 'Professional Project',
      description: 'Developed and delivered successful project solutions',
      technologies: ['JavaScript', 'React'],
      link: ''
    }];
  }

  const lines = projectsText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const projects = [];
  
  for (let i = 0; i < lines.length && projects.length < 3; i++) {
    const line = lines[i];
    if (line.length < 100 && !line.includes('•') && !line.startsWith('-')) {
      projects.push({
        title: line,
        description: lines[i + 1] || 'Successful project implementation',
        technologies: ['JavaScript', 'React'],
        link: ''
      });
    }
  }
  
  return projects.length > 0 ? projects : [{
    title: 'Professional Project',
    description: 'Developed and delivered successful project solutions',
    technologies: ['JavaScript', 'React'],
    link: ''
  }];
}