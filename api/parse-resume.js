// Resume parser with PDF processing
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

// Disable body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

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
    console.log('Resume parsing request received');
    console.log('Content-Type:', req.headers['content-type']);
    
    // Parse the uploaded file
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      allowEmptyFiles: false,
      multiples: false
    });

    const [fields, files] = await form.parse(req);
    console.log('Form parsing completed');
    console.log('Fields:', fields);
    console.log('Files:', Object.keys(files));

    const uploadedFile = files.resume?.[0];
    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    console.log('File details:', {
      originalFilename: uploadedFile.originalFilename,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
      filepath: uploadedFile.filepath
    });

    // Check if file is PDF
    const isPDF = uploadedFile.mimetype === 'application/pdf' || 
                  uploadedFile.originalFilename?.toLowerCase().endsWith('.pdf');
    
    let extractedText = '';
    
    if (isPDF) {
      // Try to extract text from PDF
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(uploadedFile.filepath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
        console.log('PDF text extracted, length:', extractedText.length);
        console.log('First 500 chars:', extractedText.substring(0, 500));
      } catch (pdfError) {
        console.error('PDF parsing failed:', pdfError);
        extractedText = 'PDF_PARSING_FAILED';
      }
    } else {
      console.log('File is not PDF, attempting text extraction...');
      try {
        extractedText = fs.readFileSync(uploadedFile.filepath, 'utf8');
        console.log('Text file extracted, length:', extractedText.length);
      } catch (textError) {
        console.error('Text extraction failed:', textError);
        extractedText = 'TEXT_EXTRACTION_FAILED';
      }
    }

    // Clean up uploaded file
    try {
      fs.unlinkSync(uploadedFile.filepath);
    } catch (cleanupError) {
      console.warn('Failed to cleanup uploaded file:', cleanupError);
    }

    // Parse the extracted text
    const parsedData = parseResumeText(extractedText, uploadedFile.originalFilename);

    console.log('Resume parsing completed');
    console.log('Parsed data:', JSON.stringify(parsedData, null, 2));

    res.status(200).json({
      success: true,
      message: `Resume parsed successfully from ${uploadedFile.originalFilename}`,
      data: parsedData,
      extractedText: extractedText.substring(0, 1000) // First 1000 chars for debugging
    });

  } catch (error) {
    console.error('Resume parsing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume'
    });
  }
}

// Function to parse resume text and extract structured data
function parseResumeText(text, filename = '') {
  console.log('Parsing resume text, length:', text.length);
  
  if (text === 'PDF_PARSING_FAILED' || text === 'TEXT_EXTRACTION_FAILED') {
    return createFallbackData(filename);
  }

  // Clean and normalize text
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toLowerCase();
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Extract personal information
  const personal = extractPersonalInfo(text, lines);
  
  // Extract sections
  const about = extractAbout(text, lines);
  const experience = extractExperience(text, lines);
  const education = extractEducation(text, lines);
  const skills = extractSkills(text, lines);
  const projects = extractProjects(text, lines);
  const achievements = extractAchievements(text, lines);

  return {
    personal,
    about,
    experience,
    education,
    skills,
    projects,
    achievements
  };
}

function extractPersonalInfo(text, lines) {
  const personal = {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    website: ''
  };

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/i);
  if (emailMatch) personal.email = emailMatch[0];

  // Extract phone
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
  if (phoneMatch) personal.phone = phoneMatch[0];

  // Extract LinkedIn
  const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|linkedin\.com\/profile\/view\?id=)([\w-]+)/i);
  if (linkedinMatch) personal.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;

  // Extract GitHub
  const githubMatch = text.match(/(?:github\.com\/)([\w-]+)/i);
  if (githubMatch) personal.github = `https://github.com/${githubMatch[1]}`;

  // Extract website
  const websiteMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[\w.-]+\.(?:com|org|net|io|dev|me)\b/i);
  if (websiteMatch && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('github')) {
    personal.website = websiteMatch[0].startsWith('http') ? websiteMatch[0] : `https://${websiteMatch[0]}`;
  }

  // Extract name (usually first line or lines without email/phone)
  const firstLine = lines[0]?.trim();
  if (firstLine && !firstLine.includes('@') && !firstLine.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
    personal.fullName = firstLine;
  }

  return personal;
}

function extractAbout(text, lines) {
  const about = {
    paragraph1: '',
    paragraph2: ''
  };

  // Look for summary/objective section
  const summaryMatch = text.match(/(?:summary|objective|profile|about)[\s\S]*?(?=\n\s*(?:experience|education|skills|projects|employment))/i);
  if (summaryMatch) {
    const summaryText = summaryMatch[0].replace(/(?:summary|objective|profile|about)/i, '').trim();
    const sentences = summaryText.split('.').filter(s => s.trim().length > 10);
    if (sentences.length > 0) {
      about.paragraph1 = sentences.slice(0, 2).join('.').trim() + '.';
      if (sentences.length > 2) {
        about.paragraph2 = sentences.slice(2, 4).join('.').trim() + '.';
      }
    }
  }

  // Fallback: use first few meaningful lines
  if (!about.paragraph1) {
    const meaningfulLines = lines.filter(line => 
      line.length > 20 && 
      !line.includes('@') && 
      !line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)
    );
    
    if (meaningfulLines.length > 0) {
      about.paragraph1 = meaningfulLines.slice(0, 2).join(' ').trim();
      if (meaningfulLines.length > 2) {
        about.paragraph2 = meaningfulLines.slice(2, 4).join(' ').trim();
      }
    }
  }

  return about;
}

