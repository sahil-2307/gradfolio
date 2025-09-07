const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseServiceKey
  });
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Transform resume data to portfolio format
function transformResumeToPortfolio(resumeData, username) {
  const { personal, about, experience, education, skills, projects, achievements } = resumeData;
  
  // Generate hero section
  const hero = {
    title: `Hi, I'm ${personal.fullName || 'Your Name'}`,
    subtitle: experience.length > 0 ? experience[0].position : 'Developer',
    description: about.paragraph1 || "I'm a passionate developer who loves building beautiful, responsive, and user-friendly applications with modern technologies.",
    ctaText: 'Get in touch',
    ctaSecondaryText: 'View my work'
  };

  // Generate about section
  const aboutSection = {
    title: 'About Me',
    description: about.paragraph2 || about.paragraph1 || "I'm a passionate full-stack developer with a love for creating beautiful, functional, and user-centered digital experiences.",
    skills: [
      ...skills.technical.map((skill, index) => ({
        name: skill,
        level: 85 + (index % 3) * 5, // Generate realistic levels
        category: 'Technical'
      })),
      ...skills.soft.map((skill, index) => ({
        name: skill,
        level: 80 + (index % 4) * 5,
        category: 'Soft Skills'
      }))
    ],
    highlights: [
      {
        title: 'Experience',
        description: `${experience.length}+ years of professional experience in software development`,
        icon: 'CodeBracketIcon'
      },
      {
        title: 'Education',
        description: education.length > 0 ? `${education[0].degree} from ${education[0].institution}` : 'Continuous learner with strong educational background',
        icon: 'AcademicCapIcon'
      },
      {
        title: 'Achievements',
        description: achievements.length > 0 ? achievements[0] : 'Delivered high-quality solutions with focus on user experience',
        icon: 'TrophyIcon'
      }
    ]
  };

  // Generate projects section
  const projectsSection = {
    title: 'Featured Projects',
    subtitle: 'Here are some of my recent works that showcase my skills and creativity',
    projects: projects.map((project, index) => ({
      id: `project-${index + 1}`,
      title: project.title,
      description: project.description,
      image: `/api/placeholder/400/300?text=${encodeURIComponent(project.title)}`, // Placeholder image
      technologies: project.technologies || [],
      liveUrl: project.link || undefined,
      githubUrl: personal.github ? `${personal.github}/${project.title.toLowerCase().replace(/\s+/g, '-')}` : undefined,
      featured: index < 3 // First 3 projects are featured
    }))
  };

  // Generate contact section
  const contact = {
    title: 'Get In Touch',
    subtitle: "I'm always open to discussing new opportunities and interesting projects",
    email: personal.email || '',
    phone: personal.phone || '',
    location: 'Remote', // Default
    socialLinks: [
      ...(personal.linkedin ? [{
        name: 'LinkedIn',
        url: personal.linkedin,
        icon: 'linkedin'
      }] : []),
      ...(personal.github ? [{
        name: 'GitHub', 
        url: personal.github,
        icon: 'github'
      }] : []),
      ...(personal.website ? [{
        name: 'Website',
        url: personal.website,
        icon: 'globe'
      }] : [])
    ]
  };

  return {
    hero,
    about: aboutSection,
    projects: projectsSection,
    contact,
    lastUpdated: new Date().toISOString()
  };
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, userId } = req.body;

    if (!username || !userId) {
      return res.status(400).json({ error: 'Username and userId are required' });
    }

    console.log('Generating portfolio for user:', { username, userId });

    if (!supabase) {
      console.error('Supabase not configured, trying localStorage fallback');
      return res.status(500).json({ 
        error: 'Database not configured. Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are set.' 
      });
    }

    // Fetch resume data from database
    const { data: resumeData, error: fetchError } = await supabase
      .from('user_resume_data')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching resume data:', fetchError);
      return res.status(404).json({ 
        error: 'Resume data not found',
        details: fetchError.message 
      });
    }

    if (!resumeData) {
      return res.status(404).json({ error: 'No resume data found for user' });
    }

    // Transform resume data to portfolio format
    const portfolioData = transformResumeToPortfolio(resumeData, username);

    console.log('Portfolio data generated successfully');

    // Generate static files or return data for client-side generation
    return res.status(200).json({
      success: true,
      portfolioData,
      message: 'Portfolio data generated successfully'
    });

  } catch (error) {
    console.error('Error generating portfolio:', error);
    return res.status(500).json({ 
      error: 'Failed to generate portfolio',
      details: error.message 
    });
  }
}