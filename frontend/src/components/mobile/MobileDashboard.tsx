import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileDashboard.css';

interface MobileDashboardProps {
  user: any;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  hasLinkedInData: boolean;
  linkedInData: any;
  hasResumeData: boolean;
  resumeData: any;
  stats: {
    resumesUploaded: number;
    portfoliosDeveloped: number;
    templatesAvailable: number;
    portfolioUrls: number;
  };
  loading: boolean;
  message: string;
  handleLinkedInLogin: () => void;
  addTestLinkedInData: () => void;
  handleResumeUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreatePortfolio: (templateType: string) => void;
  handleCreatePortfolioWithLinkedIn: () => void;
}

const MobileDashboard: React.FC<MobileDashboardProps> = ({
  user,
  onLogout,
  isDarkMode,
  toggleTheme,
  hasLinkedInData,
  linkedInData,
  hasResumeData,
  resumeData,
  stats,
  loading,
  message,
  handleLinkedInLogin,
  addTestLinkedInData,
  handleResumeUpload,
  handleCreatePortfolio,
  handleCreatePortfolioWithLinkedIn
}) => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isFloating, setIsFloating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const primaryColor = isDarkMode ? '#4A9EFF' : '#1E73BE';
  const bgColor = isDarkMode ? '#1a1a2e' : '#F4F8FB';

  const sections = [
    {
      id: 'welcome',
      title: 'Welcome',
      subtitle: `Hello, ${user.username}!`,
      content: 'Your portfolio dashboard'
    },
    {
      id: 'create',
      title: 'Create',
      subtitle: 'Build Your Portfolio',
      content: 'Choose your preferred method'
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      subtitle: 'Import from LinkedIn',
      content: 'Professional data import'
    },
    {
      id: 'resume',
      title: 'Resume',
      subtitle: 'Upload Your Resume',
      content: 'Automatic parsing & extraction'
    },
    {
      id: 'stats',
      title: 'Statistics',
      subtitle: 'Your Progress',
      content: 'Portfolio creation stats'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = containerRef.current.scrollTop;
        const sectionHeight = window.innerHeight;
        
        const newSection = Math.min(
          Math.floor(scrollY / sectionHeight),
          sections.length - 1
        );
        setCurrentSection(newSection);
        
        setIsFloating(scrollY % sectionHeight > sectionHeight * 0.3);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [sections.length]);

  const scrollToSection = (index: number) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mobile-dashboard" ref={containerRef}>
      {/* Floating Navigation Dots */}
      <div className="mobile-nav-dots">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`nav-dot ${index === currentSection ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
            style={{
              background: index === currentSection ? primaryColor : 'rgba(255,255,255,0.3)'
            }}
          />
        ))}
      </div>

      {/* Brand Logo */}
      <div className="mobile-brand">
        OnlinePortfolios
      </div>

      {/* Theme Toggle */}
      <button 
        className={`mobile-dark-toggle ${isDarkMode ? 'dark' : ''}`}
        onClick={toggleTheme}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      />

      {/* Logout Button */}
      <button className="mobile-logout" onClick={onLogout}>
        <i className="fas fa-sign-out-alt"></i>
      </button>

      {/* Sections */}
      {sections.map((section, index) => (
        <div
          key={section.id}
          className={`mobile-section ${index === currentSection ? 'active' : ''} ${isFloating ? 'floating' : ''}`}
          style={{
            background: bgColor,
            transform: `translateY(${index === currentSection ? (isFloating ? '-20px' : '0') : '0'})`
          }}
        >
          {/* Animated Background Elements */}
          <div className="bg-particles">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  backgroundColor: isDarkMode ? 'rgba(74, 158, 255, 0.1)' : 'rgba(30, 115, 190, 0.1)'
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="section-content">
            <div className="section-number">0{index + 1}</div>
            
            <h1 className="section-title">
              {section.title.split('').map((char, i) => (
                <span
                  key={i}
                  className="title-char"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {char}
                </span>
              ))}
            </h1>
            
            <h2 className="section-subtitle">{section.subtitle}</h2>
            <p className="section-text">{section.content}</p>

            {/* Welcome Section */}
            {section.id === 'welcome' && (
              <div className="welcome-stats">
                <div className="stat-bubble">
                  <div className="stat-number">{hasLinkedInData ? '✓' : '○'}</div>
                  <div className="stat-label">LinkedIn</div>
                </div>
                <div className="stat-bubble">
                  <div className="stat-number">{hasResumeData ? '✓' : '○'}</div>
                  <div className="stat-label">Resume</div>
                </div>
              </div>
            )}

            {/* Create Section */}
            {section.id === 'create' && (
              <div className="create-options">
                <button 
                  className="create-option-btn linkedin"
                  onClick={() => scrollToSection(2)}
                  style={{ 
                    borderColor: primaryColor,
                    color: primaryColor
                  }}
                >
                  <i className="fab fa-linkedin-in"></i>
                  LinkedIn Import
                </button>
                <button 
                  className="create-option-btn resume"
                  onClick={() => scrollToSection(3)}
                  style={{ 
                    borderColor: primaryColor,
                    color: primaryColor
                  }}
                >
                  <i className="fas fa-file-pdf"></i>
                  Resume Upload
                </button>
                <button 
                  className="create-option-btn form"
                  onClick={() => handleCreatePortfolio('landing_1')}
                  style={{ 
                    borderColor: primaryColor,
                    color: primaryColor
                  }}
                >
                  <i className="fas fa-pen-to-square"></i>
                  Manual Form
                </button>
              </div>
            )}

            {/* LinkedIn Section */}
            {section.id === 'linkedin' && (
              <div className="linkedin-section-content">
                {hasLinkedInData && linkedInData ? (
                  <div className="data-preview-mobile">
                    <div className="preview-card">
                      <h4>{linkedInData.personal?.fullName || 'LinkedIn User'}</h4>
                      <p>{linkedInData.personal?.email}</p>
                      <div className="preview-stats-mobile">
                        <span>{linkedInData.experience?.length || 0} jobs</span>
                        <span>{(linkedInData.skills?.technical?.length || 0) + (linkedInData.skills?.soft?.length || 0)} skills</span>
                      </div>
                    </div>
                    <div className="mobile-actions">
                      <button 
                        onClick={() => navigate('/linkedin-preview')} 
                        className="mobile-btn secondary"
                      >
                        <i className="fas fa-eye"></i> View Data
                      </button>
                      <button 
                        onClick={handleCreatePortfolioWithLinkedIn} 
                        className="mobile-btn primary"
                        style={{ background: primaryColor }}
                      >
                        <i className="fas fa-magic"></i> Create Portfolio
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-actions">
                    <button 
                      onClick={handleLinkedInLogin} 
                      className="mobile-btn primary linkedin-btn"
                      disabled={loading}
                    >
                      <i className="fab fa-linkedin"></i> {loading ? 'Connecting...' : 'Connect LinkedIn'}
                    </button>
                    <button 
                      onClick={addTestLinkedInData} 
                      className="mobile-btn secondary"
                      disabled={loading}
                      style={{ borderColor: primaryColor, color: primaryColor }}
                    >
                      <i className="fas fa-flask"></i> {loading ? 'Loading...' : 'Try Sample Data'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Resume Section */}
            {section.id === 'resume' && (
              <div className="resume-section-content">
                {hasResumeData && resumeData ? (
                  <div className="data-preview-mobile">
                    <div className="preview-card">
                      <h4>{resumeData.personal?.fullName || 'Resume Owner'}</h4>
                      <p>{resumeData.personal?.email}</p>
                      <div className="preview-stats-mobile">
                        <span>{resumeData.experience?.length || 0} jobs</span>
                        <span>{(resumeData.skills?.technical?.length || 0) + (resumeData.skills?.soft?.length || 0)} skills</span>
                      </div>
                    </div>
                    <div className="mobile-actions">
                      <button 
                        onClick={() => navigate(`/resume-preview?username=${user.username}`)} 
                        className="mobile-btn secondary"
                        style={{ borderColor: primaryColor, color: primaryColor }}
                      >
                        <i className="fas fa-eye"></i> View & Edit
                      </button>
                      <button 
                        onClick={() => navigate(`/resume-preview?username=${user.username}`)} 
                        className="mobile-btn primary"
                        style={{ background: primaryColor }}
                      >
                        <i className="fas fa-magic"></i> Create Portfolio
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-actions">
                    <input
                      type="file"
                      id="mobile-resume-upload"
                      accept=".pdf,.doc,.docx"
                      style={{ display: 'none' }}
                      onChange={handleResumeUpload}
                    />
                    <button 
                      onClick={() => document.getElementById('mobile-resume-upload')?.click()}
                      className="mobile-btn primary"
                      disabled={loading}
                      style={{ background: primaryColor }}
                    >
                      <i className="fas fa-upload"></i> {loading ? 'Processing...' : 'Upload Resume'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Stats Section */}
            {section.id === 'stats' && (
              <div className="stats-mobile">
                <div className="stats-grid-mobile">
                  <div className="stat-card-mobile">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <h4>{stats.resumesUploaded}</h4>
                    <p>Resumes</p>
                  </div>
                  <div className="stat-card-mobile">
                    <i className="fas fa-user-tie"></i>
                    <h4>{stats.portfoliosDeveloped}</h4>
                    <p>Portfolios</p>
                  </div>
                  <div className="stat-card-mobile">
                    <i className="fas fa-swatchbook"></i>
                    <h4>{stats.templatesAvailable}</h4>
                    <p>Templates</p>
                  </div>
                  <div className="stat-card-mobile">
                    <i className="fas fa-external-link-alt"></i>
                    <h4>{stats.portfolioUrls}</h4>
                    <p>URLs</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Message Toast */}
      {message && (
        <div className="mobile-message-toast">
          {message}
        </div>
      )}
    </div>
  );
};

export default MobileDashboard;