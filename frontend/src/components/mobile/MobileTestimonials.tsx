import React, { useState, useEffect, useRef } from 'react';
import './MobileTestimonials.css';

const testimonialsData = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    university: "Stanford University",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b407?w=150&h=150&fit=crop&crop=face",
    quote: "OnlinePortfolios helped me stand out from thousands of applicants. The clean design caught the recruiter's attention immediately!",
    color: "#667eea",
    achievement: "5 FAANG offers"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "Microsoft",
    university: "MIT",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "The premium template's professional layout was a conversation starter in every interview. Landed my dream role in 6 weeks!",
    color: "#f093fb",
    achievement: "Dream job in 6 weeks"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Data Analyst",
    company: "Amazon",
    university: "UC Berkeley",
    graduationYear: "2024",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "My portfolio got 800+ views in the first week. The professional design beautifully showcased my credibility!",
    color: "#4facfe",
    achievement: "800+ portfolio views"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Full Stack Developer",
    company: "Meta",
    university: "Carnegie Mellon",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "Hiring managers said they'd never seen such a professional online presence from a new graduate. Impressive!",
    color: "#43e97b",
    achievement: "Impressed hiring managers"
  }
];

const MobileTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  // Check for dark mode
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-theme'));
    };
    checkTheme();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextTestimonial();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  const nextTestimonial = () => {
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevTestimonial = () => {
    setIsAnimating(true);
    setCurrentIndex((prev) => prev === 0 ? testimonialsData.length - 1 : prev - 1);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diffY = startY.current - currentY.current;
    
    if (Math.abs(diffY) > 50) {
      if (diffY > 0) {
        nextTestimonial();
      } else {
        prevTestimonial();
      }
    }
  };

  const currentTestimonial = testimonialsData[currentIndex];
  const primaryColor = isDarkMode ? '#4A9EFF' : '#1E73BE';
  const bgColor = isDarkMode ? '#1a1a2e' : '#F4F8FB';

  return (
    <div 
      className="mobile-testimonials"
      style={{
        background: bgColor
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={containerRef}
    >
      {/* Brand Logo */}
      <div className="mobile-brand" style={{ color: primaryColor }}>
        OnlinePortfolios
      </div>

      {/* Back Button */}
      <button 
        className="testimonials-back-button"
        onClick={() => window.history.back()}
        style={{ borderColor: primaryColor, color: primaryColor }}
      >
        ← Back
      </button>

      {/* Header */}
      <div className="mobile-testimonials-header">
        <h2>Success Stories</h2>
        <p>Swipe to explore amazing journeys</p>
      </div>

      {/* Main Testimonial Card */}
      <div className="testimonial-showcase">
        <div 
          className={`main-testimonial-card ${isAnimating ? 'animating' : ''}`}
          style={{
            borderColor: primaryColor,
            boxShadow: `0 20px 60px ${primaryColor}30`
          }}
        >
          {/* Animated Background */}
          <div 
            className="card-bg-animation"
            style={{ background: `linear-gradient(45deg, ${primaryColor}10, ${primaryColor}20)` }}
          />

          {/* Company Badge */}
          <div 
            className="company-badge"
            style={{ background: primaryColor }}
          >
            {currentTestimonial.company}
          </div>

          {/* Profile Section */}
          <div className="profile-section">
            <div 
              className="profile-avatar"
              style={{ borderColor: primaryColor }}
            >
              <img 
                src={currentTestimonial.photo} 
                alt={currentTestimonial.name}
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentTestimonial.name}&background=667eea&color=fff&size=150`;
                }}
              />
              <div 
                className="avatar-ring"
                style={{ borderColor: primaryColor }}
              />
            </div>

            <div className="profile-info">
              <h3>{currentTestimonial.name}</h3>
              <p className="role">{currentTestimonial.role}</p>
              <p className="education">
                {currentTestimonial.university} • '{currentTestimonial.graduationYear}
              </p>
            </div>
          </div>

          {/* Achievement Badge */}
          <div 
            className="achievement-badge"
            style={{ background: `${primaryColor}15` }}
          >
            ⭐ {currentTestimonial.achievement}
          </div>

          {/* Quote */}
          <div className="quote-section">
            <div className="quote-marks">"</div>
            <p className="quote-text">{currentTestimonial.quote}</p>
          </div>

          {/* Floating Elements */}
          <div className="floating-elements">
            <div 
              className="floating-dot dot-1"
              style={{ background: primaryColor }}
            />
            <div 
              className="floating-dot dot-2"
              style={{ background: primaryColor }}
            />
            <div 
              className="floating-dot dot-3"
              style={{ background: primaryColor }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="testimonial-navigation">
        <button
          className="nav-arrow prev"
          onClick={prevTestimonial}
          style={{ borderColor: primaryColor, color: primaryColor }}
          disabled={isAnimating}
        >
          ←
        </button>
        
        <div className="testimonial-dots">
          {testimonialsData.map((_, index) => (
            <button
              key={index}
              className={`testimonial-dot ${index === currentIndex ? 'active' : ''}`}
              style={{
                background: index === currentIndex ? primaryColor : 'rgba(255,255,255,0.3)'
              }}
              onClick={() => {
                setIsAnimating(true);
                setCurrentIndex(index);
                setTimeout(() => setIsAnimating(false), 600);
              }}
            />
          ))}
        </div>

        <button
          className="nav-arrow next"
          onClick={nextTestimonial}
          style={{ borderColor: primaryColor, color: primaryColor }}
          disabled={isAnimating}
        >
          →
        </button>
      </div>

      {/* Stats Section */}
      <div className="testimonials-stats">
        <div className="stat-item">
          <div className="stat-number">1000+</div>
          <div className="stat-label">Success Stories</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">95%</div>
          <div className="stat-label">Job Success Rate</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Top Companies</div>
        </div>
      </div>

      {/* CTA Button */}
      <button 
        className="testimonials-cta"
        style={{ 
          background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
          boxShadow: `0 10px 30px ${primaryColor}40`
        }}
        onClick={() => window.location.href = '/templates'}
      >
        <span>🚀</span>
        <span>Start Your Success Story</span>
        <span>→</span>
      </button>

      {/* Swipe Indicator */}
      <div className="swipe-hint">
        <div className="swipe-line" />
        <span>Swipe up/down for more stories</span>
      </div>
    </div>
  );
};

export default MobileTestimonials;