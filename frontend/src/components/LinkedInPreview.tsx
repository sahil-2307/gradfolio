import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthService } from '../services/authService';
import './LinkedInPreview.css';

interface LinkedInData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
  };
  about: {
    paragraph1: string;
    paragraph2: string;
  };
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    description: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link: string;
  }>;
  achievements: string[];
}

const LinkedInPreview: React.FC = () => {
  const navigate = useNavigate();
  const [linkedInData, setLinkedInData] = useState<LinkedInData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLinkedInData = async () => {
      try {
        // Check if user is authenticated
        const user = await AuthService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }

        // Get LinkedIn data from localStorage or API
        const storedData = localStorage.getItem(`linkedin_data_${user.username}`);
        if (storedData) {
          const data = JSON.parse(storedData);
          setLinkedInData(data);
        } else {
          setError('No LinkedIn data found. Please import your LinkedIn profile first.');
        }
      } catch (err) {
        setError('Error loading LinkedIn data');
        console.error('LinkedIn data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLinkedInData();
  }, [navigate]);

  const handleCreatePortfolio = () => {
    if (linkedInData) {
      // Store data for portfolio creation
      localStorage.setItem('portfolio_prefill_data', JSON.stringify(linkedInData));
      navigate('/templates');
    }
  };

  const handleEditData = () => {
    // Navigate to a form where user can edit the LinkedIn data
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="linkedin-preview-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading LinkedIn data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="linkedin-preview-container">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!linkedInData) {
    return (
      <div className="linkedin-preview-container">
        <div className="no-data-message">
          <i className="fab fa-linkedin"></i>
          <h2>No LinkedIn Data Available</h2>
          <p>Import your LinkedIn profile to see a preview of your data.</p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Import LinkedIn Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="linkedin-preview-container">
      <header className="preview-header">
        <div className="header-content">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1><i className="fab fa-linkedin"></i> LinkedIn Data Preview</h1>
          <div className="header-actions">
            <button onClick={handleEditData} className="btn btn-secondary">
              <i className="fas fa-edit"></i> Edit Data
            </button>
            <button onClick={handleCreatePortfolio} className="btn btn-primary">
              <i className="fas fa-magic"></i> Create Portfolio
            </button>
          </div>
        </div>
      </header>

      <div className="preview-content">
        {/* Personal Information */}
        <section className="data-section">
          <h2><i className="fas fa-user"></i> Personal Information</h2>
          <div className="data-grid">
            <div className="data-item">
              <label>Full Name:</label>
              <span>{linkedInData.personal.fullName}</span>
            </div>
            <div className="data-item">
              <label>Email:</label>
              <span>{linkedInData.personal.email}</span>
            </div>
            <div className="data-item">
              <label>LinkedIn:</label>
              <span>
                <a href={linkedInData.personal.linkedin} target="_blank" rel="noopener noreferrer">
                  {linkedInData.personal.linkedin}
                </a>
              </span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="data-section">
          <h2><i className="fas fa-info-circle"></i> About</h2>
          <div className="about-content">
            <p>{linkedInData.about.paragraph1}</p>
            <p>{linkedInData.about.paragraph2}</p>
          </div>
        </section>

        {/* Experience Section */}
        <section className="data-section">
          <h2><i className="fas fa-briefcase"></i> Experience</h2>
          <div className="experience-list">
            {linkedInData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="experience-header">
                  <h3>{exp.position}</h3>
                  <div className="experience-meta">
                    <span className="company">{exp.company}</span>
                    <span className="duration">{exp.duration}</span>
                  </div>
                </div>
                <p className="experience-description">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section className="data-section">
          <h2><i className="fas fa-code"></i> Skills</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Technical Skills</h3>
              <div className="skill-tags">
                {linkedInData.skills.technical.map((skill, index) => (
                  <span key={index} className="skill-tag technical">{skill}</span>
                ))}
              </div>
            </div>
            <div className="skill-category">
              <h3>Soft Skills</h3>
              <div className="skill-tags">
                {linkedInData.skills.soft.map((skill, index) => (
                  <span key={index} className="skill-tag soft">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        {linkedInData.projects.length > 0 && (
          <section className="data-section">
            <h2><i className="fas fa-folder-open"></i> Projects</h2>
            <div className="projects-list">
              {linkedInData.projects.map((project, index) => (
                <div key={index} className="project-item">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Section */}
        {linkedInData.achievements.length > 0 && (
          <section className="data-section">
            <h2><i className="fas fa-trophy"></i> Achievements</h2>
            <ul className="achievements-list">
              {linkedInData.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};

export default LinkedInPreview;