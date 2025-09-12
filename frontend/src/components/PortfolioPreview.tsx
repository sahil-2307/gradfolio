import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './PortfolioPreview.css';

interface PortfolioData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaSecondaryText: string;
  };
  about: {
    title: string;
    description: string;
    skills: Array<{
      name: string;
      level: number;
      category: string;
    }>;
    highlights: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  projects: {
    title: string;
    subtitle: string;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      image: string;
      technologies: string[];
      liveUrl?: string;
      githubUrl?: string;
      featured: boolean;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    socialLinks: Array<{
      name: string;
      url: string;
      icon: string;
    }>;
  };
  lastUpdated: string;
}

const PortfolioPreview: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('default');

  useEffect(() => {
    const username = searchParams.get('username');
    const template = searchParams.get('template') || 'default';
    setSelectedTemplate(template);
    
    if (username) {
      loadPortfolioData(username);
    }
  }, [searchParams]);

  const loadPortfolioData = (username: string) => {
    try {
      console.log('=== Portfolio Data Loading Debug ===');
      console.log('Looking for portfolio data with key:', `portfolio_data_${username}`);
      
      // Check all localStorage keys for debugging
      const allKeys = Object.keys(localStorage);
      console.log('All localStorage keys:', allKeys);
      const portfolioKeys = allKeys.filter(key => key.startsWith('portfolio_data_'));
      console.log('Portfolio data keys found:', portfolioKeys);
      
      const data = localStorage.getItem(`portfolio_data_${username}`);
      console.log('Retrieved data:', data ? 'Found' : 'Not found');
      
      if (data) {
        const parsedData = JSON.parse(data);
        console.log('Parsed portfolio data structure:', {
          hasHero: !!parsedData.hero,
          hasAbout: !!parsedData.about,
          hasProjects: !!parsedData.projects,
          hasContact: !!parsedData.contact,
          heroTitle: parsedData.hero?.title,
          aboutSkills: parsedData.about?.skills?.length || 0,
          projectsCount: parsedData.projects?.projects?.length || 0
        });
        setPortfolioData(parsedData);
      } else {
        console.log('No portfolio data found for username:', username);
        // Try to find any portfolio data with similar username patterns
        const similarKeys = allKeys.filter(key => 
          key.includes('portfolio_data') && key.toLowerCase().includes(username.toLowerCase())
        );
        console.log('Similar keys found:', similarKeys);
        
        if (similarKeys.length > 0) {
          console.log('Attempting to use first similar key:', similarKeys[0]);
          const alternativeData = localStorage.getItem(similarKeys[0]);
          if (alternativeData) {
            const parsedData = JSON.parse(alternativeData);
            console.log('Using alternative data:', parsedData);
            setPortfolioData(parsedData);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderModernProfessionalTemplate = () => {
    if (!portfolioData) {
      console.log('No portfolio data available for Modern Professional template');
      return (
        <div style={{ 
          width: '100%', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2>Loading Portfolio Data...</h2>
          <p>Please wait while we load your portfolio information.</p>
        </div>
      );
    }

    // Transform portfolio data to Modern Professional format
    const modernData = transformToModernFormat(portfolioData);
    console.log('Rendering Modern Professional with data:', modernData);
    
    // Encode the data for URL transmission
    const encodedData = encodeURIComponent(JSON.stringify(modernData));
    const iframeSrc = `/portfolio-templates/modern-professional/index.html?data=${encodedData}`;
    
    console.log('Iframe source:', iframeSrc);
    console.log('Data length:', encodedData.length);
    
    return (
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <iframe
          src={iframeSrc}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            display: 'block'
          }}
          title="Modern Professional Portfolio"
          onLoad={() => console.log('Modern Professional iframe loaded')}
        />
      </div>
    );
  };

  const transformToModernFormat = (data: PortfolioData) => {
    console.log('Transforming portfolio data:', data);
    
    // Extract name from hero title (remove "Hi, I'm " prefix if present)
    const name = data.hero.title.replace(/^Hi,?\s*I'?m\s*/, '') || 'Professional Name';
    
    // Get technical and soft skills
    const technicalSkills = data.about.skills
      .filter(skill => skill.category.toLowerCase().includes('technical') || skill.category === 'Technical')
      .map(skill => skill.name);
    
    const softSkills = data.about.skills
      .filter(skill => skill.category.toLowerCase().includes('soft') || skill.category === 'Soft Skills')
      .map(skill => skill.name);
    
    const transformedData = {
      name: name,
      title: data.hero.subtitle || 'Professional',
      shortBio: data.hero.description || 'Passionate professional creating innovative solutions.',
      email: data.contact.email || 'contact@email.com',
      phone: data.contact.phone || '+1 (555) 123-4567',
      location: data.contact.location || 'Location',
      linkedin: data.contact.socialLinks.find(link => link.name.toLowerCase().includes('linkedin'))?.url || '',
      github: data.contact.socialLinks.find(link => link.name.toLowerCase().includes('github'))?.url || '',
      website: data.contact.socialLinks.find(link => link.name.toLowerCase().includes('website') || link.name.toLowerCase().includes('portfolio'))?.url || '',
      twitter: data.contact.socialLinks.find(link => link.name.toLowerCase().includes('twitter'))?.url || '',
      instagram: data.contact.socialLinks.find(link => link.name.toLowerCase().includes('instagram'))?.url || '',
      aboutParagraph1: data.about.description || 'I am a passionate professional with extensive experience in my field.',
      aboutParagraph2: data.about.highlights && data.about.highlights.length > 0 
        ? data.about.highlights.map(h => h.description).join(' ') 
        : 'I specialize in delivering high-quality results and building meaningful professional relationships.',
      skills: {
        technical: technicalSkills.length > 0 ? technicalSkills : ['Professional Skills', 'Problem Solving', 'Communication'],
        soft: softSkills.length > 0 ? softSkills : ['Leadership', 'Team Collaboration', 'Adaptability']
      },
      experience: data.projects.projects.length > 0 ? [
        {
          position: data.hero.subtitle || 'Professional Role',
          company: 'Current Company',
          duration: '2022 - Present',
          description: data.about.description || 'Leading projects and delivering exceptional results.'
        }
      ] : [
        {
          position: 'Professional Role',
          company: 'Company Name',
          duration: '2022 - Present',
          description: 'Leading innovative projects and delivering exceptional results in a dynamic environment.'
        }
      ],
      projects: data.projects.projects.map(project => ({
        title: project.title || 'Project Title',
        description: project.description || 'Project description',
        technologies: Array.isArray(project.technologies) ? project.technologies : ['Technology'],
        link: project.liveUrl || '',
        github: project.githubUrl || ''
      }))
    };
    
    console.log('Transformed data for Modern Professional template:', transformedData);
    return transformedData;
  };

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="portfolio-loading-content">
          <div className="portfolio-loading-spinner"></div>
          <p>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    const username = searchParams.get('username');
    return (
      <div className="portfolio-error">
        <div className="portfolio-error-content">
          <h2>Portfolio Not Found</h2>
          <p>
            Unable to load portfolio data for <strong>{username}</strong>.
          </p>
          <p className="error-description">
            This might happen if the portfolio data wasn't properly generated or stored. 
            Please go back to the resume editor and try generating the portfolio again.
          </p>
          <div className="portfolio-error-actions">
            <button
              onClick={() => window.close()}
              className="portfolio-error-btn primary"
            >
              Close This Tab
            </button>
            <button
              onClick={() => window.close()}
              className="portfolio-error-btn secondary"
            >
              Back to Resume Editor (Close Tab)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Modern Professional template if selected
  if (selectedTemplate === 'modern') {
    return renderModernProfessionalTemplate();
  }

  return (
    <div className={`portfolio-container${isDarkMode ? ' dark' : ''}`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="portfolio-theme-toggle"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-bg"></div>
        <div className="portfolio-hero-content">
          <h1>{portfolioData.hero.title}</h1>
          <p className="subtitle">{portfolioData.hero.subtitle}</p>
          <p className="description">{portfolioData.hero.description}</p>
          <div className="portfolio-hero-actions">
            <button className="portfolio-btn primary">
              {portfolioData.hero.ctaText}
            </button>
            <button className="portfolio-btn outline">
              {portfolioData.hero.ctaSecondaryText}
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="portfolio-section alt">
        <div className="portfolio-container-inner">
          <div className="portfolio-section-header">
            <h2>{portfolioData.about.title}</h2>
            <p className="section-subtitle">{portfolioData.about.description}</p>
          </div>

          {/* Highlights */}
          <div className="portfolio-grid-3" style={{ marginBottom: '4rem' }}>
            {portfolioData.about.highlights.map((highlight, index) => (
              <div key={index} className="portfolio-card">
                <div className="portfolio-card-icon">
                  <span>🔧</span>
                </div>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem', color: 'var(--text-dark, #333)' }}>
              Technical Skills
            </h3>
            <div className="portfolio-grid-2">
              {portfolioData.about.skills.map((skill, index) => (
                <div key={index} className="portfolio-skill-item">
                  <div className="portfolio-skill-header">
                    <span className="portfolio-skill-name">{skill.name}</span>
                    <span className="portfolio-skill-level">{skill.level}%</span>
                  </div>
                  <div className="portfolio-skill-bar">
                    <div
                      className="portfolio-skill-progress"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="portfolio-section">
        <div className="portfolio-container-inner">
          <div className="portfolio-section-header">
            <h2>{portfolioData.projects.title}</h2>
            <p className="section-subtitle">{portfolioData.projects.subtitle}</p>
          </div>

          <div className="portfolio-grid-3">
            {portfolioData.projects.projects.map((project) => (
              <div key={project.id} className="portfolio-project-card">
                <div className="portfolio-project-image">
                  <span>Project Image</span>
                </div>
                <div className="portfolio-project-content">
                  <h3 className="portfolio-project-title">{project.title}</h3>
                  <p className="portfolio-project-description">{project.description}</p>
                  <div className="portfolio-tech-tags">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="portfolio-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="portfolio-project-links">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-project-link"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="portfolio-project-link"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="portfolio-section alt">
        <div className="portfolio-container-inner">
          <div className="portfolio-section-header">
            <h2>{portfolioData.contact.title}</h2>
            <p className="section-subtitle">{portfolioData.contact.subtitle}</p>
          </div>
          
          <div className="portfolio-contact-grid">
            <div className="portfolio-contact-card">
              <h3>Email</h3>
              <p>{portfolioData.contact.email}</p>
            </div>
            <div className="portfolio-contact-card">
              <h3>Phone</h3>
              <p>{portfolioData.contact.phone}</p>
            </div>
            <div className="portfolio-contact-card">
              <h3>Location</h3>
              <p>{portfolioData.contact.location}</p>
            </div>
          </div>

          <div className="portfolio-social-links">
            {portfolioData.contact.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-social-link"
              >
                {link.name.charAt(0)}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="portfolio-footer">
        <div className="portfolio-footer-content">
          <p>
            Generated with Gradfolio • Last updated: {new Date(portfolioData.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPreview;