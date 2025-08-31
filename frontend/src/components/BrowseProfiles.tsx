import React from 'react';
import './BrowseProfiles.css';

const BrowseProfiles: React.FC = () => {
  // Sample data - in real implementation, this would come from API
  const sampleProfiles = [
    {
      name: "Sarah Chen",
      title: "Software Engineer",
      company: "Google",
      university: "Stanford University",
      skills: ["React", "Node.js", "Python", "AWS"],
      portfolio: "https://onlineportfolios.in/sarah-chen",
      avatar: "👩‍💻"
    },
    {
      name: "Alex Johnson",
      title: "Full Stack Developer", 
      company: "Microsoft",
      university: "MIT",
      skills: ["JavaScript", "TypeScript", "Docker", "MongoDB"],
      portfolio: "https://onlineportfolios.in/alex-johnson",
      avatar: "👨‍💻"
    },
    {
      name: "Maya Patel",
      title: "Data Scientist",
      company: "Netflix",
      university: "UC Berkeley",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      portfolio: "https://onlineportfolios.in/maya-patel",
      avatar: "👩‍🔬"
    },
    {
      name: "David Kim",
      title: "Frontend Developer",
      company: "Meta",
      university: "Harvard",
      skills: ["React", "Vue.js", "CSS", "Figma"],
      portfolio: "https://onlineportfolios.in/david-kim",
      avatar: "🎨"
    },
    {
      name: "Emily Rodriguez",
      title: "DevOps Engineer",
      company: "Amazon",
      university: "CalTech",
      skills: ["Kubernetes", "AWS", "Docker", "Jenkins"],
      portfolio: "https://onlineportfolios.in/emily-rodriguez",
      avatar: "⚙️"
    },
    {
      name: "James Wilson",
      title: "Mobile Developer",
      company: "Apple",
      university: "Carnegie Mellon",
      skills: ["Swift", "React Native", "Flutter", "iOS"],
      portfolio: "https://onlineportfolios.in/james-wilson",
      avatar: "📱"
    }
  ];

  return (
    <div className="browse-profiles">
      {/* Header */}
      <div className="browse-header">
        <nav className="browse-nav">
          <div className="nav-brand">
            <div className="brand-logo">O</div>
            <span className="brand-text">nlinePortfolios</span>
          </div>
          <button className="back-home-btn" onClick={() => window.location.href = '/'}>
            ← Back to Home
          </button>
        </nav>
        
        <div className="browse-hero">
          <h1>Browse Top Talent</h1>
          <p>Discover exceptional developers and graduates ready to make an impact at your company</p>
          
          {/* Search and Filter Bar */}
          <div className="search-filters">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search by name, skills, or company..." />
            </div>
            <select className="filter-select">
              <option value="">All Skills</option>
              <option value="react">React</option>
              <option value="python">Python</option>
              <option value="node">Node.js</option>
              <option value="aws">AWS</option>
            </select>
            <select className="filter-select">
              <option value="">All Companies</option>
              <option value="google">Google</option>
              <option value="microsoft">Microsoft</option>
              <option value="netflix">Netflix</option>
              <option value="meta">Meta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="profiles-container">
        <div className="profiles-stats">
          <h2>500+ Active Profiles</h2>
          <p>Updated daily with new talent</p>
        </div>
        
        <div className="profiles-grid">
          {sampleProfiles.map((profile, index) => (
            <div key={index} className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">{profile.avatar}</div>
                <div className="profile-info">
                  <h3>{profile.name}</h3>
                  <p className="profile-title">{profile.title}</p>
                  <p className="profile-company">{profile.company} • {profile.university}</p>
                </div>
              </div>
              
              <div className="profile-skills">
                {profile.skills.map((skill, skillIndex) => (
                  <span key={skillIndex} className="skill-tag">{skill}</span>
                ))}
              </div>
              
              <div className="profile-actions">
                <button 
                  className="view-portfolio-btn"
                  onClick={() => window.open(profile.portfolio, '_blank')}
                >
                  View Portfolio →
                </button>
                <button className="contact-btn">
                  💼 Contact
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="load-more">
          <button className="load-more-btn">Load More Profiles</button>
          <p>Showing 6 of 500+ profiles</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="browse-footer">
        <p>© 2024 OnlinePortfolios.in • Connecting talent with opportunity</p>
      </footer>
    </div>
  );
};

export default BrowseProfiles;