// Portfolio Dynamic Content Updater
class PortfolioUpdater {
    constructor() {
        this.defaultData = {
            personal: {
                fullName: "Alex Johnson",
                designation: "Computer Science Graduate",
                heroDescription: "Passionate about creating innovative solutions through code. Ready to make an impact in the tech industry.",
                profilePhoto: "",
                resumeUrl: "",
                resumeFileName: ""
            },
            about: {
                paragraph1: "I'm a recent Computer Science graduate with a passion for full-stack development and problem-solving. During my studies, I've worked on various projects that showcase my ability to learn new technologies quickly and deliver quality solutions.",
                paragraph2: "My journey in technology started with curiosity and has evolved into a deep appreciation for clean code, user experience, and innovative solutions. I'm always eager to take on new challenges and contribute to meaningful projects.",
                stats: {
                    projects: { number: 15, label: "Projects Completed" },
                    gpa: { number: 3.8, label: "GPA" },
                    internships: { number: 2, label: "Internships" }
                }
            },
            skills: {
                categories: [
                    {
                        id: "frontend",
                        name: "Frontend",
                        icon: "fas fa-laptop-code",
                        skills: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "TypeScript"]
                    },
                    {
                        id: "backend",
                        name: "Backend",
                        icon: "fas fa-server",
                        skills: ["Node.js", "Python", "Java", "Express.js", "Django", "REST APIs"]
                    },
                    {
                        id: "tools",
                        name: "Database & Tools",
                        icon: "fas fa-tools",
                        skills: ["MySQL", "MongoDB", "Git", "Docker", "AWS", "Linux"]
                    }
                ]
            },
            experience: [
                {
                    id: "exp1",
                    title: "Software Engineering Intern",
                    company: "TechCorp Solutions",
                    duration: "Jun 2023 - Aug 2023",
                    description: "Developed and maintained web applications using React and Node.js. Collaborated with senior developers on feature implementation and code optimization.",
                    achievements: [
                        "Built responsive user interfaces for 3 client projects",
                        "Improved application performance by 25% through code optimization",
                        "Participated in agile development processes and daily standups"
                    ],
                    technologies: ["React", "Node.js", "MongoDB", "Git"]
                },
                {
                    id: "exp2",
                    title: "Frontend Developer Intern",
                    company: "Digital Innovations Ltd",
                    duration: "Jan 2023 - Apr 2023",
                    description: "Focused on creating modern, responsive web interfaces and improving user experience across multiple platforms.",
                    achievements: [
                        "Redesigned company landing page resulting in 40% increase in conversions",
                        "Implemented mobile-first design principles for better accessibility",
                        "Collaborated with UX/UI team to translate designs into functional code"
                    ],
                    technologies: ["Vue.js", "Sass", "JavaScript", "Figma"]
                }
            ],
            projects: [
                {
                    id: "proj1",
                    title: "E-Commerce Platform",
                    description: "Full-stack e-commerce solution built with React, Node.js, and MongoDB. Features user authentication, payment integration, and admin dashboard.",
                    image: "fas fa-shopping-cart",
                    technologies: ["React", "Node.js", "MongoDB"],
                    githubUrl: "#",
                    liveUrl: "#",
                    featured: true
                },
                {
                    id: "proj2",
                    title: "Task Management App",
                    description: "Collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
                    image: "fas fa-tasks",
                    technologies: ["Vue.js", "Socket.io", "Express"],
                    githubUrl: "#",
                    liveUrl: "#",
                    featured: true
                }
            ],
            contact: {
                description: "I'm always interested in new opportunities and collaborations. Feel free to reach out if you'd like to discuss potential projects or just want to connect!",
                methods: {
                    email: "alex.johnson@email.com",
                    phone: "+1 (555) 123-4567",
                    location: "San Francisco, CA"
                },
                socialLinks: [
                    { id: "linkedin", name: "LinkedIn", url: "#", icon: "fab fa-linkedin" },
                    { id: "github", name: "GitHub", url: "#", icon: "fab fa-github" },
                    { id: "twitter", name: "Twitter", url: "#", icon: "fab fa-twitter" }
                ]
            },
            theme: {
                primaryColor: "#00bfa6",
                secondaryColor: "#00acc1",
                accentColor: "#00bfa6",
                backgroundColor: "#121212",
                textColor: "#f5f5f5"
            }
        };
        
        this.data = this.loadData();
        this.init();
    }

    loadData() {
        const savedData = localStorage.getItem('portfolioData');
        if (savedData) {
            try {
                return { ...this.defaultData, ...JSON.parse(savedData) };
            } catch (e) {
                console.error('Error parsing saved portfolio data:', e);
                return this.defaultData;
            }
        }
        return this.defaultData;
    }

    init() {
        this.updatePersonalInfo();
        this.updateAboutSection();
        this.updateSkillsSection();
        this.updateExperienceSection();
        this.updateProjectsSection();
        this.updateContactSection();
        this.updateTheme();
        this.updateProfilePhoto();
        this.updateNavigationVisibility();
        
        // Add loaded class to prevent FOUC after initialization
        document.body.classList.add('loaded');
        
        // Hide loading overlay
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
                // Remove overlay from DOM after transition
                setTimeout(() => loadingOverlay.remove(), 500);
            }
        }, 300);
    }

    updatePersonalInfo() {
        // Update hero section using specific ID for more precise targeting
        const heroH1 = document.getElementById('hero-name');
        if (heroH1) {
            const newContent = `Hello, I'm <span class="highlight">${this.data.personal.fullName}</span>`;
            // Force complete replacement
            heroH1.innerHTML = newContent;
        }

        const designationElement = document.querySelector('.hero-text h2');
        if (designationElement) {
            designationElement.textContent = this.data.personal.designation;
        }

        const descriptionElement = document.querySelector('.hero-text p');
        if (descriptionElement) {
            descriptionElement.textContent = this.data.personal.heroDescription;
        }

        // Update navigation logo if needed
        const navLogo = document.querySelector('.nav-logo');
        if (navLogo && this.data.personal.fullName) {
            const firstName = this.data.personal.fullName.split(' ')[0];
            navLogo.textContent = firstName + "'s Portfolio";
        }

        // Update footer
        const footer = document.querySelector('.footer p');
        if (footer) {
            footer.textContent = `© 2024 ${this.data.personal.fullName}. All rights reserved.`;
        }

        // Show/hide resume download button
        this.updateResumeButton();
    }

    updateResumeButton() {
        const resumeBtn = document.getElementById('download-resume-btn');
        if (!resumeBtn) return;

        // Show button only if resume exists
        if (this.data.personal.resumeUrl && this.data.personal.resumeUrl.trim()) {
            resumeBtn.style.display = 'inline-flex';
        } else {
            resumeBtn.style.display = 'none';
        }
    }

    updateAboutSection() {
        const paragraphs = document.querySelectorAll('.about-text p');
        if (paragraphs[0]) paragraphs[0].textContent = this.data.about.paragraph1;
        if (paragraphs[1]) paragraphs[1].textContent = this.data.about.paragraph2;

        // Update stats
        const stats = document.querySelectorAll('.stat');
        if (stats[0]) {
            const numberEl = stats[0].querySelector('.stat-number');
            const labelEl = stats[0].querySelector('.stat-label');
            if (numberEl) numberEl.textContent = this.data.about.stats.projects.number + '+';
            if (labelEl) labelEl.textContent = this.data.about.stats.projects.label;
        }
        if (stats[1]) {
            const numberEl = stats[1].querySelector('.stat-number');
            const labelEl = stats[1].querySelector('.stat-label');
            if (numberEl) numberEl.textContent = this.data.about.stats.gpa.number;
            if (labelEl) labelEl.textContent = this.data.about.stats.gpa.label;
        }
        if (stats[2]) {
            const numberEl = stats[2].querySelector('.stat-number');
            const labelEl = stats[2].querySelector('.stat-label');
            if (numberEl) numberEl.textContent = this.data.about.stats.internships.number;
            if (labelEl) labelEl.textContent = this.data.about.stats.internships.label;
        }
    }

    updateSkillsSection() {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;

        skillsGrid.innerHTML = '';
        
        this.data.skills.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            
            categoryDiv.innerHTML = `
                <h3><i class="${category.icon}"></i> ${category.name}</h3>
                <div class="skill-items">
                    ${category.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            `;
            
            skillsGrid.appendChild(categoryDiv);
        });
    }

    updateExperienceSection() {
        const experienceSection = document.querySelector('#experience');
        const timeline = document.querySelector('.experience-timeline');
        
        // Hide section if no experience entries
        if (!this.data.experience || this.data.experience.length === 0) {
            if (experienceSection) {
                experienceSection.classList.add('hidden');
                setTimeout(() => experienceSection.style.display = 'none', 300);
            }
            return;
        } else {
            if (experienceSection) {
                experienceSection.style.display = 'block';
                experienceSection.classList.remove('hidden');
            }
        }

        if (!timeline) return;

        timeline.innerHTML = '';
        
        // Filter out empty experience entries
        const validExperiences = this.data.experience.filter(exp => 
            exp.title && exp.title.trim() && exp.company && exp.company.trim()
        );

        if (validExperiences.length === 0) {
            if (experienceSection) {
                experienceSection.classList.add('hidden');
                setTimeout(() => experienceSection.style.display = 'none', 300);
            }
            return;
        }
        
        validExperiences.forEach(exp => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="experience-header">
                        <h3>${exp.title}</h3>
                        <div class="company-info">
                            <span class="company">${exp.company}</span>
                            <span class="duration">${exp.duration || ''}</span>
                        </div>
                    </div>
                    <div class="experience-description">
                        <p>${exp.description || ''}</p>
                        ${exp.achievements && exp.achievements.length > 0 ? `
                            <ul class="achievements">
                                ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                            </ul>
                        ` : ''}
                        ${exp.technologies && exp.technologies.length > 0 ? `
                            <div class="tech-stack">
                                ${exp.technologies.map(tech => `<span class="tech">${tech}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
    }

    updateProjectsSection() {
        const projectsSection = document.querySelector('#projects');
        const projectsGrid = document.querySelector('.projects-grid');
        
        // Hide section if no projects
        if (!this.data.projects || this.data.projects.length === 0) {
            if (projectsSection) {
                projectsSection.classList.add('hidden');
                setTimeout(() => projectsSection.style.display = 'none', 300);
            }
            return;
        } else {
            if (projectsSection) {
                projectsSection.style.display = 'block';
                projectsSection.classList.remove('hidden');
            }
        }

        if (!projectsGrid) return;

        projectsGrid.innerHTML = '';
        
        // Filter out empty project entries
        const validProjects = this.data.projects.filter(project => 
            project.title && project.title.trim()
        );

        if (validProjects.length === 0) {
            if (projectsSection) {
                projectsSection.classList.add('hidden');
                setTimeout(() => projectsSection.style.display = 'none', 300);
            }
            return;
        }
        
        validProjects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <i class="${project.image || 'fas fa-code'}"></i>
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p>${project.description || ''}</p>
                    ${project.technologies && project.technologies.length > 0 ? `
                        <div class="project-tech">
                            ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="project-links">
                        ${project.githubUrl && project.githubUrl !== '#' ? `
                            <a href="${project.githubUrl}" class="project-link" target="_blank">
                                <i class="fab fa-github"></i> Code
                            </a>
                        ` : ''}
                        ${project.liveUrl && project.liveUrl !== '#' ? `
                            <a href="${project.liveUrl}" class="project-link" target="_blank">
                                <i class="fas fa-external-link-alt"></i> Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    }

    updateContactSection() {
        // Update description
        const contactDesc = document.querySelector('.contact-info p');
        if (contactDesc) {
            contactDesc.textContent = this.data.contact.description;
        }

        // Update contact methods
        const methods = document.querySelectorAll('.contact-method');
        if (methods[0]) {
            methods[0].querySelector('span').textContent = this.data.contact.methods.email;
        }
        if (methods[1]) {
            methods[1].querySelector('span').textContent = this.data.contact.methods.phone;
        }
        if (methods[2]) {
            methods[2].querySelector('span').textContent = this.data.contact.methods.location;
        }

        // Update social links
        const socialLinks = document.querySelector('.social-links');
        if (socialLinks) {
            socialLinks.innerHTML = '';
            
            this.data.contact.socialLinks.forEach(link => {
                const linkEl = document.createElement('a');
                linkEl.href = link.url;
                linkEl.className = 'social-link';
                linkEl.target = '_blank';
                linkEl.innerHTML = `<i class="${link.icon}"></i>`;
                socialLinks.appendChild(linkEl);
            });
        }
    }

    updateTheme() {
        const root = document.documentElement;
        
        // Update CSS custom properties
        root.style.setProperty('--primary-color', this.data.theme.primaryColor);
        root.style.setProperty('--secondary-color', this.data.theme.secondaryColor);
        root.style.setProperty('--accent-color', this.data.theme.accentColor);
        root.style.setProperty('--background', this.data.theme.backgroundColor);
        root.style.setProperty('--text-primary', this.data.theme.textColor);
        
        // Update gradient variables
        root.style.setProperty('--gradient-primary', 
            `linear-gradient(135deg, ${this.data.theme.primaryColor} 0%, ${this.data.theme.secondaryColor} 100%)`);
        root.style.setProperty('--gradient-secondary', 
            `linear-gradient(135deg, ${this.data.theme.primaryColor} 0%, ${this.data.theme.accentColor} 100%)`);
    }

    updateProfilePhoto() {
        const profileCircle = document.querySelector('.profile-circle');
        if (!profileCircle) return;

        if (this.data.personal.profilePhoto) {
            // Replace icon with high-quality image
            profileCircle.innerHTML = `
                <img src="${this.data.personal.profilePhoto}" 
                     alt="${this.data.personal.fullName}" 
                     class="profile-photo"
                     loading="lazy">`;
        } else {
            // Reset to default icon if no photo
            profileCircle.innerHTML = '<i class="fas fa-user-graduate"></i>';
        }
    }

    updateNavigationVisibility() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const sectionId = href?.substring(1); // Remove #
            
            if (sectionId) {
                const section = document.querySelector(`#${sectionId}`);
                const isVisible = section && section.style.display !== 'none';
                
                // Hide/show navigation link based on section visibility
                if (sectionId === 'experience') {
                    const hasExperience = this.data.experience && 
                        this.data.experience.some(exp => exp.title && exp.title.trim() && exp.company && exp.company.trim());
                    link.style.display = hasExperience ? 'block' : 'none';
                } else if (sectionId === 'projects') {
                    const hasProjects = this.data.projects && 
                        this.data.projects.some(proj => proj.title && proj.title.trim());
                    link.style.display = hasProjects ? 'block' : 'none';
                } else {
                    // Keep other links visible
                    link.style.display = 'block';
                }
            }
        });
    }

    // Method to force clean update (useful for debugging)
    forceUpdate() {
        // Clear any existing dynamic content first
        const heroH1 = document.getElementById('hero-name');
        if (heroH1) {
            heroH1.innerHTML = `Hello, I'm <span class="highlight">Alex Johnson</span>`; // Reset to default first
        }
        
        // Then update with current data
        setTimeout(() => {
            this.init();
        }, 50);
    }

    // Method to refresh data (called when returning from admin panel)
    refresh() {
        const oldData = JSON.stringify(this.data);
        this.data = this.loadData();
        const newData = JSON.stringify(this.data);
        
        // Only update if data actually changed
        if (oldData !== newData) {
            this.init();
        }
    }
}

// Auto-update functionality
function setupAutoRefresh() {
    // Listen for storage changes (when data is updated in admin panel)
    window.addEventListener('storage', function(e) {
        if (e.key === 'portfolioData') {
            if (window.portfolioUpdater) {
                window.portfolioUpdater.refresh();
            }
        }
    });

    // Check for updates when page gains focus (returning from admin panel)
    window.addEventListener('focus', function() {
        if (window.portfolioUpdater) {
            window.portfolioUpdater.refresh();
        }
    });
}

// Initialize when DOM is loaded - prevent multiple initializations
document.addEventListener('DOMContentLoaded', function() {
    // Check if already initialized
    if (window.portfolioUpdaterInitialized) {
        return;
    }
    
    window.portfolioUpdaterInitialized = true;
    window.portfolioUpdater = new PortfolioUpdater();
    setupAutoRefresh();
    
    // Preview version - no admin button
});

// Admin button removed for preview version

// Export for use in other scripts
window.PortfolioUpdater = PortfolioUpdater;

// Global function to force a clean update (useful for debugging duplication issues)
window.forcePortfolioUpdate = function() {
    if (window.portfolioUpdater) {
        window.portfolioUpdater.forceUpdate();
    }
};

// Global function to manually clear hero text duplication
window.fixHeroDuplication = function() {
    const heroH1 = document.getElementById('hero-name');
    if (heroH1) {
        // Get current name from localStorage or use default
        const savedData = localStorage.getItem('portfolioData');
        let name = 'Alex Johnson';
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                name = data.personal?.fullName || name;
            } catch (e) {
                console.error('Error parsing saved data');
            }
        }
        
        // Force clean replacement
        heroH1.innerHTML = `Hello, I'm <span class="highlight">${name}</span>`;
        console.log('Hero duplication fixed! Name set to:', name);
    }
};

// Global function to download resume
window.downloadResume = function() {
    const savedData = localStorage.getItem('portfolioData');
    if (!savedData) {
        alert('No resume available for download');
        return;
    }

    try {
        const data = JSON.parse(savedData);
        const resumeUrl = data.personal?.resumeUrl;
        const resumeFileName = data.personal?.resumeFileName || 'resume';
        
        if (!resumeUrl) {
            alert('No resume available for download');
            return;
        }

        // Check if it's a data URL (uploaded file) or external URL
        if (resumeUrl.startsWith('data:')) {
            // Handle uploaded file (data URL)
            const link = document.createElement('a');
            link.href = resumeUrl;
            
            // Determine file extension from data URL
            let extension = 'pdf';
            if (resumeUrl.includes('application/msword')) {
                extension = 'doc';
            } else if (resumeUrl.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
                extension = 'docx';
            }
            
            link.download = resumeFileName || `${data.personal?.fullName || 'resume'}.${extension}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Handle external URL
            window.open(resumeUrl, '_blank');
        }
    } catch (e) {
        console.error('Error downloading resume:', e);
        alert('Error downloading resume');
    }
};

// Initialize the portfolio updater when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const updater = new PortfolioUpdater();
    updater.init();
});