import React from 'react';
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
    quote: "GradGen helped me stand out from thousands of applicants. The clean design and interactive elements caught the recruiter's attention immediately. I got interviews at 5 FAANG companies!",
    linkedin: "https://linkedin.com/in/sarahchen"
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "Microsoft",
    university: "MIT",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "The premium template's 3D animations were a conversation starter in every interview. It showed my attention to detail and creativity. Landed my dream PM role in just 2 months!",
    linkedin: "https://linkedin.com/in/marcusj"
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Data Scientist",
    company: "Netflix",
    university: "UC Berkeley",
    graduationYear: "2024",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    quote: "My GradGen page got 500+ views in the first week after sharing it on LinkedIn. The projects section beautifully showcased my work. Received 15 interview calls!",
    linkedin: "https://linkedin.com/in/priyapatel"
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    role: "UX Designer",
    company: "Apple",
    university: "Carnegie Mellon",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "The color customization feature let me match my personal brand perfectly. Hiring managers said they'd never seen such a polished online presence from a new grad.",
    linkedin: "https://linkedin.com/in/alexrodriguez"
  },
  {
    id: 5,
    name: "Emily Wang",
    role: "Marketing Manager",
    company: "Spotify",
    university: "Northwestern",
    graduationYear: "2024",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    quote: "GradGen made it so easy to showcase my extracurricular leadership roles. The testimonials section added credibility. Got hired 2 weeks after graduation!",
    linkedin: "https://linkedin.com/in/emilywang"
  },
  {
    id: 6,
    name: "David Kim",
    role: "Financial Analyst",
    company: "Goldman Sachs",
    university: "Wharton",
    graduationYear: "2023",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    quote: "The professional layout and premium animations impressed senior executives during my final round interviews. They said it showed exceptional presentation skills.",
    linkedin: "https://linkedin.com/in/davidkim"
  }
];

const Testimonials: React.FC = () => {
  const openPortfolioBuilder = () => {
    // Navigate to template selector
    window.location.href = '/templates';
  };
  
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <br />
          <h2>Success Stories</h2>
          <p>Join thousands of students who landed their dream jobs with GradGen</p>
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
                
              </div>
            </div>
          ))}
        </div>

        <div className="testimonials-cta">
          <h3>Ready to join them?</h3>
          <p>Create your professional landing page in under 5 minutes</p>
          <button className="cta-nav-button" onClick={openPortfolioBuilder}>
            Get Started Free
          </button>
          <br />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;