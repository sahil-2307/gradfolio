import React, { useState, useEffect, useRef } from 'react';
import './MobileHome.css';

interface MobileHomeProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const MobileHome: React.FC<MobileHomeProps> = ({ isDarkMode, toggleDarkMode }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isFloating, setIsFloating] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [showNavToggle, setShowNavToggle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update CSS variables when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  const primaryColor = isDarkMode ? '#4A9EFF' : '#1E73BE';
  const bgColor = isDarkMode ? '#1a1a2e' : '#F4F8FB';
  
  const sections = [
    {
    id: 'hero',
    title: 'Make Magic',
    subtitle: 'Start Your Portfolio Journey',
    content: 'Swipe up — your future starts here'
    },
    {
    id: 'power',
    title: 'Showcase You',
    subtitle: 'More Than Just a Portfolio',
    content: 'Turn your passion into a masterpiece'
    },
    {
    id: 'stories',
    title: 'Real Stories',
    subtitle: 'From Dreamers to Doers',
    content: 'Be inspired. Be next.'
    },
    {
    id: 'create',
    title: 'Start Creating',
    subtitle: 'It’s Your Time',
    content: 'Launch your portfolio in minutes'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollY = containerRef.current.scrollTop;
        const scrollHeight = containerRef.current.scrollHeight;
        const clientHeight = containerRef.current.clientHeight;
        const sectionHeight = window.innerHeight;
        
        const newSection = Math.min(
          Math.floor(scrollY / sectionHeight),
          sections.length - 1
        );
        setCurrentSection(newSection);
        
        // Create floating effect
        setIsFloating(scrollY % sectionHeight > sectionHeight * 0.3);
        
        // If user scrolls away from 4th page, hide the bottom nav
        if (newSection < 3 && showBottomNav) {
          setShowBottomNav(false);
        }
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

  const openPortfolioBuilder = () => {
    window.location.href = '/templates';
  };

  return (
    <>
    <div className="mobile-home" ref={containerRef}>
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

      {/* Dark Mode Toggle */}
      <button 
        className={`mobile-dark-toggle ${isDarkMode ? 'dark' : ''}`}
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      />

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
            {Array.from({ length: 20 }, (_, i) => (
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

            {/* Special Content for Each Section */}
            {section.id === 'hero' && (
              <div className="hero-stats">
                <div className="stat-bubble">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
                <div className="stat-bubble">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Graduates</div>
                </div>
              </div>
            )}

            {section.id === 'power' && (
              <div className="power-features">
                {['AI-Powered', 'Instant Setup', 'Beautiful Design', 'No Hosting Hassle'].map((feature, i) => (
                  <div 
                    key={i} 
                    className="feature-badge" 
                    style={{ 
                      animationDelay: `${i * 0.2}s`,
                      borderColor: primaryColor,
                      color: primaryColor
                    }}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            )}

            {section.id === 'stories' && (
              <div className="success-preview">
                <div className="mini-testimonial" onClick={() => window.location.href = '/mobile-testimonials'}>
                  <div className="mini-avatar">👩‍💼</div>
                  <div className="mini-text">"Got hired at Google!"</div>
                  <div className="mini-author">- Sarah Chen</div>
                  <div className="tap-hint">Tap to explore →</div>
                </div>
              </div>
            )}

            {section.id === 'create' && (
              <>
                <button 
                  className="mobile-cta-button"
                  onClick={openPortfolioBuilder}
                >
                  <span> </span>
                  <span>Create Your Portfolio</span>
                  <span>→</span>
                </button>
                
                {/* Navigation Toggle Button - hardcoded in 4th section */}
                <button 
                  className={`nav-toggle-button-inline ${showBottomNav ? 'active' : ''}`}
                  onClick={() => {
                    setShowBottomNav(!showBottomNav);
                    // Small delay to ensure nav appears smoothly
                    if (!showBottomNav) {
                      setTimeout(() => {
                        // Scroll slightly to ensure nav is visible
                        if (containerRef.current) {
                          const currentScroll = containerRef.current.scrollTop;
                          containerRef.current.scrollTo({
                            top: currentScroll - 50,
                            behavior: 'smooth'
                          });
                        }
                      }, 100);
                    }
                  }}
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  {showBottomNav ? '↓' : '↑'}
                </button>
              </>
            )}
          </div>

        </div>
      ))}

      
    </div>
    
    {/* Bottom Tab Navigation */}
    <div className={`mobile-bottom-nav ${showBottomNav ? 'visible' : 'hidden'}`}>
      <button className="tab-button active">
        <span className="tab-icon">🏠</span>
        <span className="tab-label">Home</span>
      </button>
      <button className="tab-button" onClick={() => window.location.href = '/templates'}>
        <span className="tab-icon">📝</span>
        <span className="tab-label">Create</span>
      </button>
      <button className="tab-button" onClick={() => window.location.href = '/login'}>
        <span className="tab-icon">👤</span>
        <span className="tab-label">Account</span>
      </button>
    </div>
    </>
  );
};

export default MobileHome;