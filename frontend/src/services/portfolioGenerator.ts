// Portfolio Generation and S3 Upload Service
export interface PortfolioData {
  personal: {
    fullName: string;
    designation: string;
    heroDescription: string;
    profilePhoto?: string;
    resumeUrl?: string;
    resumeFileName?: string;
  };
  about: {
    paragraph1: string;
    paragraph2: string;
    stats?: {
      projects: { number: number; label: string };
      gpa: { number: number; label: string };
      internships: { number: number; label: string };
    };
  };
  skills?: {
    categories: Array<{
      name: string;
      skills: Array<{ name: string; level: number }>;
    }>;
  };
  experience?: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    achievements?: string[];
    technologies?: string[];
  }>;
  projects?: Array<{
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    demoUrl?: string;
    image?: string;
  }>;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface PortfolioGenerationResult {
  success: boolean;
  portfolioUrl?: string;
  error?: string;
}

export class PortfolioGenerator {
  private static readonly S3_BASE_URL = 'https://gradfolio-previews.s3.amazonaws.com';
  
  // Generate personalized HTML for modern template
  static generateModernHTML(data: PortfolioData): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName} - ${data.personal.designation}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="loaded">
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">Portfolio</div>
            <ul class="nav-menu">
                <li><a href="#home" class="nav-link">Home</a></li>
                <li><a href="#about" class="nav-link">About</a></li>
                <li><a href="#skills" class="nav-link">Skills</a></li>
                <li><a href="#experience" class="nav-link">Experience</a></li>
                <li><a href="#projects" class="nav-link">Projects</a></li>
                <li><a href="#contact" class="nav-link">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>

    <section id="home" class="hero">
        <div class="hero-content">
            <div class="hero-text">
                <h1 id="hero-name">Hello, I'm <span class="highlight">${data.personal.fullName}</span></h1>
                <h2>${data.personal.designation}</h2>
                <p>${data.personal.heroDescription}</p>
                <div class="hero-buttons">
                    <a href="#projects" class="btn btn-primary">View Projects</a>
                    <a href="#contact" class="btn btn-secondary">Get In Touch</a>
                </div>
            </div>
            <div class="hero-image">
                <div class="profile-circle">
                    ${data.personal.profilePhoto 
                      ? `<img src="${data.personal.profilePhoto}" alt="${data.personal.fullName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
                      : '<i class="fas fa-user-graduate"></i>'
                    }
                </div>
            </div>
        </div>
        <div class="scroll-indicator">
            <i class="fas fa-chevron-down"></i>
        </div>
    </section>

    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p>${data.about.paragraph1}</p>
                    <p>${data.about.paragraph2}</p>
                    ${data.about.stats ? `
                    <div class="stats">
                        <div class="stat">
                            <span class="stat-number">${data.about.stats.projects.number}+</span>
                            <span class="stat-label">${data.about.stats.projects.label}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${data.about.stats.gpa.number}</span>
                            <span class="stat-label">${data.about.stats.gpa.label}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-number">${data.about.stats.internships.number}</span>
                            <span class="stat-label">${data.about.stats.internships.label}</span>
                        </div>
                    </div>` : ''}
                </div>
            </div>
        </div>
    </section>

    ${this.generateSkillsSection(data.skills)}
    ${this.generateExperienceSection(data.experience)}
    ${this.generateProjectsSection(data.projects)}
    ${this.generateContactSection(data.contact, data.personal.resumeUrl, data.personal.resumeFileName)}

    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${data.personal.fullName}. All rights reserved.</p>
        </div>
    </footer>

    <script>
        // Basic portfolio functionality without admin features
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', function() {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
            }
            
            // Smooth scrolling for navigation links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    // Close mobile menu if open
                    hamburger?.classList.remove('active');
                    navMenu?.classList.remove('active');
                });
            });
        });
        
        // Resume download function
        ${data.personal.resumeUrl ? `
        function downloadResume() {
            const resumeUrl = '${data.personal.resumeUrl}';
            const resumeFileName = '${data.personal.resumeFileName || data.personal.fullName + '-resume'}';
            
            if (resumeUrl.startsWith('data:')) {
                // Handle data URL
                const link = document.createElement('a');
                link.href = resumeUrl;
                link.download = resumeFileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Handle external URL
                window.open(resumeUrl, '_blank');
            }
        }
        window.downloadResume = downloadResume;
        ` : ''}
    </script>
</body>
</html>`;
  }

  // Generate skills section
  private static generateSkillsSection(skills?: PortfolioData['skills']): string {
    if (!skills || !skills.categories?.length) {
      return `<section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">Technical Skills</h2>
            <div class="skills-grid">
                <div class="skill-category">
                    <h3>Development</h3>
                    <div class="skill-items">
                        <span class="skill-tag">JavaScript</span>
                        <span class="skill-tag">Python</span>
                        <span class="skill-tag">React</span>
                        <span class="skill-tag">Node.js</span>
                    </div>
                </div>
            </div>
        </div>
      </section>`;
    }

    const categoriesHTML = skills.categories.map(category => `
      <div class="skill-category">
          <h3>${category.name}</h3>
          <div class="skill-items">
              ${category.skills.map(skill => `<span class="skill-tag">${skill.name}</span>`).join('')}
          </div>
      </div>
    `).join('');

    return `<section id="skills" class="skills">
        <div class="container">
            <h2 class="section-title">Technical Skills</h2>
            <div class="skills-grid">
                ${categoriesHTML}
            </div>
        </div>
    </section>`;
  }

  // Generate experience section
  private static generateExperienceSection(experience?: PortfolioData['experience']): string {
    if (!experience || !experience.length) {
      return `<section id="experience" class="experience">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="experience-timeline">
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="experience-header">
                            <h3>Add Your Experience</h3>
                            <div class="company-info">
                                <span class="company">Company Name</span>
                                <span class="duration">Duration</span>
                            </div>
                        </div>
                        <div class="experience-description">
                            <p>Describe your work experience and achievements here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>`;
    }

    const experienceHTML = experience.map(exp => `
      <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
              <div class="experience-header">
                  <h3>${exp.title}</h3>
                  <div class="company-info">
                      <span class="company">${exp.company}</span>
                      <span class="duration">${exp.duration}</span>
                  </div>
              </div>
              <div class="experience-description">
                  <p>${exp.description}</p>
                  ${exp.achievements ? `
                  <ul class="achievements">
                      ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                  </ul>` : ''}
                  ${exp.technologies ? `
                  <div class="tech-stack">
                      ${exp.technologies.map(tech => `<span class="tech">${tech}</span>`).join('')}
                  </div>` : ''}
              </div>
          </div>
      </div>
    `).join('');

    return `<section id="experience" class="experience">
        <div class="container">
            <h2 class="section-title">Experience</h2>
            <div class="experience-timeline">
                ${experienceHTML}
            </div>
        </div>
    </section>`;
  }

  // Generate projects section
  private static generateProjectsSection(projects?: PortfolioData['projects']): string {
    if (!projects || !projects.length) {
      return `<section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                <div class="project-card">
                    <div class="project-image">
                        <i class="fas fa-code"></i>
                    </div>
                    <div class="project-content">
                        <h3>Your Project Here</h3>
                        <p>Add your amazing projects to showcase your skills and experience.</p>
                        <div class="project-tech">
                            <span>Technology</span>
                        </div>
                        <div class="project-links">
                            <a href="#" class="project-link"><i class="fab fa-github"></i> Code</a>
                            <a href="#" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>`;
    }

    const projectsHTML = projects.map(project => `
      <div class="project-card">
          <div class="project-image">
              ${project.image ? `<img src="${project.image}" alt="${project.title}">` : '<i class="fas fa-code"></i>'}
          </div>
          <div class="project-content">
              <h3>${project.title}</h3>
              <p>${project.description}</p>
              <div class="project-tech">
                  ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
              </div>
              <div class="project-links">
                  ${project.githubUrl ? `<a href="${project.githubUrl}" class="project-link" target="_blank"><i class="fab fa-github"></i> Code</a>` : ''}
                  ${project.demoUrl ? `<a href="${project.demoUrl}" class="project-link" target="_blank"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
              </div>
          </div>
      </div>
    `).join('');

    return `<section id="projects" class="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${projectsHTML}
            </div>
        </div>
    </section>`;
  }

  // Generate contact section
  private static generateContactSection(contact: PortfolioData['contact'], resumeUrl?: string, resumeFileName?: string): string {
    return `<section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <p>I'm always interested in new opportunities and collaborations. Feel free to reach out if you'd like to discuss potential projects or just want to connect!</p>
                    <div class="contact-methods">
                        <div class="contact-method">
                            <i class="fas fa-envelope"></i>
                            <span>${contact.email}</span>
                        </div>
                        <div class="contact-method">
                            <i class="fas fa-phone"></i>
                            <span>${contact.phone}</span>
                        </div>
                        <div class="contact-method">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${contact.location}</span>
                        </div>
                    </div>
                    <div class="social-links">
                        ${contact.linkedin ? `<a href="${contact.linkedin}" class="social-link" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${contact.github ? `<a href="${contact.github}" class="social-link" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                        ${contact.twitter ? `<a href="${contact.twitter}" class="social-link" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                        ${contact.instagram ? `<a href="${contact.instagram}" class="social-link" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                    </div>
                    ${resumeUrl ? `
                    <br>
                    <button id="download-resume-btn" class="btn btn-resume" onclick="downloadResume()">
                        <i class="fas fa-download"></i> Download Resume
                    </button>` : ''}
                </div>
                <form class="contact-form">
                    <div class="form-group">
                        <input type="text" id="name" name="name" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" id="email" name="email" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <textarea id="message" name="message" placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                </form>
            </div>
        </div>
    </section>`;
  }

  // Generate portfolio and get S3 upload data
  static async generatePortfolio(username: string, templateType: 'modern' | 'creative', data: PortfolioData): Promise<PortfolioGenerationResult> {
    try {
      // Generate HTML based on template type
      let html: string;
      if (templateType === 'modern') {
        html = this.generateModernHTML(data);
      } else {
        // For now, use modern template for creative too - can expand later
        html = this.generateModernHTML(data);
      }

      // In a real implementation, you'd upload to S3 here
      // For now, we'll return the generated HTML and expected URL
      const portfolioUrl = `${this.S3_BASE_URL}/portfolios/${username}/index.html`;
      
      return {
        success: true,
        portfolioUrl: portfolioUrl
      };
      
    } catch (error) {
      console.error('Error generating portfolio:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}