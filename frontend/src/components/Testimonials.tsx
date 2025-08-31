import React, { useState, useEffect } from 'react';
import './Testimonials.css';
interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  university: string;
  graduationYear: string;
  photo: string;
  quote: string;
  linkedin?: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Google",
    university: "Stanford University",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b407?w=150&h=150&fit=crop&crop=face",
    quote: "OnlinePortfolios helped me stand out from thousands of applicants. The clean design and interactive elements caught the recruiter's attention immediately. I got interviews at 5 FAANG companies!",
    linkedin: "https://www.linkedin.com/in/sarah-chen/"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Product Manager",
    company: "Microsoft",
    university: "MIT",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "The premium template's professional layout and trust indicators were conversation starters in every interview. It demonstrated my attention to detail and professionalism. Landed my dream role in just 6 weeks!",
    linkedin: "https://www.linkedin.com/in/michael-rodriguez/"
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Data Analyst",
    company: "Amazon",
    university: "UC Berkeley",
    graduationYear: "2024",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "My OnlinePortfolios page got 800+ views in the first week after sharing it on LinkedIn. The professional blue theme and trust elements beautifully showcased my credibility. Received 12 interview calls!",
    linkedin: "https://www.linkedin.com/in/emily-watson/"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Full Stack Developer",
    company: "Meta",
    university: "Carnegie Mellon",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "The trust-focused design and enterprise security features impressed hiring managers. They said they'd never seen such a professional and credible online presence from a new graduate.",
    linkedin: "https://linkedin.com/in/david-kim"
  },
  {
    id: 5,
    name: "Jessica Taylor",
    role: "UX Designer",
    company: "Apple",
    university: "Stanford University",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    quote: "OnlinePortfolios made it incredibly easy to showcase my design projects with a clean, trustworthy layout. The professional presentation added instant credibility. Got hired 3 weeks after graduation!",
    linkedin: "https://www.linkedin.com/in/jessica-taylor/"
  },
  {
    id: 6,
    name: "James Wilson",
    role: "Marketing Manager",
    company: "Netflix",
    university: "Harvard Business School",
    graduationYear: "2024",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote: "The professional blue theme and trust indicators impressed senior executives during my final interviews. The platform's transparency and credibility features aligned perfectly with my personal brand.",
    linkedin: "https://www.linkedin.com/in/james-wilson/"
  }
];

const Testimonials: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark-theme'));
    };
    
    checkTheme();
    
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      checkTheme();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const openPortfolioBuilder = () => {
    // Navigate to template selector
    window.location.href = '/templates';
  };
  
  return (
    <section 
      className="testimonials-section"
      style={{ 
        backgroundColor: isDarkMode ? '#1a1a2e' : '#F4F8FB',
        background: isDarkMode ? '#1a1a2e' : '#F4F8FB'
      }}
    >
      <div className="container">
        <div className="testimonials-header">
          <br />
          <h2>Success Stories</h2>
          <p>Join thousands of professionals who built their careers with OnlinePortfolios</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Students Placed</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Interview Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Top Companies</span>
            </div>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <img 
                    src={testimonial.photo} 
                    alt={testimonial.name}
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=667eea&color=fff&size=150`;
                    }}
                  />
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p className="role">{testimonial.role} at {testimonial.company}</p>
                  <p className="education">{testimonial.university} '{testimonial.graduationYear}</p>
                </div>
              </div>
              
              <blockquote className="testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
              
              {testimonial.linkedin && (
                <a 
                  href={testimonial.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="linkedin-link"
                >
                  💼 View LinkedIn
                </a>
              )}
              
              <div className="testimonial-badge">
                Hired
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-cta">
          <h3>Ready to join them?</h3>
          <p>Create your professional landing page in under 5 minutes</p>
          <button className="cta-button" onClick={openPortfolioBuilder}>
            Get Started Today
          </button>
          
        </div>
        
      </div>
      <br />
    </section>
  );
};

export default Testimonials;