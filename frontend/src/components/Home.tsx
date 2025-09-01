import React, { useState, useEffect, lazy, Suspense } from 'react';
import ThreeBackground from './ThreeBackground';
import './Home.css';

const Testimonials = lazy(() => import('./Testimonials'));

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark-theme');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  const openPortfolioBuilder = () => {
    // Navigate to template selector
    window.location.href = '/templates';
  };

  return (
    <div className="home">
      <ThreeBackground isPremium={false} />
      
      {/* Hero Section */}
      <section className="hero-section">
        <nav className="navbar">
          <div className="nav-brand">
            <div className="brand-logo">O</div>
            <span className="brand-text">nlinePortfolios</span>
          </div>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#testimonials">Success Stories</a>
            <button className="dark-mode-toggle" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <a href="/login" className="login-link">Login</a>
            <button className="cta-nav-button" onClick={openPortfolioBuilder}>
              Create Portfolio
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-title">
              <h1>Create Your</h1>
              <h1>Professional</h1>
              <h1>Portfolio.</h1>
              <div className="title-accent"></div>
            </div>
            
            <div className="hero-description">
              <h2>Introduction</h2>
              <h3>Generate stunning portfolios that land you dream jobs in minutes.</h3>
              <h4>No Code, No Hosting Hassles</h4>
              <p>
                Join thousands of successful graduates who've used OnlinePortfolios to automatically 
                generate professional portfolios that impressed recruiters at top companies 
                like Google, Microsoft, and Netflix. Get your own custom URL like 
                <strong> onlineportfolios.in/yourname</strong>.
              </p>
              <button className="my-story-btn" onClick={openPortfolioBuilder}>
                Create Your Story →
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image-container">
              {/* <div className="hero-image">
                <div className="profile-placeholder">
                  <div className="avatar-placeholder">
                    👩‍💼
                  </div>
                  <div className="profile-info">
                    <h4>Sarah Chen</h4>
                    <p>Software Engineer at Google</p>
                    <p>Stanford University • Class of 2023</p>
                  </div>
                </div>
              </div> */}
              
              <div className="floating-cards">
                <div className="project-card-preview">
                  <h5>Advantages</h5>
                  <div className="project-items">
                    
                    <div className="project-item-small">Instant setup</div>
                    <div className="project-item-small">No tech skills needed</div>
                    <div className="project-item-small">Free custom URL</div>
                    <div className="project-item-small">No expensive hosting fees</div>
                  </div>
                </div>
                
                <div className="stats-card">
                  <div className="stat-item">
                    <span className="stat-number">95%</span>
                    <span className="stat-label">Interview Rate</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">10k+</span>
                    <span className="stat-label">Students Placed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <div className="section-header">
            <h2>Why Choose US?</h2>
            <p>To build your future, not just a portfolio.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Beautiful Templates</h3>
              <p>Choose from professionally designed templates with custom color schemes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Project Showcase</h3>
              <p>Display your projects with live demos, code links, and technology stacks</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Leadership Highlights</h3>
              <p>Showcase extracurricular activities, leadership roles, and achievements</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Generation</h3>
              <p>Generate your portfolio online in minutes with our AI-powered process</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Custom Professional URLs</h3>
              <p>Get a clean, professional URL like <strong>onlineportfolios.in/yourname</strong> that's perfect for resumes and business cards</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧩</div>
              <h3>Custom Sections</h3>
              <p>Add personalized sections like blogs, certifications, or volunteer work to make your portfolio stand out</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials moved below */}
      <Suspense fallback={
        <div style={{ 
          padding: '4rem 2rem', 
          textAlign: 'center', 
          color: 'var(--text-body)',
          background: 'var(--bg-primary)'
        }}>
          Loading testimonials...
        </div>
      }>
        <Testimonials />
      </Suspense>

      {/* Contact Section */}
      <section id = 'contact'  className="contact-section">
        <div className="contact-content">
          <div className="contact-left">
            <h2>— Contact</h2>
            <h3>Ready to Generate Your Portfolio?</h3>
            <h3>Let's Get Started.</h3>
            <p>
              Join the thousands of graduates who have successfully landed their 
              dream jobs using OnlinePortfolios. Generate your professional portfolio today
              and get your own custom URL at onlineportfolios.in.
            </p>
            <a href="mailto:hello@onlineportfolios.in" className="contact-email">
              hello@onlineportfolios.in →
            </a>
          </div>
          
          <div className="contact-right">
            <div className="contact-stats">
              <div className="contact-stat">
                <span className="contact-number">50+</span>
                <span className="contact-label">Companies Hiring</span>
              </div>
              <div className="contact-stat">
                <span className="contact-number">95%</span>
                <span className="contact-label">Success Rate</span>
              </div>
            </div>
            
            <div className="faq-section">
              <h4>Frequently Asked Questions</h4>
              <div className="faq-item">
                <span>How long does it take to create a portfolio?</span>
                <span>→</span>
              </div>
              <div className="faq-item">
                <span>Can I customize the design and colors?</span>
                <span>→</span>
              </div>
              <div className="faq-item">
                <span>Is there a premium version available?</span>
                <span>→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="services-section">
        
        <div className="services-grid">
          
          <div className="service-card primary">
            <div className="service-icon">👨‍💻</div>
            <h3>For Developers</h3>
            <span className="project-count">Show off your code</span>
          </div>
          
          <div className="service-card secondary">
            <div className="service-icon">🎨</div>
            <h3>For Designers</h3>
            <span className="project-count">Showcase your creativity</span>
          </div>
          
          <div className="service-card tertiary">
            <div className="service-icon">📊</div>
            <h3>For Analysts</h3>
            <span className="project-count">Display your insights</span>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-logo">O</div>
            <span>OnlinePortfolios</span>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#testimonials">Success Stories</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;