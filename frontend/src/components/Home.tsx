import React from 'react';
import Testimonials from './Testimonials';
import './Home.css';

const Home: React.FC = () => {
  const openPortfolioBuilder = () => {
    // Navigate to template selector
    window.location.href = '/templates';
  };

  return (
    <div className="home">
      
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
            <a href="/login" className="login-link">Login</a>
            <button className="cta-nav-button" onClick={openPortfolioBuilder}>
              Create Portfolio
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-title">
              <h1>Built for Trust, Backed by Transparency</h1>
              <div className="title-accent"></div>
            </div>
            
            <div className="hero-description">
              <h3>Create professional portfolios that establish credibility and showcase your expertise to employers worldwide.</h3>
              <p>
                Trusted by thousands of professionals and backed by enterprise-grade security. 
                Build your portfolio with confidence using our transparent, reliable platform.
              </p>
              <button className="cta-button" onClick={openPortfolioBuilder}>
                Get Started
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="trust-indicators">
              <div className="trust-card">
                <div className="trust-icon">🔒</div>
                <h4>Bank-Level Security</h4>
                <p>Your data protected with enterprise encryption</p>
              </div>
              
              <div className="trust-card">
                <div className="trust-icon">✓</div>
                <h4>Verified Platform</h4>
                <p>Trusted by 10,000+ professionals worldwide</p>
              </div>
              
              <div className="trust-card">
                <div className="trust-icon">🏆</div>
                <h4>Proven Results</h4>
                <p>95% success rate in landing interviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Partners Section */}
      <section className="trust-partners">
        <div className="partners-content">
          <h3>Trusted by professionals at</h3>
          <div className="partners-logos">
            <div className="partner-logo">Google</div>
            <div className="partner-logo">Microsoft</div>
            <div className="partner-logo">Amazon</div>
            <div className="partner-logo">Apple</div>
            <div className="partner-logo">Meta</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="features-section">
        <div className="features-content">
          <div className="section-header">
            <h2>Why Professionals Choose Us</h2>
            <p>Built with security, transparency, and your success in mind</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Enterprise Security</h3>
              <p>Bank-level encryption and security protocols protect your personal information and professional data</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Transparent Analytics</h3>
              <p>Clear insights into your portfolio performance with detailed analytics and visitor tracking</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Verified Credentials</h3>
              <p>Professional verification system ensures authenticity and builds employer confidence</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Professional URLs</h3>
              <p>Clean, memorable URLs that enhance your professional brand and credibility</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Results-Driven</h3>
              <p>Data-backed templates and layouts optimized for maximum employer engagement</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Always Updated</h3>
              <p>Continuous platform improvements and security updates keep your portfolio current</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials moved below */}
      <section id="testimonials">
        <Testimonials />
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Build Your Professional Portfolio?</h2>
          <p>Join thousands of professionals who trust OnlinePortfolios for their career success</p>
          <button className="cta-button-large" onClick={openPortfolioBuilder}>
            Get Started Today
          </button>
          <div className="security-note">
            <span>🔒 Your data is protected with enterprise-grade security</span>
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
            <a href="#about">Features</a>
            <a href="#testimonials">Success Stories</a>
            <a href="/login">Login</a>
            <a href="mailto:hello@onlineportfolios.in">Support</a>
          </div>
          <div className="footer-security">
            <span>🔒 Enterprise Security • 🌐 Global Trust • ⚡ 99.9% Uptime</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;