function extractExperience(text, lines) {
  const experience = [];
  
  // Look for experience section
  const experienceMatch = text.match(/(?:experience|employment|work history)[\s\S]*?(?=\n\s*(?:education|skills|projects|certifications))/i);
  if (experienceMatch) {
    const experienceText = experienceMatch[0];
    const jobEntries = experienceText.split(/\n\s*\n/).filter(entry => entry.trim().length > 10);
    
    jobEntries.forEach(entry => {
      const lines = entry.split('\n').filter(line => line.trim().length > 0);
      if (lines.length >= 2) {
        const job = {
          position: lines[0]?.trim() || 'Position',
          company: lines[1]?.trim() || 'Company',
          duration: extractDuration(entry) || 'Duration',
          description: lines.slice(2).join(' ').trim() || 'Job responsibilities and achievements'
        };
        experience.push(job);
      }
    });
  }
  
  return experience.slice(0, 3); // Limit to 3 entries
}

function extractEducation(text, lines) {
  const education = [];
  
  const educationMatch = text.match(/(?:education|academic|university|college|degree)[\s\S]*?(?=\n\s*(?:experience|skills|projects|certifications))/i);
  if (educationMatch) {
    const educationText = educationMatch[0];
    const degreeMatch = educationText.match(/(bachelor|master|phd|diploma|certificate|degree).+/i);
    const institutionMatch = educationText.match(/(university|college|institute|school).+/i);
    const yearMatch = educationText.match(/(19|20)\d{2}/);
    
    education.push({
      degree: degreeMatch?.[0]?.trim() || 'Degree',
      institution: institutionMatch?.[0]?.trim() || 'Institution',
      year: yearMatch?.[0] || new Date().getFullYear().toString(),
      description: 'Educational background'
    });
  }
  
  return education;
}

function extractSkills(text, lines) {
  const skills = {
    technical: [],
    soft: []
  };
  
  const skillsMatch = text.match(/(?:skills|technologies|competencies)[\s\S]*?(?=\n\s*(?:experience|education|projects|certifications))/i);
  if (skillsMatch) {
    const skillsText = skillsMatch[0].toLowerCase();
    
    // Common technical skills
    const techSkills = ['javascript', 'python', 'java', 'react', 'node', 'html', 'css', 'sql', 'git', 'aws', 'docker', 'mongodb', 'express', 'angular', 'vue', 'typescript'];
    const softSkills = ['leadership', 'communication', 'teamwork', 'problem solving', 'management', 'collaboration', 'analytical', 'creative'];
    
    techSkills.forEach(skill => {
      if (skillsText.includes(skill)) {
        skills.technical.push(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });
    
    softSkills.forEach(skill => {
      if (skillsText.includes(skill)) {
        skills.soft.push(skill.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
      }
    });
  }
  
  return skills;
}

function extractProjects(text, lines) {
  const projects = [];
  
  const projectsMatch = text.match(/(?:projects|portfolio)[\s\S]*?(?=\n\s*(?:experience|education|skills|certifications))/i);
  if (projectsMatch) {
    const projectText = projectsMatch[0];
    const projectEntries = projectText.split(/\n\s*\n/).filter(entry => entry.trim().length > 10);
    
    projectEntries.forEach(entry => {
      const lines = entry.split('\n').filter(line => line.trim().length > 0);
      if (lines.length >= 1) {
        projects.push({
          title: lines[0]?.trim() || 'Project',
          description: lines.slice(1).join(' ').trim() || 'Project description',
          technologies: extractTechnologies(entry),
          link: extractLink(entry) || ''
        });
      }
    });
  }
  
  return projects.slice(0, 3);
}

function extractAchievements(text, lines) {
  const achievements = [];
  
  const achievementsMatch = text.match(/(?:achievements|accomplishments|awards)[\s\S]*?(?=\n\s*(?:experience|education|skills|projects))/i);
  if (achievementsMatch) {
    const achievementsText = achievementsMatch[0];
    const achievementLines = achievementsText.split('\n').filter(line => 
      line.trim().length > 10 && 
      (line.includes('•') || line.includes('-') || line.includes('*'))
    );
    
    achievementLines.forEach(line => {
      const clean = line.replace(/[•\-*]/g, '').trim();
      if (clean.length > 5) {
        achievements.push(clean);
      }
    });
  }
  
  return achievements.slice(0, 5);
}

function extractDuration(text) {
  const durationMatch = text.match(/(19|20)\d{2}\s*[-–—to]*\s*(?:(19|20)\d{2}|present|current)/i);
  return durationMatch?.[0] || '';
}

function extractTechnologies(text) {
  const techPattern = /(javascript|python|java|react|node|html|css|sql|git|aws|docker|mongodb)/gi;
  const matches = text.match(techPattern) || [];
  return [...new Set(matches.map(tech => tech.charAt(0).toUpperCase() + tech.slice(1).toLowerCase()))];
}

function extractLink(text) {
  const linkMatch = text.match(/https?:\/\/[\w.-]+\.\w+[\w\/.-]*/);
  return linkMatch?.[0] || '';
}

function createFallbackData(filename) {
  return {
    personal: {
      fullName: 'Resume Holder',
      email: 'user@example.com',
      phone: '',
      linkedin: '',
      github: '',
      website: ''
    },
    about: {
      paragraph1: `Resume data extracted from ${filename}. Please update with your actual information.`,
      paragraph2: 'Add your professional summary and background here.'
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: []
    },
    projects: [],
    achievements: []
  };
}