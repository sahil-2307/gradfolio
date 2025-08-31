// Advanced Portfolio Dynamic Content Updater
class AdvancedPortfolioUpdater {
    constructor() {
        this.defaultData = {
            personal: {
                fullName: "Sahil Bhujbal",
                designation: "Full Stack Developer",
                heroDescription: "Passionate about creating innovative digital solutions that blend creativity with cutting-edge technology. I transform ideas into immersive experiences.",
                typingRoles: ["Full Stack Developer", "UI/UX Designer", "Creative Coder", "Problem Solver"],
                profilePhoto: "",
                resumeUrl: "",
                resumeFileName: ""
            },
            about: {
                title: "Creative Developer & Problem Solver",
                description: "I'm a passionate full-stack developer with over 3 years of experience creating digital experiences that make a difference. My journey began with curiosity about how things work, and it has evolved into a deep love for crafting elegant solutions to complex problems.",
                whatIDo: "I specialize in building modern web applications using cutting-edge technologies. From responsive frontends to scalable backends, I create comprehensive solutions.",
                myApproach: "I believe in clean code, user-centered design, and continuous learning. Every project is an opportunity to push boundaries and explore new possibilities.",
                stats: {
                    projects: 50,
                    experience: 3,
                    clients: 25,
                    technologies: 15
                }
            },
            skills: {
                categories: [
                    {
                        id: "frontend",
                        name: "Frontend Development",
                        icon: "fas fa-palette",
                        skills: [
                            { name: "React.js", level: 95 },
                            { name: "JavaScript", level: 92 },
                            { name: "CSS/SASS", level: 90 },
                            { name: "TypeScript", level: 88 }
                        ]
                    },
                    {
                        id: "backend",
                        name: "Backend Development",
                        icon: "fas fa-server",
                        skills: [
                            { name: "Node.js", level: 90 },
                            { name: "Python", level: 85 },
                            { name: "Express.js", level: 88 },
                            { name: "MongoDB", level: 82 }
                        ]
                    },
                    {
                        id: "tools",
                        name: "Tools & Technologies",
                        icon: "fas fa-tools",
                        skills: [
                            { name: "Git & GitHub", level: 93 },
                            { name: "Docker", level: 80 },
                            { name: "AWS", level: 75 },
                            { name: "Figma", level: 85 }
                        ]
                    }
                ]
            },
            experience: [
                {
                    id: "exp1",
                    title: "Senior Full Stack Developer",
                    company: "Tech Innovators Inc.",
                    duration: "2024 - Present",
                    description: "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and architecting solutions for complex business requirements.",
                    tags: ["React", "Node.js", "AWS", "Leadership"]
                },
                {
                    id: "exp2",
                    title: "Full Stack Developer",
                    company: "Digital Solutions Ltd.",
                    duration: "2023 - 2024",
                    description: "Developed and maintained multiple client projects, implemented CI/CD pipelines, and collaborated with cross-functional teams to deliver high-quality software solutions.",
                    tags: ["Vue.js", "Python", "Docker", "MongoDB"]
                },
                {
                    id: "exp3",
                    title: "Frontend Developer",
                    company: "Creative Web Agency",
                    duration: "2022 - 2023",
                    description: "Specialized in creating responsive and interactive user interfaces. Worked closely with designers to implement pixel-perfect designs and optimize user experience.",
                    tags: ["JavaScript", "CSS3", "SASS", "Figma"]
                }
            ],
            projects: [
                {
                    id: "proj1",
                    title: "E-Commerce Platform",
                    description: "A full-featured e-commerce platform with user authentication, payment processing, and admin dashboard. Built with modern technologies for optimal performance.",
                    category: "web",
                    technologies: ["React", "Node.js"],
                    githubUrl: "",
                    liveUrl: "",
                    featured: true
                },
                {
                    id: "proj2",
                    title: "Task Management App",
                    description: "Collaborative task management application with real-time updates, team collaboration features, and advanced project tracking capabilities.",
                    category: "web",
                    technologies: ["Vue.js", "Python"],
                    githubUrl: "",
                    liveUrl: "",
                    featured: true
                },
                {
                    id: "proj3",
                    title: "Fitness Tracker",
                    description: "Mobile application for tracking fitness activities, monitoring progress, and connecting with a community of fitness enthusiasts.",
                    category: "mobile",
                    technologies: ["React Native", "Firebase"],
                    githubUrl: "",
                    liveUrl: "",
                    featured: true
                },
                {
                    id: "proj4",
                    title: "Banking App Design",
                    description: "Modern and intuitive banking application design focused on user experience, accessibility, and seamless financial transaction flows.",
                    category: "design",
                    technologies: ["Figma", "UI/UX"],
                    githubUrl: "",
                    liveUrl: "",
                    featured: false
                }
            ],
            contact: {
                email: "sahil@example.com",
                phone: "+1 (555) 123-4567",
                location: "San Francisco, CA",
                socialLinks: [
                    { id: "linkedin", name: "LinkedIn", url: "", icon: "fab fa-linkedin-in" },
                    { id: "github", name: "GitHub", url: "", icon: "fab fa-github" },
                    { id: "twitter", name: "Twitter", url: "", icon: "fab fa-twitter" },
                    { id: "instagram", name: "Instagram", url: "", icon: "fab fa-instagram" }
                ]
            },
            theme: {
                primaryColor: "#667eea",
                secondaryColor: "#764ba2",
                accentColor: "#f093fb",
                backgroundColor: "#0a0a0a"
            }
        };
        
        this.data = this.loadData();
        this.init();
    }
    
    loadData() {
        const savedData = localStorage.getItem('advancedPortfolioData');
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
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.updateContent());
        } else {
            this.updateContent();
        }
    }
    
    updateContent() {
        this.updatePersonalInfo();
        this.updateAboutSection();
        this.updateSkillsSection();
        this.updateExperienceSection();
        this.updateProjectsSection();
        this.updateContactSection();
        this.updateTheme();
        this.updateProfilePhoto();
        // Preview version - no admin button
    }
    
    updatePersonalInfo() {
        // Update hero name
        const heroName = document.querySelector('.hero-name .name-text');
        if (heroName) {
            heroName.textContent = this.data.personal.fullName;
        }
        
        // Update designation (appears in changing roles)
        const roleText = document.getElementById('changing-role');
        if (roleText && this.data.personal.typingRoles?.length > 0) {
            // The typing animation will use this data
            window.portfolioTypingRoles = this.data.personal.typingRoles;
            
            // If the portfolio instance exists, reinitialize typing animation
            if (window.portfolio && window.portfolio.initTypingAnimation) {
                window.portfolio.initTypingAnimation();
            }
        }
        
        // Update hero description
        const heroDesc = document.querySelector('.hero-description');
        if (heroDesc) {
            heroDesc.textContent = this.data.personal.heroDescription;
        }
        
        // Update navigation logo
        const navLogo = document.querySelector('.nav-logo .logo-text');
        if (navLogo) {
            const firstName = this.data.personal.fullName.split(' ')[0].toUpperCase();
            navLogo.textContent = firstName;
        }
        
        // Update footer
        const footerLogo = document.querySelector('.footer-logo .logo-text');
        if (footerLogo) {
            const firstName = this.data.personal.fullName.split(' ')[0].toUpperCase();
            footerLogo.textContent = firstName;
        }
        
        const footerBottom = document.querySelector('.footer-bottom p');
        if (footerBottom) {
            footerBottom.innerHTML = `&copy; 2024 ${this.data.personal.fullName}. All rights reserved. Made with <i class="fas fa-heart"></i> and lots of coffee.`;
        }
    }
    
    updateAboutSection() {
        // Update about title
        const aboutTitle = document.querySelector('.about-intro h3');
        if (aboutTitle) {
            aboutTitle.textContent = this.data.about.title;
        }
        
        // Update main description
        const aboutDesc = document.querySelector('.about-intro p');
        if (aboutDesc) {
            aboutDesc.textContent = this.data.about.description;
        }
        
        // Update detail items
        const detailItems = document.querySelectorAll('.detail-item');
        if (detailItems.length >= 2) {
            const whatIDoP = detailItems[0].querySelector('p');
            const myApproachP = detailItems[1].querySelector('p');
            
            if (whatIDoP) whatIDoP.textContent = this.data.about.whatIDo;
            if (myApproachP) myApproachP.textContent = this.data.about.myApproach;
        }
        
        // Update stats
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length >= 4 && this.data.about.stats) {
            statNumbers[0].setAttribute('data-count', this.data.about.stats.projects);
            statNumbers[1].setAttribute('data-count', this.data.about.stats.experience);
            statNumbers[2].setAttribute('data-count', this.data.about.stats.clients);
            statNumbers[3].setAttribute('data-count', this.data.about.stats.technologies);
        }
    }
    
    updateSkillsSection() {
        const skillsContainer = document.querySelector('.skills-categories');
        if (!skillsContainer || !this.data.skills?.categories) return;
        
        skillsContainer.innerHTML = '';
        
        this.data.skills.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'skill-category';
            categoryDiv.setAttribute('data-category', category.id);
            
            const skillsHTML = category.skills.map(skill => `
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${skill.level}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-width="${skill.level}"></div>
                    </div>
                </div>
            `).join('');
            
            categoryDiv.innerHTML = `
                <div class="category-header">
                    <i class="${category.icon}"></i>
                    <h3>${category.name}</h3>
                </div>
                <div class="skills-list">
                    ${skillsHTML}
                </div>
            `;
            
            skillsContainer.appendChild(categoryDiv);
        });
    }
    
    updateExperienceSection() {
        const timeline = document.querySelector('.timeline');
        if (!timeline || !this.data.experience?.length) return;
        
        timeline.innerHTML = '';
        
        this.data.experience.forEach((exp, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.setAttribute('data-year', exp.duration.split(' - ')[0]);
            
            const tagsHTML = exp.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || '';
            
            timelineItem.innerHTML = `
                <div class="timeline-marker">
                    <div class="timeline-dot"></div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-date">${exp.duration}</div>
                    <h3 class="timeline-title">${exp.title}</h3>
                    <h4 class="timeline-company">${exp.company}</h4>
                    <p class="timeline-description">${exp.description}</p>
                    <div class="timeline-tags">${tagsHTML}</div>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
    }
    
    updateProjectsSection() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid || !this.data.projects?.length) return;
        
        projectsGrid.innerHTML = '';
        
        this.data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category);
            
            const techStackHTML = project.technologies?.map(tech => 
                `<span class="tech-tag">${tech}</span>`
            ).join('') || '';
            
            const linksHTML = `
                ${project.liveUrl ? `
                    <a href="${project.liveUrl}" class="project-link" data-tooltip="View Live" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
                ${project.githubUrl ? `
                    <a href="${project.githubUrl}" class="project-link" data-tooltip="View Code" target="_blank">
                        <i class="fab fa-github"></i>
                    </a>
                ` : ''}
            `;
            
            projectCard.innerHTML = `
                <div class="project-image">
                    <div class="project-overlay">
                        <div class="project-links">
                            ${linksHTML}
                        </div>
                    </div>
                    <div class="project-tech-stack">
                        ${techStackHTML}
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                </div>
            `;
            
            projectsGrid.appendChild(projectCard);
        });
    }
    
    updateContactSection() {
        // Update contact details
        const contactItems = document.querySelectorAll('.contact-item');
        if (contactItems.length >= 3) {
            const emailP = contactItems[0].querySelector('.contact-details p');
            const phoneP = contactItems[1].querySelector('.contact-details p');
            const locationP = contactItems[2].querySelector('.contact-details p');
            
            if (emailP) emailP.textContent = this.data.contact.email;
            if (phoneP) phoneP.textContent = this.data.contact.phone;
            if (locationP) locationP.textContent = this.data.contact.location;
        }
        
        // Update social links in hero
        const heroSocial = document.querySelector('.hero-social');
        if (heroSocial && this.data.contact.socialLinks) {
            heroSocial.innerHTML = '';
            this.data.contact.socialLinks.forEach(link => {
                if (link.url) {
                    const socialLink = document.createElement('a');
                    socialLink.href = link.url;
                    socialLink.className = 'social-link';
                    socialLink.setAttribute('data-tooltip', link.name);
                    socialLink.target = '_blank';
                    socialLink.innerHTML = `<i class="${link.icon}"></i>`;
                    heroSocial.appendChild(socialLink);
                }
            });
        }
        
        // Update footer social links
        const footerSocial = document.querySelector('.footer-social');
        if (footerSocial && this.data.contact.socialLinks) {
            footerSocial.innerHTML = '';
            this.data.contact.socialLinks.forEach(link => {
                if (link.url) {
                    const socialLink = document.createElement('a');
                    socialLink.href = link.url;
                    socialLink.className = 'social-link';
                    socialLink.target = '_blank';
                    socialLink.innerHTML = `<i class="${link.icon}"></i>`;
                    footerSocial.appendChild(socialLink);
                }
            });
        }
    }
    
    updateTheme() {
        const root = document.documentElement;
        if (this.data.theme) {
            root.style.setProperty('--primary-color', this.data.theme.primaryColor);
            root.style.setProperty('--secondary-color', this.data.theme.secondaryColor);
            root.style.setProperty('--accent-color', this.data.theme.accentColor);
            root.style.setProperty('--bg-primary', this.data.theme.backgroundColor);
            
            // Update gradients
            root.style.setProperty('--gradient-primary', 
                `linear-gradient(135deg, ${this.data.theme.primaryColor} 0%, ${this.data.theme.secondaryColor} 100%)`);
            root.style.setProperty('--gradient-secondary', 
                `linear-gradient(135deg, ${this.data.theme.accentColor} 0%, ${this.data.theme.primaryColor} 100%)`);
        }
    }
    
    updateProfilePhoto() {
        const avatarImage = document.querySelector('.avatar-image');
        if (!avatarImage) return;
        
        if (this.data.personal.profilePhoto) {
            avatarImage.innerHTML = `
                <img src="${this.data.personal.profilePhoto}" 
                     alt="${this.data.personal.fullName}" 
                     class="profile-photo"
                     style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            avatarImage.innerHTML = '<i class="fas fa-user-tie"></i>';
        }
    }
    
    // Admin button removed for preview version
    
    // Method to refresh data (called when returning from admin panel)
    refresh() {
        const oldData = JSON.stringify(this.data);
        this.data = this.loadData();
        const newData = JSON.stringify(this.data);
        
        // Only update if data actually changed
        if (oldData !== newData) {
            this.updateContent();
        }
    }
}

// Auto-update functionality
function setupAutoRefresh() {
    // Listen for storage changes (when data is updated in admin panel)
    window.addEventListener('storage', function(e) {
        if (e.key === 'advancedPortfolioData') {
            if (window.advancedPortfolioUpdater) {
                window.advancedPortfolioUpdater.refresh();
            }
        }
    });

    // Check for updates when page gains focus (returning from admin panel)
    window.addEventListener('focus', function() {
        if (window.advancedPortfolioUpdater) {
            window.advancedPortfolioUpdater.refresh();
        }
    });
}

// Initialize the updater
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the portfolio updater
    window.advancedPortfolioUpdater = new AdvancedPortfolioUpdater();
    setupAutoRefresh();
    
    // Update typing animation roles if they exist
    if (window.portfolioRoles && typeof window.portfolio !== 'undefined') {
        // This will be used by the typing animation in script.js
        window.portfolioTypingRoles = window.portfolioRoles;
    }
});

// Export for use in other scripts
window.AdvancedPortfolioUpdater = AdvancedPortfolioUpdater;